const db = require('../models/database')
const fs = require('fs')
const jwt = require('jsonwebtoken')

exports.createPost = (req, res, next) => {
	// Nous avons besoin de récupérer l'userId par l'intermédiaire du token
	const token = req.headers.authorization.split(' ')[1]
	const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
	const userId = decodedToken.userId
	let imageUrl = null

	// Nous cherchons ensuite l'user correspondant
	db.User.findOne({
		attributes: ['id', 'username', 'picture'],
		where: {
			id: userId,
		},
	})
		// Et enregistrer image s'il y a
		.then(() => {
			if (req.file) {
				imageUrl = `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`
			} else {
				imageUrl = null
			}
			db.Post.create({
				message: req.body.message,
				imageURL: imageUrl,
				link: req.body.link,
				UserId: userId,
			}).then(() => res.status(201).json({ message: 'Post créé !' }))
		})

		.catch((error) => res.status(400).json({ error }))
}

exports.getOnePost = (req, res, next) => {
	db.Post.findOne({
		where: {
			id: req.params.id,
		},
		// On inclue également les infos user, like, comment, liées au post, qui nous serons utiles
		include: [
			{
				model: db.User,
				attributes: ['username', 'picture', 'id'],
			},
			{
				model: db.Like,
				attributes: ['PostId', 'UserId'],
				include: [
					{
						model: db.User,
						attributes: ['username', 'picture'],
					},
				],
			},
			{
				model: db.Comment,
				order: [['createdAt', 'DESC']], // renvoyer chronologiquement les commentaires
				attributes: ['id', 'comment', 'UserId'],
				include: [
					{
						model: db.User,
						attributes: ['username', 'picture'],
					},
				],
			},
		],
	})
		.then((post) => res.status(200).json(post))

		.catch((error) => res.status(404).json({ error }))
}

exports.getAllPosts = (req, res, next) => {
	db.Post.findAll({
		attributes: [
			'id',
			'message',
			'imageURL',
			'link',
			'createdAt',
			'updatedAt',
			'UserId',
		],

		order: [['createdAt', 'DESC']],

		include: [
			{
				model: db.User,
				attributes: ['username', 'picture', 'id'],
			},
			{
				model: db.Like,
				attributes: ['PostId', 'UserId'],
				include: [
					{
						model: db.User,
						attributes: ['username', 'picture'],
					},
				],
			},
			{
				model: db.Comment,
				order: [['createdAt', 'DESC']],
				attributes: ['id', 'comment', 'UserId', 'createdAt'],
				include: [
					{
						model: db.User,
						attributes: ['username', 'picture'],
					},
				],
			},
		],
	})
		.then((posts) => res.status(200).json(posts))

		.catch((error) => res.status(404).json({ error }))
}

exports.updatePost = async (req, res, next) => {
	let newImageUrl
	let post = await db.Post.findOne({ where: { id: req.params.id } })

	// renvoyer une nouvelle image si une est ajoutée
	if (req.file) {
		newImageUrl = `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`
	}

	// si nouvelle image, et image précédente existante remplacer cette dernière et la supprimer
	if (newImageUrl && post.imageURL) {
		const filename = post.imageURL.split('/images/')[1]
		fs.unlink(`images/${filename}`, (error) => {
			if (error) console.log(error)
			else {
				console.log(`Deleted file: images/${filename}`)
			}
		})
	}

	db.Post.findOne({
		where: {
			id: req.params.id,
		},
	})
		.then(() => {
			db.Post.update(
				{
					message: req.body.message,
					imageURL: newImageUrl, // si nouvelle image, l'enregistrer
					link: req.body.link,
				},
				{
					where: { id: req.params.id },
				}
			)
				.then(() => res.status(200).json({ message: 'Post mis à jour !' }))
				.catch((error) => res.status(400).json({ error }))
		})
		.catch((error) => res.status(500).json({ error }))
}

exports.deletePost = (req, res, next) => {
	db.Post.findOne({
		where: {
			id: req.params.id,
		},
	})
		.then((post) => {
			if (post.imageURL !== null) {
				// si il y'a une image on l'a supprime puis on supprime dans la base de données le post
				const filename = post.imageURL.split('/images/')[1]
				fs.unlink(`images/${filename}`, () => {
					db.Post.destroy(
						{ where: { id: post.id } },
						{ truncate: true, restartIdentity: true }
					)
					res.status(200).json({ message: 'Post supprimé !' })
				})
			} else {
				// Sinon on supprime uniquement le post
				db.Post.destroy(
					{ where: { id: post.id } },
					{ truncate: true, restartIdentity: true }
				)
				res.status(200).json({ message: 'Post supprimé !' })
			}
		})

		.catch((error) => res.status(500).json({ error }))
}
