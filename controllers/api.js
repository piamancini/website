const config = require('config');
const request = require('request');

const apiUrl = url => {
  const withoutParams = config.apiUrl + (url.replace('/api/', ''));
  const hasParams = _.contains(url, '?');

  return withoutParams + (hasParams ? '&' : '?') + `api_key=${config.apiKey}`;
};

module.exports = (req, res) => {
  req
    .pipe(request(apiUrl(req.url)))
    .pipe(res);
}