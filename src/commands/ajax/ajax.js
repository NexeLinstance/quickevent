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

function injectHeadLinks(htmlString) {
  if (typeof htmlString !== 'string' || !htmlString.trim()) return;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    const existingUrls = new Set();
    document.head.querySelectorAll('link[href], script[src]').forEach(node => {
      const url = node.getAttribute('href') || node.getAttribute('src');
      if (url) existingUrls.add(url);
    });

    doc.querySelectorAll('link[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || existingUrls.has(href)) return;

      const newLink = document.createElement('link');
      newLink.rel = link.getAttribute('rel') || 'stylesheet';
      newLink.href = href;
      if (link.hasAttribute('integrity')) newLink.integrity = link.getAttribute('integrity');
      if (link.hasAttribute('crossorigin')) newLink.crossOrigin = link.getAttribute('crossorigin');
      
      document.head.appendChild(newLink);
      existingUrls.add(href);
    });

    doc.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src');
      if (!src || existingUrls.has(src)) return;

      const newScript = document.createElement('script');
      newScript.src = src;
      if (script.hasAttribute('type')) newScript.type = script.getAttribute('type');
      if (script.hasAttribute('async')) newScript.async = true;
      if (script.hasAttribute('defer')) newScript.defer = true;
      
      document.head.appendChild(newScript);
      existingUrls.add(src);
    });

  } catch (err) {
    console.error('[QE] Failed to inject head links:', err);
  }
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
      } 
      else if (contentType.includes('text/') || contentType.includes('xml') || contentType.includes('javascript')) {
        responseData = await res.text();
      }
      else if (contentType.includes('form-data')) {
        try { responseData = await res.formData(); } catch { responseData = null; }
      }
      else {
        responseData = await res.blob();
      }

      ctx.ok = res.ok;
      ctx.response = responseData;
      ctx.statusCode = res.status;
      ctx.statusMessage = res.statusText;
      ctx.contentType = contentType;

      ctx.vars.response = responseData;
      ctx.vars.status_code = res.status;
      ctx.vars.status_message = res.statusText;
      ctx.vars.content_type = contentType;

      if (res.ok && responseData && typeof responseData === 'object' && !(responseData instanceof Blob) && responseData.QE_links_header) {
        injectHeadLinks(responseData.QE_links_header);
      }

      return responseData;
    } catch (err) {
      ctx.ok = false;
      ctx.response = null;
      ctx.statusCode = 0;
      ctx.statusMessage = 'Connection failed. Check your internet.';
      ctx.contentType = '';

      ctx.vars.response = null;
      ctx.vars.status_code = 0;
      ctx.vars.status_message = 'Connection failed. Check your internet.';
      ctx.vars.content_type = '';

      throw err;
    }
  },
};