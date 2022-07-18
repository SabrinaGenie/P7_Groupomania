const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // Durée de blocage du compte
	max: 10, // Nous avons droit à 5 tentatives de connexion à partir de la même IP avant d'être bloqué durant 10 min
	message:
		'Tentatives de connexion nombreuses cette IP sera bloquée pendant 10 minutes',
})

module.exports = { limiter }
