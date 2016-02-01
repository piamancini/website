const config = require('config');
const request = require('request');

const apiUrl = url => {
  const withoutParams = config.host.api + (url.replace('/api/', '/'));
  const hasParams = url.match(/\?/);

  return withoutParams + (hasParams ? '&' : '?') + `api_key=${config.apiKey}`;
};

module.exports = (req, res) => {
  req
    .pipe(request(apiUrl(req.url)))
    .pipe(res);
}