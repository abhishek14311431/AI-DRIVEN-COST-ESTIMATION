from typing import Dict, Any, List
from fastapi import HTTPException
from app.engines.breakdown_engine import BreakdownEngine

class OwnHouseEngine:
    @staticmethod
    def estimate_cost(data: dict) -> dict:
        """
        Wraps the 2026 Smart Breakdown Engine for the Own House flow.
        """
        # Mapping frontend boolean flags to engine-compatible flags if necessary
        # The frontend uses 'dimensions', 'bedrooms', 'floor', 'structural_style', 'include_lift', 'include_compound', etc.
        
        # Ensure 'include_compound', 'include_rainwater', 'include_parking', 'include_interior' are set correctly
        # Mapping frontend keys to engine-compatible flags
        data['include_compound'] = data.get('include_compound_wall', False)
        data['include_rainwater'] = data.get('include_rainwater_harvesting', False)
        data['include_parking'] = data.get('include_car_parking', False)
        data['include_lift'] = data.get('lift_required', False)
        data['include_interior'] = data.get('interior_package', 'none') != 'none'
        
        try:
            result = BreakdownEngine.calculate_smart_breakdown(data)
            return {
                'project_summary': result.get('summary', {}),
                'total_cost': result.get('total_cost', 0),
                'breakdown': result.get('breakdown', [])
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
