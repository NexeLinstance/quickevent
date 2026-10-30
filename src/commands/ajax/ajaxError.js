// src/commands/ajax/ajaxError.js

export default {
  name: 'ajaxError',
  kind: 'flow',
  schema: ['array', 'object?'],
  async run(ctx, [body, customMessages = {}], { runBody }) {
    if (!ctx.ok) {
      // If the backend didn't send a statusMessage (e.g. network error),
      // use defaults or custom messages.
      if (!ctx.statusMessage || ctx.statusMessage === '') {
        const defaults = {
          0: 'Connection failed. Check your internet.',
          400: 'Invalid request. Please check your inputs.',
          401: 'Session expired. Please log in again.',
          403: 'Access denied.',
          404: 'Resource not found.',
          405: 'Method not allowed.',
          408: 'Request timed out. Try again.',
          409: 'Conflict occurred. Please refresh.',
          410: 'Resource no longer available.',
          413: 'File size exceeds the limit.',
          415: 'Unsupported file format.',
          422: 'Unprocessable data. Verify your inputs.',
          429: 'Too many requests. Please wait.',
          500: 'Internal server error.',
          501: 'Not implemented.',
          502: 'Bad gateway. Try again shortly.',
          503: 'Service unavailable. Under maintenance.',
          504: 'Gateway timeout. Try again.',
        };
        ctx.statusMessage = customMessages[ctx.statusCode] || defaults[ctx.statusCode] || 'An unknown error occurred.';
      }

      await runBody(body);
    }
  },
};