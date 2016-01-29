const api = require('../lib/api');

module.exports = {
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
          group: results[0], 
          transactions,
          users
        });
      })
      .catch(next);
  }
};
