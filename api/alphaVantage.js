const ALPHA_VANTAGE_KEY = 'V1OQKZU3F4R7ALQQ';
const BASE_URL = 'https://www.alphavantage.co/query';

 // method to convert the timestamp from alpha vantage to a date object
function parseAVDate(timestamp) {
  if (!timestamp) return null;

  const newFormat = timestamp.replace(
    /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
    '$1-$2-$3T$4:$5:$6'
  );

  return new Date(newFormat);
}

//  it use for fetch financial news and sentimnt data for a stock ticker
async function fetchNewsSentiment(ticker = 'AAPL', topics ,  sort = 'LATEST', limit = 10, apiKey = ALPHA_VANTAGE_KEY) {

  const params = new URLSearchParams({
    function : 'NEWS_SENTIMENT',
    tickers  : ticker,
    topics   : topics,
    sort : sort,
    limit : limit,
    apikey   : apiKey,
  });

  const url = `${BASE_URL}?${params.toString()}`;

  // secure the api key in longs 
  console.log('[AlphaVantage] GET', url.replace(apiKey, '***'));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}


async function getNewsArticles(ticker = 'AAPL', topics ,  sort = 'LATEST', limit = 10, apiKey = ALPHA_VANTAGE_KEY) {
  const raw = await fetchNewsSentiment(ticker, topics, sort, limit, apiKey);

  if (!raw.feed || raw.feed.length === 0) return [];

  return raw.feed.map(article => {
    // Find per-ticker sentiment (Emotional or financial opinion about a stock in a news article.) if available
    // good data will be Positive / Bullish , bad data will be Negative / Bearish, Neutral is Neutral 
    let tickerSentiment = null;
    if (article.ticker_sentiment) { 
      const sentiment = article.ticker_sentiment.find(
        t => t.ticker.toUpperCase() === ticker.toUpperCase()
      );
      if (sentiment) {
        tickerSentiment = {
          label : sentiment.ticker_sentiment_label,
          score : parseFloat(sentiment.ticker_sentiment_score),
          relevance: parseFloat(sentiment.relevance_score),
        };
      }
    }

    // Convert published time to Date object
    const publishedAt = parseAVDate(article.time_published);

    return {
      title          : article.title,
      url            : article.url,
      summary        : article.summary,
      bannerImage    : article.banner_image,
      source         : article.source,
      sourceDomain   : article.source_domain,
      publishedAt,
      publishedAgo   : relativeTime(publishedAt),
      overallSentiment: {
        label: article.overall_sentiment_label,
        score: parseFloat(article.overall_sentiment_score),
      },
      tickerSentiment, 
      topics: (article.topics || []).map(t => t.topic),
    };
  });
}


// function to render the news articles and sentiment data in a container element on a webpage
async function renderNewsSentiment( ticker = 'AAPL',  containerId = 'av-container', options = { topics: '', sort: 'LATEST', limit: 10, apiKey: ALPHA_VANTAGE_KEY }
) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[AlphaVantage] No element found with id "${containerId}"`);
    return;
  }

  container.innerHTML = `<p style="color:#aaa;font-family:monospace">Loading news for ${ticker}…</p>`;

  try {
    const articles = await getNewsArticles(ticker, options.topics, options.sort, options.limit, options.apiKey);

    if (articles.length === 0) {
      container.innerHTML = `<p>No news found for <strong>${ticker}</strong>.</p>`;
      return;
    }

    container.innerHTML = articles.map(a => {
      const sent  = a.tickerSentiment || a.overallSentiment;
      const score = sent?.score?.toFixed(3) ?? 'none score data';
      const label = sent?.label ?? 'Unknown';

      return `
        <div style="
          display:flex; gap:14px; padding:14px 0;
          border-bottom:1px solid #1e2a35;
        ">
          ${a.bannerImage
            ? `<img src="${a.bannerImage}" alt="" loading="lazy"
                    onerror="this.style.display='none'"
                    style="width:80px;height:58px;object-fit:cover;border-radius:5px;flex-shrink:0"/>`
            : ''}
          <div style="flex:1;min-width:0">
            <a href="${a.url}" target="_blank" rel="noopener" style="
              font-size:.88rem;font-weight:500;color:#d4e8f0;text-decoration:none;
              display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden
            ">${a.title}</a>
            <div style="margin-top:5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
              <span style="font-family:monospace;font-size:.65rem;color:#7a99aa">${a.source}</span>
              <span style="font-family:monospace;font-size:.65rem;color:#7a99aa">${a.publishedAgo}</span>
              <span style="
                font-family:monospace;font-size:.63rem;padding:2px 8px;border-radius:3px;
                background:rgba(0,229,160,.12);color:#00e5a0
              ">${label} (${score})</span>
            </div>
          </div>
        </div>`;
    }).join('');

  } catch (error) {
    console.error('[AlphaVantage] Error:', error);
    container.innerHTML = `<p style="color:#ff5f5f;font-family:monospace">Error: ${error.message}</p>`;
  }
}


// to use it on html page with a script tag, and also export for node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchNewsSentiment, getNewsArticles, renderNewsSentiment };
}
