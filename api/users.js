var db  = require('../utilities/SQL');
var Authentication  = require('../utilities/Authentication');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app) { 

    // POST /api/user
    app.post('/api/user', function(request, response, next){
        
        var username = request.body.username;
        var password = request.body.password;

		var salt = bcrypt.genSaltSync(10);
		var passwordHash = bcrypt.hashSync(password, salt);
        
        db.query('INSERT INTO `users` SET ?', { 'username': username, 'password': passwordHash }, function (error, results, fields) {

            if(error) {
                next();
            } else {
                response.json({
                    'username': username
                });
            }

        });        

    });

    // POST /api/login
    app.post('/api/login', Authentication.BasicAuthentication, function(request, response){

        // username was set via middleware
        if(response.pageInfo.user.username) {
            response.json(response.pageInfo.user);
        } else {
            response.status(401).send({ error: 'Unauthorized' });
        }
        
    });

    // POST /api/logout
    app.post('/api/logout', function(request, response){
         response.status(401).send({ error: 'Unauthorized' });
    });

}
