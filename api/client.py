## Client for interacting with the API

import requests
from fastapi import FastAPI
import json

app = FastAPI()

root = "http://api.marketstack.com/v1/"
token = "YOUR_ACCESS_KEY"

# return the open , close , high , low and volume for the given symbols for the last 30 days 
@app.get("/api/eod")
def get_date(symbols: str, *args, **kwargs):
    response = requests.get(f"{root}/eod?access_key={token}&symbols={symbols}")
    
    if response.status_code != 200:
        return {"error": "Failed to fetch data from the API"}
    else :
        response_date = response.json()


    return response.json() 

help(json)