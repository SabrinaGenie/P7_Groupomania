const express = require('express')
const db = require('./models/database')
const path = require('path')

const usersRoutes = require('./routes/user.js')
const postsRoutes = require('./routes/posts.js')

const app = express()
const cors = require('cors')

app.get('/', (req, res) => {
	console.log('back working ...')
	res.send('send working  ... ')
})

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	)
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	)
	next()
})

app.use(cors())

// Test de connexion à la base de données
const dataBaseTest = async function () {
	try {
		await db.sequelize.authenticate()
		console.log('Connected to the database !')
	} catch (error) {
		console.error('Unable to connect to the database, too bad !', error)
	}
}
dataBaseTest()

db.sequelize
	.sync({ force: false }) //
	.then(() => console.log('Database is updating !'))
	.catch((error) => console.log("can't connect to db", error))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/images/', express.static(path.join(__dirname, 'images')))

app.use('/api/users/', usersRoutes)
app.use('/api/posts/', postsRoutes)

module.exports = app
