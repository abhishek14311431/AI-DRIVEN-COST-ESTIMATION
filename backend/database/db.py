import sqlite3
from typing import Dict, List, Any
import json

DATABASE_PATH = "construction_costs.db"

def init_db():
    """Initialize the database and create tables if they don't exist."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS estimates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT,
            client_name TEXT,
            project_type TEXT,
            plot_size TEXT,
            floors INTEGER,
            selected_tier TEXT,
            site_type TEXT,
            family_details TEXT,  -- JSON string
            lift_required BOOLEAN,
            final_cost REAL,
            breakdown TEXT,      -- JSON string
            upgrades TEXT,       -- JSON string
            active_upgrade_features TEXT, -- JSON string
            signature TEXT,      -- Base64 string
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_estimate(estimate_data: Dict[str, Any]):
    """Save an estimate to the database."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO estimates (
            project_id, client_name, project_type, plot_size, floors, 
            selected_tier, site_type, family_details, lift_required, 
            final_cost, breakdown, upgrades, active_upgrade_features, signature
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        estimate_data.get("project_id"),
        estimate_data.get("client_name"),
        estimate_data.get("project_type"),
        estimate_data.get("plot_size"),
        estimate_data.get("floors"),
        estimate_data.get("selected_tier"),
        estimate_data.get("site_type"),
        json.dumps(estimate_data.get("family_details", {})),
        estimate_data.get("lift_required", False),
        estimate_data.get("final_cost"),
        json.dumps(estimate_data.get("breakdown", {})),
        json.dumps(estimate_data.get("upgrades", {})),
        json.dumps(estimate_data.get("active_upgrade_features", [])),
        estimate_data.get("signature")
    ))
    conn.commit()
    conn.close()

def get_historical_data() -> List[Dict[str, Any]]:
    """Retrieve historical estimates for training."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM estimates ORDER BY created_at DESC')
    rows = cursor.fetchall()
    # Get column names from cursor description
    columns = [description[0] for description in cursor.description]
    conn.close()
    
    data = []
    for row in rows:
        item = dict(zip(columns, row))
        
        # Parse JSON fields
        for field in ["family_details", "breakdown", "upgrades", "active_upgrade_features"]:
            if item.get(field):
                try:
                    item[field] = json.loads(item[field])
                except:
                    item[field] = {} if field != "active_upgrade_features" else []
            else:
                item[field] = {} if field != "active_upgrade_features" else []
        
        # Convert lift_required to boolean
        if "lift_required" in item:
            item["lift_required"] = bool(item["lift_required"])
            
        data.append(item)
    return data
