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

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const newNodes = doc.querySelectorAll('link[href], script[src]');
  
  if (!newNodes.length) return;

  // Get current head links/scripts for comparison
  const existingNodes = document.head.querySelectorAll('link[href], script[src]');
  const existingUrls = new Set(
    Array.from(existingNodes).map(node => node.href || node.src)
  );

  newNodes.forEach(node => {
    if (node.tagName === 'LINK') {
      const href = node.getAttribute('href');
      if (!href) return;
      
      // Resolve absolute URL to check for duplicates
      const absoluteUrl = new URL(href, window.location.href).href;
      if (existingUrls.has(absoluteUrl)) return;

      // Create a new link element in the actual document
      const newLink = document.createElement('link');
      newLink.rel = node.getAttribute('rel') || 'stylesheet';
      newLink.href = href;
      if (node.hasAttribute('media')) newLink.media = node.getAttribute('media');
      
      document.head.appendChild(newLink);
      existingUrls.add(absoluteUrl); // Prevent duplicates within the same payload
    } 
    else if (node.tagName === 'SCRIPT') {
      const src = node.getAttribute('src');
      if (!src) return;

      const absoluteUrl = new URL(src, window.location.href).href;
      if (existingUrls.has(absoluteUrl)) return;

      const newScript = document.createElement('script');
      newScript.src = src;
      if (node.hasAttribute('type')) newScript.type = node.getAttribute('type');
      if (node.hasAttribute('async')) newScript.async = true;
      if (node.hasAttribute('defer')) newScript.defer = true;
      
      document.head.appendChild(newScript);
      existingUrls.add(absoluteUrl);
    }
  });
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

      ctx.ok = res.ok;
      ctx.response = responseData;
      ctx.statusCode = res.status;
      ctx.statusMessage = res.statusText;

      ctx.vars.response = responseData;
      ctx.vars.status_code = res.status;
      ctx.vars.status_message = res.statusText;

      // Inject links/scripts from JSON payload into <head>
      if (res.ok && responseData && typeof responseData === 'object' && responseData.QE_links_header) {
        injectHeadLinks(responseData.QE_links_header);
      }

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