from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests

load_dotenv()
app = FastAPI(title="Flight_Data Backend", description="FastAPI backend for Flight_Data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT_LAMIN = os.getenv("LAMIN", "50.0")
DEFAULT_LOMIN = os.getenv("LOMIN", "-1.0")
DEFAULT_LAMAX = os.getenv("LAMAX", "52.0")
DEFAULT_LOMAX = os.getenv("LOMAX", "1.0")
OPENSKY_USER = os.getenv("OPENSKY_USER")
OPENSKY_PASS = os.getenv("OPENSKY_PASS")

@app.get("/flights")
def get_flights(lamin: float = Query(DEFAULT_LAMIN), lomin: float = Query(DEFAULT_LOMIN),
                lamax: float = Query(DEFAULT_LAMAX), lomax: float = Query(DEFAULT_LOMAX)):
    try:
        url = "https://opensky-network.org/api/states/all"
        params = {"lamin": lamin, "lomin": lomin, "lamax": lamax, "lomax": lomax}
        auth = (OPENSKY_USER, OPENSKY_PASS) if OPENSKY_USER and OPENSKY_PASS else None
        r = requests.get(url, params=params, auth=auth, timeout=10)
        r.raise_for_status()
        data = r.json()
        return {"success": True, "count": len(data.get("states", [])), "data": data}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": str(e)}

@app.get("/")
def root():
    return {"message": "Flight_Data Backend is running"}
