const api = require('../lib/api');
const request = require('request');
const config = require('config');

module.exports = {
  
  publicPage: (req, res, next) => {
    console.log("proxying to ", config.host.app + '/' + req.params.slug);
    req
      .pipe(request(config.host.app + '/' + req.params.slug))
      .pipe(res);

    // api
    //   .get(`/groups/${req.params.slug}/`)
    //   .then(collective => {

    //     const meta = {
    //       url: collective.publicUrl,
    //       title: 'Join ' + collective.name + '\'s open collective',
    //       description: collective.name + ' is collecting funds to continue their activities. Chip in!',
    //       image: collective.image || collective.logo,
    //       twitter: '@'+collective.twitterHandle,
    //     };

    //     res.render('collective', { meta });
    
    //   })
    //   .catch((error) => {
    //     return next(error);
    //   });
    
  },
  
  widget: (req, res, next) => {
    
    const promises = [api.get('/groups/' + req.params.slug), api.get('/groups/' + req.params.slug + '/transactions'),api.get('/groups/' + req.params.slug + '/users')];
    Promise.all(promises)
      .then((results) => {
        
        var users = results[2];
        var usersById = [];
        users.map((u) => {
          usersById[u.id] = u;
        });
        
        var transactions = results[1];
        transactions.map((tr) => {
          tr.user = usersById[tr.UserId];
          return tr;
        });
        
        res.render('widget', {
          layout: 'layouts/widget',
          collective: results[0], 
          transactions,
          users
        });
      })
      .catch(next);
  }
};
