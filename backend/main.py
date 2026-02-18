import sys
import time
from typing import Any, Dict, List
from .engines.upgrade_engine import UpgradeEngine

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .models.request_schema import EstimateRequest
from .engines.rental_engine import RentalEngine
from .engines.ownhouse_engine import OwnHouseEngine
from .engines.breakdown_engine import BreakdownEngine
from .engines.xai_engine import XAIEngine
from .report.pdf_generator import PDFGenerator
from .database.db import init_db
from .upgrade_suggestions import generate_upgrade_suggestions

init_db()

app = FastAPI(title="AI Construction Cost Estimation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from .engines.commercial_engine import CommercialEngine
from .engines.villa_engine import VillaEngine
from .engines.interior_engine import InteriorEngine
from .engines.exterior_engine import ExteriorEngine


@app.get("/")
def root():
    return {"status": "running"}


@app.post("/estimate")
async def estimate(request: EstimateRequest) -> Dict[str, Any]:
	try:
		start_time = time.time()
		payload = request.dict()

		project_type = payload["project_type"]
		plot_size = payload["plot_size"]
		if plot_size in ["full-site", "half-site", "double-site"] and payload.get("dimensions"):
			plot_size = payload["dimensions"]

		floors_raw = payload["floors"]
		floors = 1
		if isinstance(floors_raw, int):
			floors = floors_raw
		elif isinstance(floors_raw, str):
			if "g+" in floors_raw.lower():
				try:
					floors = int(floors_raw.lower().replace("g+", "")) + 1
				except:
					floors = 1
			else:
				try:
					floors = int(floors_raw)
				except:
					floors = 1

		selected_tier_raw = payload["selected_tier"]
		selected_tier = selected_tier_raw.capitalize() if selected_tier_raw else "Basic"
		if selected_tier == "Base":
			selected_tier = "Basic"

		site_type = payload.get("site_type", "full")
		family_details = payload["family_details"]
		lift_required = payload.get("lift_required", False)
		generate_pdf = payload.get("generate_pdf", False)
		upgrades = payload.get("upgrades", {})
		interior = payload.get("interior", None)

		engine_project_type = project_type
		if project_type in ["dream-house", "own-house"]:
			engine_project_type = "own_house"
		elif project_type in ["rental-homes", "rental"]:
			engine_project_type = "rental"
		elif project_type == "villa":
			engine_project_type = "villas"
		elif project_type == "interiors":
			engine_project_type = "interior"
		elif project_type == "exteriors":
			engine_project_type = "exterior"
			
		if engine_project_type == "rental":
			base_result = RentalEngine(plot_size, floors, lift_required, site_type, family_details).calculate_rental_cost()
		elif engine_project_type == "own_house":
			base_result = OwnHouseEngine(plot_size, floors, lift_required, site_type, family_details).calculate_ownhouse_cost()
		elif engine_project_type == "commercial":
			base_result = CommercialEngine(plot_size, floors, lift_required, site_type, family_details).calculate_commercial_cost()
		elif engine_project_type == "villas":
			base_result = VillaEngine(plot_size, floors, lift_required, site_type, family_details).calculate_villa_cost()
		elif engine_project_type == "interior":
			base_result = InteriorEngine(plot_size, floors, site_type, family_details).calculate_interior_cost()
		elif engine_project_type == "exterior":
			base_result = ExteriorEngine(plot_size, floors, site_type, family_details).calculate_exterior_cost()
		else:
			base_result = OwnHouseEngine(plot_size, floors, lift_required, site_type, family_details).calculate_ownhouse_cost()

		if upgrades:
			base_result["upgrades"] = upgrades
		if interior:
			base_result["interior_package"] = interior
			
		base_result["compound_wall_required"] = payload.get("compound_wall", False)
		base_result["rain_water_harvesting_required"] = payload.get("rain_water_harvesting", False)

		breakdown = BreakdownEngine(base_result, selected_tier).generate_final_breakdown()
		explanation = XAIEngine(breakdown).generate_explanation()
		breakdown["selected_tier"] = selected_tier

		pdf_generated = False
		if generate_pdf:
			pdf_payload = breakdown.copy()
			pdf_payload["explanation"] = explanation
			pdf = PDFGenerator(pdf_payload, "estimation_report.pdf")
			pdf.generate_pdf()
			pdf_generated = True

		upgrade_suggestions = generate_upgrade_suggestions(
			breakdown, selected_tier,
			family_details=family_details,
			lift_required=lift_required,
			project_type=engine_project_type
		)

		print(f"[API] Estimate generated in {time.time() - start_time:.2f}s")
		return {
			"breakdown": breakdown, 
			"explanation": explanation, 
			"upgrade_suggestions": upgrade_suggestions, 
			"pdf_generated": pdf_generated
		}

	except ValueError as exc:
		print(f"[ERR] ValueError: {str(exc)}")
		raise HTTPException(status_code=400, detail=str(exc))
	except HTTPException as exc:
		print(f"[ERR] HTTPException: {str(exc)}")
		raise
	except Exception as e:
		print(f"[ERR] Unexpected: {str(e)}")
		import traceback
		traceback.print_exc()
		raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


from fastapi.responses import FileResponse, StreamingResponse
import io

@app.post("/generate-pdf")
async def generate_pdf_endpoint(payload: Dict[str, Any]):
	try:
		print("\n" + "="*50)
		print("[API] PDF GENERATION REQUEST")
		print("="*50)
		
		pdf_buffer = io.BytesIO()
		
		from .report.pdf_generator import PDFGenerator
		pdf = PDFGenerator(payload, pdf_buffer)
		pdf.generate_pdf()
		
		pdf_buffer.seek(0)
		
		filename = f"Cost_Estimate_{payload.get('project_type', 'Project')}.pdf"
		
		return StreamingResponse(
			pdf_buffer, 
			media_type="application/pdf", 
			headers={"Content-Disposition": f"attachment; filename={filename}"}
		)
	except Exception as e:
		print(f"[ERR] PDF Gen: {str(e)}")
		import traceback
		traceback.print_exc()
		raise HTTPException(status_code=500, detail=str(e))


@app.post("/calculate-upgrade")
async def calculate_upgrade(payload: Dict[str, Any]):
	try:
		current_features = payload.get("current_features", [])
		target_tier = payload.get("target_tier", "Basic")
		current_total_cost = payload.get("current_total_cost", 0)
		
		result = UpgradeEngine.calculate_upgrade_difference(
			current_features, target_tier, current_total_cost
		)
		return result
	except Exception as e:
		print(f"[ERR] Upgrade Calc: {str(e)}")
		raise HTTPException(status_code=500, detail=str(e))
