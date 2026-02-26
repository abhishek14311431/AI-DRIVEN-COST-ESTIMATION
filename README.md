# 🏗️ Construction AI Cost Estimator

A premium, AI-driven construction cost estimation platform built with **FastAPI** and **React**. This application provides architectural-grade valuations with a high-density "Liquid Glass" user interface.

## 🚀 Key Features
- **Smart Breakdown Engine**: 18-Component distribution based on civil engineering ratios.
- **Dynamic Logic**: Adjusts costs based on plot size, bedroom count, floor height, and plan quality.
- **Real-time Animations**: CountUp financial engines for live valuation updates.
- **Premium Aesthetics**: Multi-layered backdrop blur, neon HUD elements, and deep-space theme.

## 🗺️ Application Page Flow

The application follows a 4-stage linear flow:

```
[1. Dashboard] → [2. Project Selection] → [3. Project Wizard] → [4. Estimation Result]
```

| # | Page | File | Description |
| :--- | :--- | :--- | :--- |
| **1** | **Dashboard** | `frontend/src/pages/Dashboard.jsx` | Landing screen with live clock/greeting, "New Project" and "View Archives" action cards. |
| **2** | **Project Selection** | `frontend/src/pages/ProjectSelection.jsx` | Grid of 6 project type cards — Dream House 🏠, Rental Homes 🏢, Villa 🏰, Commercial 🏙️, Interior 🛋️, Exterior 🌳. Clicking a card launches the wizard. |
| **3** | **Project Wizard** | `frontend/src/pages/ProjectWizard.jsx` | Multi-step input wizard. Steps vary by project type. For **Dream House** the full 7-step sequence is: |
| | *Step 1* | | Plot & Dimensions — choose plot size and exact dimensions (e.g. 30×40, 40×60). |
| | *Step 2* | | Building Height & Grade — select floors (G+1 / G+2 / G+3) and build grade (Base / Classic / Premium / Elite). |
| | *Step 3* | | Additional Details — family size, bedrooms, lift, pooja room, etc. |
| | *Step 4* | | Review Your Plan — summary of all choices plus optional add-ons (Compound Wall, Rainwater, Parking). |
| | *Step 5* | | Interior Selection — choose interior package (None / Base / Semi / Full Furnished). |
| | *Step 6* | | Project Specifications & Add-ons — toggle individual feature add-ons. |
| | *Step 7* | | Cost Estimation — triggers the AI estimation and transitions to the Result page. |
| **4** | **Estimation Result** | `frontend/src/pages/EstimationResult.jsx` | Displays total estimated investment and an 18-component itemized breakdown sorted by highest cost. Provides a "Secure This Valuation" save action and a "Re-Evaluate" back button. |

> **Navigation state** is managed centrally in `App.jsx` via the `view` state variable (`'dashboard'` → `'selection'` → `'wizard'` → `'result'`). The wizard step index is tracked via the `step` state variable.

## 🧠 DSA Concepts Used

| DSA Concept | Implementation Area | File Path |
| :--- | :--- | :--- |
| **Priority Queue (Max-Heap)** | Sorting the cost breakdown by "Highest Cost First" to prioritize structural visibility. | `app/engines/breakdown_engine.py` |
| **Hash Maps (Dictionaries)** | O(1) constant-time lookups for plot rules, material rates, and category configuration. | `app/core/constants.py` |
| **Stateful Iteration** | Management of multi-step wizard logic and input synthesis. | `frontend/src/pages/ProjectWizard.jsx` |
| **Normalization Algorithms** | Re-calculating percentage weights dynamically after plan multipliers are applied. | `app/engines/breakdown_engine.py` |
| **Conditional Control Flow** | Complex decision branching for optional features (Compound, Rainwater, etc.). | `app/engines/own_house_engine.py` |
| **Linear Time (O(N)) Mapping** | Rendering high-density intelligence grids from backend JSON payloads. | `frontend/src/pages/ProjectWizard.jsx` |

## ⚡ Performance Optimizations
- **IPv4 Hardcoding**: API calls use `127.0.0.1` instead of `localhost` to bypass Windows DNS resolution lag.
- **Stateless Estimation**: The `/estimate` route is decoupled from the database to ensure sub-millisecond calculation speeds.
- **Animation Scaling**: Perceived performance enhanced with 800ms tweening for financial tickers.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, CSS (Glassmorphism)
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: SQLite (Default for High Availability)
- **Logic**: 2026 Smart Breakdown Engine
