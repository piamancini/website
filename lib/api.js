const config = require('config');
const request = require('request-promise');

module.exports = {
  get: function(url) {
    const options = {
      uri: config.apiUrl + url,
      qs: {
        api_key: config.apiKey
      },
      json: true
    }
    return request(options);
  }
}
