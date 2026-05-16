const POLYGON_KEY  = 'NnKyXLpimxTW8bkQCuOKT1kc3ELT4x3n';
const POLYGON_BASE = 'https://api.massive.com';

// format big numbers nicely like 1500000 -> 1.50M
function fmtNum(n) {
  if (n == null) return '—';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + 'M';
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + 'K';
  return Number(n).toLocaleString();
}

// unix ms -> "YYYY-MM-DD"
function toDateStr(unixMs) {
  return new Date(unixMs).toISOString().slice(0, 10);
}

// get a date string n days in the past
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// get company/ticker info from polygon
async function fetchTickerDetails(ticker = 'AAPL', options = {}) {
  const { apiKey = POLYGON_KEY } = options;
  const url = `${POLYGON_BASE}/v3/reference/tickers/${ticker.toUpperCase()}?${new URLSearchParams({ apiKey })}`;
  console.log('[Polygon] GET', url.replace(apiKey, '***'));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const data = await res.json();
  if (data.status === 'ERROR' || data.status === 'NOT_FOUND')
    throw new Error(data.error || `Ticker "${ticker}" not found`);

  return data.results;
}

// get OHLCV bars for a ticker, defaults to daily for last 14 days
async function fetchAggregates(ticker = 'AAPL', options = {}) {
  const {
    multiplier = 1,
    timespan   = 'day',
    from       = daysAgo(15),
    to         = daysAgo(1),
    adjusted   = true,
    sort       = 'desc',
    limit      = 20,
    apiKey     = POLYGON_KEY,
  } = options;

  const params = new URLSearchParams({ adjusted, sort, limit, apiKey });
  const url = `${POLYGON_BASE}/v2/aggs/ticker/${ticker.toUpperCase()}/range/${multiplier}/${timespan}/${from}/${to}?${params}`;
  console.log('[Polygon] GET', url.replace(apiKey, '***'));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const data = await res.json();
  if (data.status === 'ERROR') throw new Error(data.error || 'Polygon error');
  if (!data.results?.length) return [];

  return data.results;
}

// get the latest snapshot (real-time quote) for a ticker
async function fetchSnapshot(ticker = 'AAPL', options = {}) {
  const { apiKey = POLYGON_KEY } = options;
  const url = `${POLYGON_BASE}/v2/snapshot/locale/us/markets/stocks/tickers/${ticker.toUpperCase()}?${new URLSearchParams({ apiKey })}`;
  console.log('[Polygon] GET', url.replace(apiKey, '***'));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const data = await res.json();
  if (data.status === 'ERROR') throw new Error(data.error || 'Snapshot error');

  return data.ticker;
}

// combines ticker details + bar data into one clean object
async function getStockProfile(ticker = 'AAPL', options = {}) {
  const [details, bars] = await Promise.all([
    fetchTickerDetails(ticker, options),
    fetchAggregates(ticker, options),
  ]);

  const cleanBars = bars.map(b => ({
    date      : toDateStr(b.t),
    open      : b.o,
    high      : b.h,
    low       : b.l,
    close     : b.c,
    volume    : b.v,
    vwap      : b.vw,
    trxCount  : b.n,
    changePct : b.o !== 0 ? parseFloat(((b.c - b.o) / b.o * 100).toFixed(2)) : 0,
    direction : b.c >= b.o ? 'up' : 'down',
    volumeFmt : fmtNum(b.v),
  }));

  return {
    ticker      : details.ticker,
    name        : details.name,
    description : details.description,
    marketCap   : details.market_cap,
    marketCapFmt: details.market_cap ? '$' + fmtNum(details.market_cap) : '—',
    employees   : details.total_employees,
    exchange    : details.primary_exchange,
    currency    : details.currency_name,
    homepage    : details.homepage_url,
    listDate    : details.list_date,
    sicDesc     : details.sic_description,
    iconUrl     : details.branding?.icon_url
                    ? details.branding.icon_url + `?apiKey=${options.apiKey || POLYGON_KEY}`
                    : null,
    bars        : cleanBars,
  };
}

// renders the company card + bar chart into a DOM element
async function renderPolygonProfile(ticker = 'AAPL', containerId = 'pg-container', options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[Polygon] No element with id "${containerId}"`);
    return;
  }

  container.innerHTML = '<p style="color:#aaa;font-family:monospace">Loading Polygon data…</p>';

  try {
    const profile = await getStockProfile(ticker, options);
    const maxVol  = Math.max(...profile.bars.map(b => b.volume));

    // top stats grid
    const statsHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px">
        ${[
          ['Company',    profile.name || ticker],
          ['Market Cap', profile.marketCapFmt],
          ['Exchange',   profile.exchange || '—'],
          ['Currency',   profile.currency || '—'],
          ['Employees',  profile.employees ? fmtNum(profile.employees) : '—'],
          ['Sector',     profile.sicDesc || '—'],
        ].map(([label, val]) => `
          <div style="background:#0e1318;border:1px solid #1e2a35;border-radius:6px;padding:11px 13px">
            <div style="font-family:monospace;font-size:.6rem;color:#4a6070;letter-spacing:.1em;margin-bottom:3px">${label}</div>
            <div style="font-family:monospace;font-size:.88rem;color:#d4e8f0;font-weight:500;
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${val}">${val}</div>
          </div>`
        ).join('')}
      </div>`;

    // OHLCV bar rows
    const barsHTML = profile.bars.length === 0
      ? '<p style="color:#7a99aa;font-family:monospace;font-size:.78rem">No bar data available.</p>'
      : `
        <div style="font-family:monospace;font-size:.62rem;color:#4a6070;letter-spacing:.1em;margin-bottom:10px">
          DAILY OHLCV — LAST ${profile.bars.length} SESSIONS
        </div>` +
        profile.bars.map(b => {
          const color = b.direction === 'up' ? '#00e5a0' : '#ff5f5f';
          const barW  = maxVol > 0 ? Math.round((b.volume / maxVol) * 100) : 0;
          return `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(30,42,53,.5)">
              <div style="font-family:monospace;font-size:.67rem;color:#7a99aa;width:88px;flex-shrink:0">${b.date}</div>
              <div style="font-family:monospace;font-size:.72rem;color:#d4e8f0;flex:1">
                O:${b.open.toFixed(2)} H:${b.high.toFixed(2)} L:${b.low.toFixed(2)}
                C:<strong style="color:${color}">${b.close.toFixed(2)}</strong>
              </div>
              <div style="font-family:monospace;font-size:.67rem;width:62px;text-align:right;color:${color}">
                ${b.changePct >= 0 ? '+' : ''}${b.changePct}%
              </div>
              <div style="flex:1;max-width:90px;height:4px;background:#1e2a35;border-radius:2px;overflow:hidden">
                <div style="height:100%;width:${barW}%;background:${color};border-radius:2px"></div>
              </div>
            </div>`;
        }).join('');

    container.innerHTML = statsHTML + barsHTML;

  } catch (error) {
    console.error('[Polygon] Error:', error);
    container.innerHTML = `<p style="color:#ff5f5f;font-family:monospace">Error: ${error.message}</p>`;
  }
}

/*
(async () => {
  try {
    const profile = await getStockProfile('NVDA', { apiKey: POLYGON_KEY });
    console.log('Company:', profile.name, '|', profile.marketCapFmt);
    console.table(profile.bars.slice(0, 5).map(b => ({
      date  : b.date,
      close : b.close,
      chg   : `${b.changePct}%`,
      vol   : b.volumeFmt,
    })));
  } catch (e) {
    console.error(e.message);
  }
})();
*/

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchTickerDetails,
    fetchAggregates,
    fetchSnapshot,
    getStockProfile,
    renderPolygonProfile,
  };
}