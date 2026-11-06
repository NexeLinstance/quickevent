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

    // Also track existing meta tags to avoid duplicates
    const existingMetas = new Set();
    document.head.querySelectorAll('meta[name], meta[property], meta[http-equiv]').forEach(node => {
      const name = node.getAttribute('name') || node.getAttribute('property') || node.getAttribute('http-equiv');
      const content = node.getAttribute('content');
      if (name && content) existingMetas.add(`${name}=${content}`);
    });

    const isSafe = (urlStr) => {
      try {
        const u = new URL(urlStr, window.location.href);
        return u.origin === window.location.origin;
      } catch { return false; }
    };

    // 1. Process meta tags
    doc.querySelectorAll('meta').forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
      const content = meta.getAttribute('content');
      if (!name || !content) return;

      const key = `${name}=${content}`;
      if (existingMetas.has(key)) return;

      const newMeta = document.createElement('meta');
      if (meta.hasAttribute('name')) newMeta.setAttribute('name', name);
      if (meta.hasAttribute('property')) newMeta.setAttribute('property', name);
      if (meta.hasAttribute('http-equiv')) newMeta.setAttribute('http-equiv', name);
      newMeta.setAttribute('content', content);
      
      document.head.appendChild(newMeta);
      existingMetas.add(key);
    });

    // 2. Process links
    const ALLOWED_REL = new Set(['stylesheet', 'preload', 'icon']);
    doc.querySelectorAll('link[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || existingUrls.has(href) || !isSafe(href)) return;

      const rel = (link.getAttribute('rel') || 'stylesheet').toLowerCase();
      if (!ALLOWED_REL.has(rel)) return;

      const newLink = document.createElement('link');
      newLink.rel = rel;
      newLink.href = href;
      document.head.appendChild(newLink);
      existingUrls.add(href);
    });

    // 3. Process scripts
    doc.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src');
      if (!src || existingUrls.has(src) || !isSafe(src)) return;

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
  schema: ['string', 'string?', 'any?', 'object?'],
  async resolve(ctx, [url, method = 'GET', body = null, customHeaders = {}]) {
    const upperMethod = method.toUpperCase();
    let finalUrl = url;
    let fetchBody = null;
    const headers = { ...customHeaders };

    if (body) {
      if (upperMethod === 'GET' || upperMethod === 'HEAD') {
        try {
          const u = new URL(url, window.location.href);
          const flat = typeof body === 'object' ? flattenParams(body) : body;
          Object.entries(flat).forEach(([k, v]) => {
            if (v !== null && v !== undefined) u.searchParams.set(k, v);
          });
          finalUrl = u.toString();
        } catch {
          finalUrl = url;
        }
      } else if (body instanceof FormData) {
        fetchBody = body;
        // Do NOT set Content-Type. Browser handles boundary automatically.
      } else {
        if (typeof body === 'string') {
          fetchBody = body;
          // Try to detect if it's JSON, otherwise use text/plain
          try {
            JSON.parse(body);
            headers['Content-Type'] = headers['Content-Type'] || 'application/json';
          } catch {
            headers['Content-Type'] = headers['Content-Type'] || 'text/plain';
          }
        } else {
          fetchBody = JSON.stringify(body);
          headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        }
      }
    }

    try {
      const res = await fetch(finalUrl, {
        method: upperMethod === 'JSON' ? 'POST' : upperMethod,
        headers,
        body: fetchBody,
        credentials: 'same-origin',
        mode: 'cors',
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