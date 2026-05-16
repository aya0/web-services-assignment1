# COM4381 — Project 1: Consuming RESTful Web Service APIs

**Course:** COM4381 Web Services Technologies  
**Semester:** 2nd Semester 2025/2026  
**University:** Birzeit University  
**Due Date:** May 15, 2026 (in-class demo)

---

##  Group Members

| Name | Student ID |
|------|------------|
| Julia  Duaibes | 1222428|
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

The projectis a stock dashboard that allows users to search for a stock symbol and instantly receive a complete market overview.

It aggregates data from multiple financial APIs to provide:

-  historical stock prices  
- Latest financial news related to the stock  
- Market sentiment analysis  
- Company and market overview data  

The goal is to simplify investment research by combining all key financial insights into a single, easy-to-use interface.

---
##  Real-World Scenario

## Scenario 1: Apple (AAPL) — You OWN the Stock

You already hold Apple shares and want a morning briefing before the market opens.

### 1. Price Check ( by Marketstack)
AAPL closed at **$189.45**, up **+1.8%**, with higher-than-usual volume → indicates strong buying interest.

### 2. Latest News ( by NewsAPI)
Recent headlines include:
- Apple advancing AI features in iOS  
- Strong iPhone sales in key markets  
- Positive analyst upgrades  

### 3. Sentiment Analysis (by Alpha Vantage)
- 6 out of 8 articles are bullish  
- Sentiment score: **+0.42 (Somewhat Bullish)**  

### 4. Market Context (by Polygon.io)
Apple remains a **$2.9T company** with a steady upward trend over the past two weeks.

---

## Scenario 2: NVIDIA (NVDA) — You DO NOT OWN the Stock

You are exploring NVIDIA as a potential investment but do not currently hold any shares.

### 1. Price Check ( by Marketstack)
NVDA closed at **$875.30**, up **+3.2%**, with unusually high volume → strong buying momentum.

### 2. Latest News ( by NewsAPI)
Recent headlines include:
- Rising demand for AI chips  
- New cloud partnerships  
- Continued expansion in data centers  

### 3. Sentiment Analysis ( by Alpha Vantage)
- 9 out of 12 articles are bullish  
- Sentiment score: **+0.68 (Bullish)**  

### 4. Market Context ( by Polygon.io)
NVIDIA shows a **strong long-term upward trend**, driven by AI sector growth.

---

##  API Information

### 1. Marketstack API
- **API Name:** Marketstack  
- **Provider:** Apilayer  
- **Documentation:** https://marketstack.com/documentation  
- **Base URL:** http://api.marketstack.com/v1  

---

### 2. NewsAPI
- **API Name:** NewsAPI  
- **Provider:** NewsAPI.org  
- **Documentation:** https://newsapi.org/docs  
- **Base URL:** https://newsapi.org/v2  

---

### 3. Alpha Vantage API
- **API Name:** Alpha Vantage  
- **Provider:** Alpha Vantage Inc  
- **Documentation:** https://www.alphavantage.co/documentation/  
- **Base URL:** https://www.alphavantage.co/query  

---

### 4. Polygon.io API
- **API Name:** Polygon.io  
- **Provider:** Polygon.io  
- **Documentation:** https://polygon.io/docs/  
- **Base URL:** https://api.polygon.io  

---

##  REST Principles Demonstrated

### 1. Marketstack API
| Principle | Details |
|----------|--------|
| Root Resource URL | https://api.marketstack.com/v1/ |
| Resource Paths | /eod, /tickers, /intraday |
| HTTP Method | GET |
| Response Format | JSON |
| Query Parameters | ?access_key=YOUR_KEY&symbols=AAPL |

---

### 2. NewsAPI
| Principle | Details |
|----------|--------|
| Root Resource URL | https://newsapi.org/v2/ |
| Resource Paths | /everything, /top-headlines |
| HTTP Method | GET |
| Response Format | JSON |
| Query Parameters | ?q=apple&apiKey=YOUR_KEY |

---

### 3. Alpha Vantage API
| Principle | Details |
|----------|--------|
| Root Resource URL | https://www.alphavantage.co/query |
| Resource Paths | function (e.g., TIME_SERIES_DAILY, NEWS_SENTIMENT) |
| HTTP Method | GET |
| Response Format | JSON |
| Query Parameters | ?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=YOUR_KEY |

---

### 4. Polygon.io API
| Principle | Details |
|----------|--------|
| Root Resource URL | https://api.polygon.io/ |
| Resource Paths | /v2/aggs/ticker, /v3/reference/tickers |
| HTTP Method | GET |
| Response Format | JSON |
| Query Parameters | ?ticker=NVDA&apiKey=YOUR_KEY |

---

##  Tech Stack

- **Frontend:** HTML + CSS + JavaScript
- **HTTP Client:** Fetch API 
- **Tools:** Postman (API testing)

---

##  Project Structure

assignment1/  
│  
├── index.html            
├── style.css     
│  
├── api/  
│   ├── alphaVantage.js     
│   ├── marketstack.js     
│   ├── newsapi.js          
│   └── polygon.js       
│  
└── README.md              

---

## ▶️ How to Run

###  Prerequisites
- Modern browser (Chrome / Firefox / Edge)
- API Key from [ Marketstack API , NewsAPI , Alpha Vantage API , Polygon.io API ]

---

###  Option A — Plain HTML / JS

git clone https://github.com/aya0/web-services-assignment1

Open index.html in browser  
---

##  API Key Setup

1. Sign up at [ Marketstack API , NewsAPI , Alpha Vantage API , Polygon.io API ]
2. Generate API key
3. Add it to your project:
