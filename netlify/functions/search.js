exports.handler = async function(event) {
  const params = event.queryStringParameters || {};
  const title = params.title || '';
  const company = params.company || '';
  const industry = params.industry || '';

  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;

  if (!appId || !apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API keys not configured on server." })
    };
  }

  let whatParam = title || industry || 'jobs';
  let url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${apiKey}&results_per_page=25&content-type=application/json&what=${encodeURIComponent(whatParam)}`;
  if (company) url += `&company=${encodeURIComponent(company)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch: " + err.message })
    };
  }
};
