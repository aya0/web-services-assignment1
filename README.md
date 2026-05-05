# COM4381 — Project 1: Consuming RESTful Web Service APIs

**Course:** COM4381 Web Services Technologies  
**Semester:** 2nd Semester 2025/2026  
**University:** Birzeit University  
**Due Date:** May 15, 2026 (in-class demo)

---

##  Group Members

| Name | Student ID |
|------|------------|
| Member 1 Name | ID |
| Member 2 Name | ID |
| Member 3 Name | ID |

---

##  Project Description

This project explores and consumes the **[API Name]** RESTful Web Service API.

### 🧩 What the application does:
[Brief description of your app — example below]

Example:
A web application that allows users to search for real-time weather data by city name. It displays temperature, humidity, and forecast information using the OpenWeatherMap API.

---

##  Real-World Scenario

[Describe your use case]

Example:
A traveler planning a trip can enter any city and instantly view current weather conditions and a 5-day forecast, helping them decide what to pack.

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
- **HTTP Client:** Fetch API / Axios
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

git clone https://github.com/[your-username]/[repo-name].git
cd [repo-name]/assignment1

Open index.html in browser  
OR run:

npx serve .

Then open:
http://localhost:3000

---

###  Option B — React / Vue

git clone https://github.com/[your-username]/[repo-name].git
cd [repo-name]/assignment1

npm install

Create .env file:
REACT_APP_API_KEY=your_api_key_here

npm start

Open:
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
