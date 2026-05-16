const myNewsApiKey = 'b57cb5bdb05c4916930783005f49138e';
const newsApiBaseUrl = 'https://newsapi.org/v2';

// Calculates how long ago the article was published
function getTimeAgo(publishedDate) {
  if (!publishedDate) return '';
  const secondsPassed = (Date.now() - new Date(publishedDate).getTime()) / 1000;
  if (secondsPassed < 60) return `${Math.round(secondsPassed)}s ago`;
  if (secondsPassed < 3600) return `${Math.round(secondsPassed / 60)}m ago`;
  if (secondsPassed < 86400) return `${Math.round(secondsPassed / 3600)}h ago`;
  return `${Math.round(secondsPassed / 86400)}d ago`;
}

// Cleans the article content text
function cleanArticleText(articleContent) {
  if (!articleContent) return '';
  return articleContent.replace(/\s*\[.*?\]\s*$/, '').trim();
}

// Sends a request to NewsAPI search endpoint
async function searchNews(searchText = 'finance', requestOptions = {}) {
  const {
    searchIn = 'title,description',
    sources = null,
    domains = null,
    from = null,
    to = null,
    language = 'en',
    sortBy = 'publishedAt',
    pageSize = 10,
    page = 1,
    apiKey = myNewsApiKey,
  } = requestOptions;

  const urlParams = new URLSearchParams({
    q: searchText,
    searchIn,
    language,
    sortBy,
    pageSize,
    page,
    apiKey,
  });

  if (sources) urlParams.append('sources', sources);
  if (domains) urlParams.append('domains', domains);
  if (from) urlParams.append('from', from);
  if (to) urlParams.append('to', to);

  const apiUrl = `${newsApiBaseUrl}/everything?${urlParams.toString()}`;
  console.log('[NewsAPI] GET', apiUrl.replace(apiKey, '***'));

  const apiResponse = await fetch(apiUrl);
  const apiData = await apiResponse.json();

  if (apiData.status === 'error') {
    throw new Error(`${apiData.code}: ${apiData.message}`);
  }

  return apiData;
}

// Gets top headlines from NewsAPI
async function getTopHeadlines(requestOptions = {}) {
  const {
    q = null,
    sources = null,
    category = 'business',
    country = 'us',
    pageSize = 10,
    page = 1,
    apiKey = myNewsApiKey,
  } = requestOptions;

  const urlParams = new URLSearchParams({ pageSize, page, apiKey });

  if (sources) {
    urlParams.append('sources', sources);
  } else {
    if (q) urlParams.append('q', q);
    if (category) urlParams.append('category', category);
    if (country) urlParams.append('country', country);
  }

  const apiUrl = `${newsApiBaseUrl}/top-headlines?${urlParams.toString()}`;
  console.log('[NewsAPI] GET', apiUrl.replace(apiKey, '***'));

  const apiResponse = await fetch(apiUrl);
  const apiData = await apiResponse.json();

  if (apiData.status === 'error') {
    throw new Error(`${apiData.code}: ${apiData.message}`);
  }

  return apiData;
}

// Gets available news sources
async function getNewsSources(requestOptions = {}) {
  const {
    category = 'business',
    language = 'en',
    country = 'us',
    apiKey = myNewsApiKey,
  } = requestOptions;

  const urlParams = new URLSearchParams({ category, language, country, apiKey });
  const apiUrl = `${newsApiBaseUrl}/top-headlines/sources?${urlParams.toString()}`;
  console.log('[NewsAPI] GET', apiUrl.replace(apiKey, '***'));

  const apiResponse = await fetch(apiUrl);
  const apiData = await apiResponse.json();

  if (apiData.status === 'error') {
    throw new Error(`${apiData.code}: ${apiData.message}`);
  }

  return apiData.sources ?? [];
}

// Prepares article data before displaying it
async function prepareArticles(searchText = 'finance', requestOptions = {}) {
  const rawNewsData = await searchNews(searchText, requestOptions);

  return (rawNewsData.articles ?? [])
    .filter((article) => article.title && article.title !== '[Removed]')
    .map((article) => ({
      title: article.title,
      description: article.description,
      content: cleanArticleText(article.content),
      url: article.url,
      imageUrl: article.urlToImage,
      sourceName: article.source?.name ?? 'Unknown',
      sourceId: article.source?.id,
      author: article.author,
      publishedAt: article.publishedAt,
      timeLabel: getTimeAgo(article.publishedAt),
    }));
}

// Shows the articles inside the page
async function showArticles(
  searchText = 'finance stock market',
  containerId = 'na-container',
  requestOptions = {}
) {
  const newsBox = document.getElementById(containerId);
  if (!newsBox) {
    console.error(`[NewsAPI] No element with id "${containerId}"`);
    return;
  }

  newsBox.innerHTML = '<p style="color:#aaa;font-family:monospace">Loading headlines...</p>';

  try {
    const articleList = await prepareArticles(searchText, requestOptions);

    if (articleList.length === 0) {
      newsBox.innerHTML = `<p>No articles found for "<strong>${searchText}</strong>".</p>`;
      return;
    }

    newsBox.innerHTML = articleList.map((article) => `
      <div style="
        display:grid;grid-template-columns:72px 1fr;gap:12px;
        padding:13px 0;border-bottom:1px solid #1e2a35
      ">
        ${article.imageUrl
          ? `<img src="${article.imageUrl}" alt="" loading="lazy"
                  onerror="this.style.display='none'"
                  style="width:72px;height:54px;object-fit:cover;border-radius:5px"/>`
          : '<div style="width:72px;height:54px;background:#1e2a35;border-radius:5px"></div>'
        }
        <div>
          <a href="${article.url}" target="_blank" rel="noopener" style="
            font-size:.85rem;font-weight:500;color:#d4e8f0;text-decoration:none;
            display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden
          ">${article.title}</a>
          <div style="margin-top:5px;display:flex;gap:10px">
            <span style="font-family:monospace;font-size:.63rem;color:#ffc83c">${article.sourceName}</span>
            <span style="font-family:monospace;font-size:.63rem;color:#7a99aa">${article.timeLabel}</span>
          </div>
        </div>
      </div>`
    ).join('');
  } catch (fetchError) {
    console.error('[NewsAPI] Error:', fetchError);
    newsBox.innerHTML = `<p style="color:#ff5f5f;font-family:monospace">Error: ${fetchError.message}</p>`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { searchNews, getTopHeadlines, getNewsSources, prepareArticles, showArticles };
}
