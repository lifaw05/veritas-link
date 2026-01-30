---
name: Market-Aggregator
description: Aggregates and normalizes prediction market data from Kalshi and Polymarket.
---

# Market Aggregator

This skill provides the logic to fetch and normalize data from prediction markets.

## Dependencies
- `requests` (Python)
- `polygon-api-client` (optional, for direct Polygon access if needed)
- `web3` (for smart contract interaction if needed, though REST/HTTP is preferred for simplicity)

## Instructions
1.  **Kalshi API**:
    -   Endpoint: `https://trading-api.kalshi.com/v1/events/` (Check docs for latest)
    -   Auth: Public endpoints usually suffice for reading ticker data, otherwise requires an API key. For this demo, assume public reading or mock if key needed.
    -   Data: Fetch "Yes" price.

2.  **Polymarket API (Gamma/CLOB)**:
    -   Endpoint: `https://clob.polymarket.com/`
    -   Data: Fetch "Yes" price (token price).

3.  **Normalization**:
    -   Input: Raw price (e.g., 0.65 or 65 cents).
    -   Output: Percentage integer (0-100).

## Implementation (Python Proxy)
The goal is to have a python script that takes a `keyword` and finds relevant markets.

```python
# scripts/market_proxy.py
import requests
import json

def fetch_kalshi(keyword):
    # Mock implementation for demo if API requires strict auth
    # Real impl would search events
    print(f"Searching Kalshi for {keyword}")
    return [{"market": "Fed Rate", "probability": 75, "source": "Kalshi"}]

def fetch_polymarket(keyword):
    # Mock implementation
    print(f"Searching Polymarket for {keyword}")
    return [{"market": "Fed Rate", "probability": 72, "source": "Polymarket"}]

def aggregate(keyword):
    k_data = fetch_kalshi(keyword)
    p_data = fetch_polymarket(keyword)
    return k_data + p_data

if __name__ == "__main__":
    import sys
    keyword = sys.argv[1] if len(sys.argv) > 1 else "general"
    print(json.dumps(aggregate(keyword)))
```
