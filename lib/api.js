const config = require('config');
const request = require('request-promise');

module.exports = {
  get: function(url) {
    const options = {
      uri: config.host.api + url,
      qs: {
        api_key: config.apiKey
      },
      json: true
    }
    return request(options);
  }
}