const passwordSchema = require("../models/PwdControl");

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, "{'message' : 'Mot de passe invalide'}", 
        {"content-type" : "application/json"});

        res.end("Ce format de mot de passe est invalide");
    }
    else { 
        next();
    }
};