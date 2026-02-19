
import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

from backend.engines.breakdown_engine import BreakdownEngine
from backend.utils.constants import TIER_MULTIPLIER

print(f"DEBUG: TIER_MULTIPLIER['Classic'] = {TIER_MULTIPLIER.get('Classic')}")

# Mock base result
base_result = {
    "structure_cost": 4170920,
    "finish_cost": 2097800,
    "inflation_rate": 0.02,
    "total_area": 2468,
    "project_type": "own_house"
}

print(f"DEBUG: Base Construction Total = {base_result['structure_cost'] + base_result['finish_cost']}")

engine = BreakdownEngine(base_result, "Classic")
final = engine.generate_final_breakdown()

print(f"DEBUG: Upgrade Difference = {final.get('upgrade_difference')}")
print(f"DEBUG: Final Cost = {final.get('final_cost')}")
print(f"DEBUG: Calculated Multiplier = {final.get('upgrade_difference') / (base_result['structure_cost'] + base_result['finish_cost']):.4f}")
