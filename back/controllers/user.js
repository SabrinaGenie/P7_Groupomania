const db = require('../models/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')

exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			db.User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				username: req.body.username,
				email: req.body.email,
				password: hash,
				admin: false,
			})

				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))

				.catch((error) => res.status(400).json({ error }))
		})

		.catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
	db.User.findOne({
		where: { email: req.body.email },
	}).then((user) => {
		if (!user) {
			return res.status(401).json({ error: 'Utilisateur inexistant !' })
		}
		bcrypt
			.compare(req.body.password, user.password)
			.then((valid) => {
				if (!valid) {
					return res.status(401).json({ error: 'Mot de passe incorrect !' })
				}
				res.status(200).json({
					token: jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', {
						expiresIn: '24h',
					}),
					userData: {
						userId: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						picture: user.picture,
						admin: user.admin,
						description: user.description,
						email: user.email,
					},
				})
			})
			.catch((error) => res.status(500).json({ error }))
	})
}

// on récupère les informations d'un utilisateur
exports.getUser = (req, res, next) => {
	db.User.findOne({
		where: { id: req.params.id },
	})
		.then((user) => res.status(200).json(user))

		.catch((error) => res.status(500).json({ error }))
}

// on récupère tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
	db.User.findAll({
		attributes: [
			'id',
			'firstName',
			'lastName',
			'username',
			'email',
			'description',
			'picture',
		],
	})
		.then((users) => res.status(200).json(users))

		.catch((error) => res.status(500).json({ error }))
}

exports.updateUser = async (req, res, next) => {
	console.log(req.file)
	let newPicture
	let user = await db.User.findOne({ where: { id: req.params.id } })

	// si il y'a une nouvelle image on l'enregistre
	if (req.file) {
		newPicture = `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`
	}

	// s'il y'a une nouvelle image on l'enregistre et on supprime l'ancienne
	if (newPicture && user.picture) {
		const filename = user.picture.split('/images/')[1]
		fs.unlink(`images/${filename}`, (error) => {
			if (error) console.log(error)
			else {
				console.log(`Deleted file: images/${filename}`)
			}
		})
	}

	db.User.findOne({
		where: { id: req.params.id },
	})
		.then(() => {
			db.User.update(
				{
					username: req.body.username,
					email: req.body.email, /// change user email ?!?!
					description: req.body.description,
					picture: newPicture, // si il y'a une nouvelle image on l'enregistre dans la base de données
				},
				{ where: { id: req.params.id } }
			)
				.then(() => res.status(200).json({ message: 'Compte mis à jour !' }))
				.catch((error) => res.status(400).json({ error }))
		})
		.catch((error) => res.status(500).json({ error }))
}

exports.deleteUser = (req, res, next) => {
	db.User.findOne({
		where: { id: req.params.id },
	})
		.then((user) => {
			if (user.picture !== null) {
				// si il y'a une photo de profile on l'a supprime, puis on supprime l'user de la base de données
				const filename = user.picture.split('/images/')[1]
				fs.unlink(`images/${filename}`, () => {
					db.User.destroy({ where: { id: req.params.id } })
					res.status(200).json({ message: 'Compte supprimé !' })
				})
			} else {
				// sinon on supprime uniquement l'user
				db.User.destroy({ where: { id: req.params.id } })
				res.status(200).json({ message: 'Compte supprimé !' })
			}
		})

		.catch((error) => res.status(500).json({ error }))
}
