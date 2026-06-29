# FraudShield AI — Backend Setup Guide

Welcome to the **FraudShield AI** backend repository. This backend is built using **FastAPI**, **SQLModel** (SQLAlchemy + Pydantic), and integrates with a live **XGBoost ML Model** deployed on Render to detect and flag suspicious banking transactions.

Follow this step-by-step guide to get the backend application up and running on your local machine.

---

## 📋 Prerequisites
Ensure you have the following installed on your system:
* **Python 3.10+** (Python 3.13 recommended)
* **Git**
* **PostgreSQL Database** (or a hosted database like Supabase)

---

## 🚀 Setup Instructions

### 1. Clone the Repository
Clone the project to your local machine and navigate to the root directory:
```bash
git clone <repository-url>
cd FraudShield
```

### 2. Set Up the Virtual Environment
Create and activate a Python virtual environment to isolate project dependencies.

* **On Windows (PowerShell):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
* **On Windows (CMD):**
  ```cmd
  python -m venv venv
  .\venv\Scripts\activate.bat
  ```
* **On macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

---

## 🛠️ Configure Environment Variables

1. Navigate into the `Backend` folder:
   ```bash
   cd Backend
   ```
2. Create a new file named `.env` inside the `Backend` folder.
3. Paste the following configuration template and fill in your connection details:

```ini
# ── Database Configuration ───────────────────────────────────────────────
# Replace with your local PostgreSQL or Supabase Connection String
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>

# ── JWT Token Security ───────────────────────────────────────────────────
# Generate a secure random string for signing JWT tokens in production
SECRET_KEY=fraudshield-super-secret-jwt-key-change-in-production-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# ── ML Model API ──────────────────────────────────────────────────────────
# Deployed XGBoost ML model endpoint URL (defaults to the live Render app)
ML_MODEL_URL=https://fraudshield-ai-9jnu.onrender.com/predict
ML_TIMEOUT_SECONDS=10

# ── App Meta ──────────────────────────────────────────────────────────────
DEBUG=True
```

---

## 📦 Install Dependencies
Ensure your virtual environment is active, then run:
```bash
pip install -r requirements.txt
```

---

## 🏁 Running the Application

You can start the FastAPI backend server using either of the following methods from inside the `Backend` directory:

### Option A: Run via python (Recommended)
This runs the entry-point script directly:
```bash
python main.py
```

### Option B: Run via Uvicorn
This starts the ASGI server directly with live-reload enabled:
```bash
uvicorn main:app --reload
```

---

## 📖 API Documentation & Testing

Once the server starts up successfully, open your browser and navigate to:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

This opens the interactive **Swagger UI** page where you can:
1. **Signup & Login** to receive a JWT Token.
2. Click **Authorize** (top right) and paste `Bearer <your_token>`.
3. Create accounts, perform money transfers, and watch the ML model predict transactions in real-time.

---

## 💡 Important Rules & Fallbacks Built-in

* **Welcome Balance:** Any new user signing up automatically starts with a welcome balance of **₹1,000.00** in their account.
* **Rapid-Fire Fraud Rule:** If a single account attempts to make **2 or more transactions within 60 seconds**, the transaction is immediately blocked with a `429 Too Many Requests` error *before* calling the ML model or moving money.
* **Offline ML Fallback:** If the Render ML model is offline, unreachable, or times out, the backend gracefully falls back to a rule-based stub prediction based on transaction amount thresholds to prevent breaking your flow.
