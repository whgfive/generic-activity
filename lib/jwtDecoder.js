var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
    if (req.method == "application/jwt"){
        var token = req.body;
        if (token) {
            try {
                var decoded = jwt.decode(token, process.env.jwtTokenSecret);
                req.decoded = decoded;
                return next();
            } catch (err) {
                return next();
            }
        } else {
            next();
        }    
    }
    else{
        next();
    }   
}