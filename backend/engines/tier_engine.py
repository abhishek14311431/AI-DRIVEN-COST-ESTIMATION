from ..utils.constants import TIER_MULTIPLIER, TIER_FEATURES as DESCRIPTIVE_TIER_FEATURES


class TierEngine:

    def __init__(self, base_total_cost: float, total_area: float, selected_tier: str):
        if selected_tier not in TIER_MULTIPLIER:
            raise ValueError(
                f"Invalid selected_tier: {selected_tier}. Valid tiers are: {list(TIER_MULTIPLIER.keys())}"
            )

        self.base_total_cost = base_total_cost
        self.total_area = total_area
        self.selected_tier = selected_tier

    def apply_tier_upgrade(self) -> dict:

        tier_multiplier = TIER_MULTIPLIER[self.selected_tier]
        
        if self.selected_tier == "Basic":
            upgrade_difference = 0
            upgraded_total_cost = self.base_total_cost
        else:
            # Upgrade is calculated as the percentage increase from total base cost
            # This ensures (Base + Upgrade) = Base * Multiplier
            upgrade_difference = self.base_total_cost * (tier_multiplier - 1.0)
            upgraded_total_cost = self.base_total_cost + upgrade_difference

        return {
            "selected_tier": self.selected_tier,
            "base_total_cost": round(self.base_total_cost),
            "upgraded_total_cost": round(upgraded_total_cost),
            "upgrade_difference": round(upgrade_difference),
            "tier_multiplier": tier_multiplier,
            "tier_features": DESCRIPTIVE_TIER_FEATURES.get(self.selected_tier, [])
        }
