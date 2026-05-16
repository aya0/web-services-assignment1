const MARKETSTACK_KEY  = '0bebb5f458f8bff20d9d6f348d5fcf5e'; 
const MARKETSTACK_BASE = 'http://api.marketstack.com/v1'; 

// funciton to convert the numbers to K, M, B format which it make it easier to read 
function formatNumber(num) {
  if (num == null) return '—';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return Number(num).toLocaleString();
}


async function fetchEOD(symbols = 'AAPL', limit= 10, offset= 0, sort = 'DESC', apiKey = MARKETSTACK_KEY,) {

  const symbolStr = Array.isArray(symbols) ? symbols.join(',') : symbols;

  const params = new URLSearchParams({
    access_key : apiKey,
    symbols    : symbolStr,
    limit,
    offset,
    sort,
  });


  const url = `${MARKETSTACK_BASE}/eod?${params.toString()}`;
  console.log('[Marketstack] GET', url.replace(apiKey, '***'));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  // Marketstack wraps errors in data.error
  if (data.error) {
    throw new Error(
      `${data.error.code}: ${data.error.message}` ||
      JSON.stringify(data.error)
    );
  }

  return data; 
}

async function fetchTickerInfo(symbol = 'AAPL', options = {}) {
  const { apiKey = MARKETSTACK_KEY } = options;

  const params = new URLSearchParams({ access_key: apiKey });
  const url    = `${MARKETSTACK_BASE}/tickers/${symbol.toUpperCase()}?${params}`;
  console.log('[Marketstack] GET', url.replace(apiKey, '***'));

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  return data; 
}


async function getStockPrices(symbols = 'AAPL', options = {}) {
  const raw = await fetchEOD(symbols, options);

  if (!raw.data || raw.data.length === 0) return [];

  return raw.data.map(bar => {
    const change    = bar.close - bar.open;
    const changePct = bar.open !== 0
      ? ((change / bar.open) * 100).toFixed(2)
      : '0.00';

    return {
      symbol     : bar.symbol,
      date       : bar.date?.slice(0, 10) ?? '—',
      open       : bar.open,
      high       : bar.high,
      low        : bar.low,
      close      : bar.close,
      volume     : bar.volume,
      adj_close  : bar.adj_close,
      split_factor: bar.split_factor,
      exchange   : bar.exchange,
      change,
      changePct  : parseFloat(changePct),
      direction  : change >= 0 ? 'up' : 'down',
      volumeFmt  : formatNumber(bar.volume),
    };
  });
}


async function renderStockTable(
  symbols     = 'AAPL',
  containerId = 'ms-container',
  options     = {}
) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[Marketstack] No element with id "${containerId}"`);
    return;
  }

  container.innerHTML = '<p style="color:#aaa;font-family:monospace">Loading prices…</p>';

  try {
    const prices = await getStockPrices(symbols, options);

    if (prices.length === 0) {
      container.innerHTML = '<p>No price data found.</p>';
      return;
    }

    const rows = prices.map(p => `
      <tr>
        <td style="font-family:monospace;color:#0af;font-weight:500">${p.symbol}</td>
        <td style="font-family:monospace">${p.date}</td>
        <td style="font-family:monospace">$${p.close.toFixed(2)}</td>
        <td style="font-family:monospace">$${p.open.toFixed(2)}</td>
        <td style="font-family:monospace">$${p.high.toFixed(2)}</td>
        <td style="font-family:monospace">$${p.low.toFixed(2)}</td>
        <td style="font-family:monospace;color:${p.direction === 'up' ? '#00e5a0' : '#ff5f5f'}">
          ${p.change >= 0 ? '+' : ''}${p.change.toFixed(2)} (${p.changePct}%)
        </td>
        <td style="font-family:monospace;color:#7a99aa">${p.volumeFmt}</td>
      </tr>`
    ).join('');

    container.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:.8rem">
        <thead>
          <tr style="border-bottom:1px solid #1e2a35;color:#7a99aa;font-family:monospace;font-size:.65rem;letter-spacing:.1em">
            <th style="text-align:left;padding:8px 10px">SYMBOL</th>
            <th style="text-align:left;padding:8px 10px">DATE</th>
            <th style="text-align:left;padding:8px 10px">CLOSE</th>
            <th style="text-align:left;padding:8px 10px">OPEN</th>
            <th style="text-align:left;padding:8px 10px">HIGH</th>
            <th style="text-align:left;padding:8px 10px">LOW</th>
            <th style="text-align:left;padding:8px 10px">CHANGE</th>
            <th style="text-align:left;padding:8px 10px">VOLUME</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;

  } catch (error) {
    console.error('[Marketstack] Error:', error);
    container.innerHTML = `<p style="color:#ff5f5f;font-family:monospace">Error: ${error.message}</p>`;
  }
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchEOD, fetchTickerInfo, getStockPrices, renderStockTable };
}
