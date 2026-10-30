// src/commands/ajax/ajax.js

function flattenParams(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenParams(val, fullKey));
    } else {
      acc[fullKey] = val;
    }
    return acc;
  }, {});
}

export default {
  name: 'ajax',
  kind: 'source',
  capabilities: ['network.fetch'],
  schema: ['string', 'string?', 'object?'],
  async resolve(ctx, [url, method = 'GET', body = null]) {
    const upperMethod = method.toUpperCase();
    let finalUrl = url;
    let fetchBody = null;
    const headers = {};

    if (body) {
      if (upperMethod === 'GET' || upperMethod === 'HEAD') {
        const flat = typeof body === 'object' ? flattenParams(body) : body;
        const params = new URLSearchParams(flat).toString();
        if (params) finalUrl += (url.includes('?') ? '&' : '?') + params;
      } else {
        fetchBody = typeof body === 'object' ? JSON.stringify(body) : String(body);
        headers['Content-Type'] = 'application/json';
      }
    }

    try {
      const res = await fetch(finalUrl, {
        method: upperMethod === 'JSON' ? 'POST' : upperMethod,
        headers: upperMethod === 'JSON' ? { 'Content-Type': 'application/json' } : headers,
        body: fetchBody
      });

      const contentType = res.headers.get('content-type') || '';
      let responseData = null;

      if (contentType.includes('application/json')) {
        try { responseData = await res.json(); } catch { responseData = null; }
      } else {
        responseData = await res.text();
      }

      // Update context for ajaxSuccess / ajaxError
      ctx.ok = res.ok;
      ctx.response = responseData;
      ctx.statusCode = res.status;
      ctx.statusMessage = res.statusText;

      // Expose response to variables for use in templates (e.g. { response.name })
      ctx.vars.response = responseData;
      ctx.vars.status_code = res.status;
      ctx.vars.status_message = res.statusText;

      return responseData;
    } catch (err) {
      ctx.ok = false;
      ctx.response = null;
      ctx.statusCode = 0;
      ctx.statusMessage = 'Connection failed. Check your internet.';

      ctx.vars.response = null;
      ctx.vars.status_code = 0;
      ctx.vars.status_message = 'Connection failed. Check your internet.';

      throw err;
    }
  },
};