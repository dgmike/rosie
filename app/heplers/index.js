const url = (req, path) => {
  const port = (req.app.locals.port == '80') ? '' : `:${req.app.locals.port}`;
  return `${req.protocol}://${req.hostname}${port}${req.baseUrl}${path}`
};

const queryLimits = (req) => {
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

  return { limit, offset };
}

module.exports = {
  url,
  queryLimits,
}