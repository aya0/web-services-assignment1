# COM4381 — Project 1: Consuming RESTful Web Service APIs

**Course:** COM4381 Web Services Technologies  
**Semester:** 2nd Semester 2025/2026  
**University:** Birzeit University  
**Due Date:** May 15, 2026 (in-class demo)

---

##  Group Members

| Name | Student ID |
|------|------------|
| Julia   | ID|
| Tala | ID |
| Aya Abd-Alkarim  | 1220020  |

---

##  Project Description

Mega Market is a financial web dashboard that consumes four public RESTful APIs to deliver stock market data, company insights, and financial news in a single unified interface.
The application demonstrates core REST principles — resource-based URLs, HTTP GET requests, JSON responses, and query parameters — by integrating the following APIs:

 - Alpha Vantage — Fetches the latest news articles related to a stock ticker along with AI-generated sentiment analysis (Bullish / Bearish / Neutral), showing how market perception around a company can be measured programmatically.
 - Marketstack — Retrieves end-of-day (EOD) historical OHLCV (Open, High, Low, Close, Volume) stock price data for any given ticker symbol, displayed in a sortable table with daily change calculations.
- NewsAPI — Pulls the most recent financial headlines from hundreds of global news sources, filtered by ticker or keyword, giving users a broad view of what the media is currently reporting on.
 - Polygon.io — Provides deep ticker reference data (company name, market cap, employee count, exchange, sector) combined with daily aggregate price bars, rendered as an interactive data visualization.

### 🧩 What the application does:

---

##  Real-World Scenario

---

##  API Information

- **API Name:** [API Name]  
- **Provider:** [Provider Name]  
- **Documentation:** [API Documentation Link]  
- **Base URL:** https://[api-base-url]

---

##  REST Principles Demonstrated

| Principle | Details |
|----------|---------|
| Root Resource URL | https://[api-base-url]/ |
| Resource Paths | /[endpoint1], /[endpoint2] |
| HTTP Method | GET |
| Response Format | JSON |
| Query Parameters | ?[param1]=value, ?[param2]=value |

---

##  Tech Stack

- **Frontend:** HTML + CSS + JavaScript (or React/Vue)
- **HTTP Client:** Fetch API 
- **Tools:** Postman (API testing)

---

##  Project Structure

assignment1/
├── index.html        # Main entry point
├── style.css         # Styling
├── app.js            # Main application logic
├── api/
│   └── client.js     # API handler (Fetch/Axios wrapper)
└── README.md         # Documentation

---

## ▶️ How to Run

###  Prerequisites
- Modern browser (Chrome / Firefox / Edge)
- Node.js (if using frameworks)
- API Key from [Provider Name]

---

###  Option A — Plain HTML / JS

git clone https://github.com/aya0/web-services-project1

Open index.html in browser  
OR run:

npx serve .

Then open:
http://localhost:3000

---

##  API Key Setup

1. Sign up at [Provider Website]
2. Generate API key
3. Add it to your project:

Option 1:
API_KEY=your_api_key_here

Option 2:
const API_KEY = "your_api_key_here";

---

##  Features

- Search data using API
- Display results dynamically
- Responsive UI
- Error handling for invalid requests

---
