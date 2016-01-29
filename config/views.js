const path = require('path');
const hbs = require('express-hbs');
const moment = require('moment');

process.title = 'node'; // Hack for numbro :-/
const numbro = require('numbro');

module.exports = function(app) {
  hbs.registerHelper("debug", function(optionalValue) {
    return;
    console.log("Current Context");
    console.log("====================");
    console.log(this);
  
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }
  });

  hbs.registerHelper("moment", function(value) {
    return moment(value).fromNow();
  });
  
  hbs.registerHelper("currency", function(value, props) {
    const options = props.hash;
    options.precision = options.precision || 0;
    const number = numbro(value);
    const cultures = numbro.culture('fr-FR');
    return (options.precision == 2) ? number.format('$ 0,0.00') : number.format('$ 0,0');
  });
  
  app.engine('hbs', hbs.express4({
    partialsDir: path.resolve(__dirname + '/../views/partials'),
    defaultLayout: path.resolve(__dirname + '/../views/layouts/default')
  }));
  app.set('view engine', 'hbs');
  app.set('views', path.resolve(__dirname + '/../views')); 
}