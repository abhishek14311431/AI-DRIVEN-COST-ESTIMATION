"""
Constants for AI-based Construction Cost Estimation backend.

This module contains only immutable configuration values used across the
application: base rates, supported plot sizes, multipliers, fixed component
costs, and the inflation rate.
"""


BASE_STRUCTURE_RATE: int = 1690  
BASE_FINISH_RATE: int = 850      



PLOT_SIZES: dict[str, int] = {
    "20x30": 600,
    "20x40": 800,
    "30x40": 1_200,
    "30x50": 1_500,
}



TIER_MULTIPLIER: dict[str, float] = {
    "Basic": 1.00,
    "Classic": 1.18,
    "Premium": 1.35,
    "Luxury": 1.55,
    "Luxury Plus": 1.75,
}



FIXED_COSTS: dict[str, int] = {
    "compound": 300_000,
    "water_sump": 0,   
    "septic_tank": 50_000,  
    "lift": 1_000_000,
    "rain_water_harvesting": 85_000,
}



SITE_TYPE_MULTIPLIER: dict[str, float] = {
    "half": 0.5,  
    "full": 1.0,
    "double": 2.0,
}



FAMILY_ADJUSTMENT: dict[str, float] = {
    "num_members": 0.05,  
    "family-size": 0.05,
    "total-members": 0.05,
    "num_rooms": 0.1,     
    "bedrooms": 0.12,    
    "children": 0.04,     
    "grandparent_room": 0.08,  
    "grandparents": 0.08,
}



MATERIAL_COSTS: dict[str, dict[str, int]] = {
    "Basic": {
        "flooring": 0,  
        "walls": 0,
        "ceiling": 0,
    },
    "Classic": {
        "flooring": 80,  
        "walls": 30,
        "ceiling": 17,
    },
    "Premium": {
        "flooring": 650, 
        "walls": 200,
        "ceiling": 100,
    },
    "Luxury": {
        "flooring": 1300, 
        "walls": 350,
        "ceiling": 200,
    },
    "Luxury Plus": {
        "flooring": 2200,
        "walls": 600,
        "ceiling": 400,
    },
}



INFLATION_RATE: float = 0.02  



STRUCTURE_BREAKDOWN: dict[str, float] = {
    "Excavation & Earthwork (Site Prep)": 0.050,            
    "Foundation RCC & Pedestals (incl. Sump)": 0.172,      
    "Plinth Beam & Ground PCC Work": 0.100,                 
    "Superstructure RCC (Columns/Beams/Slab)": 0.258,       
    "External Brickwork (9-inch Walls)": 0.180,             
    "Internal Partition Walls & Loft Work": 0.129,          
    "Plastering (Internal & External finish)": 0.061,       
    "Terrace Waterproofing & Parapet Walls": 0.050          
}

FINISH_BREAKDOWN: dict[str, float] = {
    "Main Flooring (Incl. Granite Stairs)": 0.40,               
    "Wall Tiling (Kitchen & Bathroom areas)": 0.05,             
    "Plumbing, Sanitary & Overhead Tank System": 0.25,          
    "Electrical (Concealed Wiring + Modular Switches)": 0.10,    
    "Painting (Internal Putty + External Weather-shield)": 0.07, 
    "Doors & Windows (Teak Main + UPVC Systems)": 0.13          
}

TIER_FEATURES: dict[str, list[str]] = {
    "Basic": [
        "Economy Ceramic Tiles (2x2)",
        "Standard Internal Putty & Distemper",
        "Flush Doors with Paint Finish",
        "Concealed Copper Wiring (Generic)",
        "Standard Sanitary Fittings (Branded-Eco)"
    ],
    "Classic": [
        "Designer Granite Stairs (Single Piece)",
        "Premium Vitrified Tiles (4x2)",
        "Luster/Emulsion Paint Finish",
        "Teak Wood Main Door Frame",
        "Modular Switch Plates & FR Wiring"
    ],
    "Premium": [
        "Premium South Indian Granite Flooring",
        "Royal Emulsion Texture Walls",
        "Full Teak Wood Main Door & Frames",
        "Jaquar/Kohler Premium Fixtures",
        "Legrand/Schneider Electric Systems"
    ],
    "Luxury": [
        "Italian Marble (Dyna/Statuary) Flooring",
        "PU Finish Walls & Designer Wallpapers",
        "Smart Home Automation (Basic Integration)",
        "Imported Wellness Sanitary Systems",
        "Designer UPVC/Aluminium Slim Windows"
    ],
    "Luxury Plus": [
        "Imported Italian Botticino Marble Flooring",
        "Full IoT Smart Home Ecosystem (Voice & App)",
        "Private Home Cinema with Acoustic Paneling",
        "Indoor Oxygen-Rich Vertical Garden",
        "Gourmet Kitchen with Built-in Appliances",
        "Spa-Grade Wellness Bathroom with Jacuzzi",
        "Biometric Security & Surveillance Hub",
        "Solar-Powered Hybrid Energy System",
        "Designer Glass Elevator (Panoramic View)",
        "Soundproof Study with Leather Wall Panels",
        "Motorized Curtains & Lighting Scenes",
        "Multi-Zone Climate Control (HVAC)",
        "Grand Entrance Solid Rosewood Carvings",
        "Underfloor Heating & Cooling System",
        "Professional Grade Gym & Yoga Studio"
    ]
}
