const passwordValidator = require('password-validator')

const passwordSchema = new passwordValidator()

passwordSchema
	.is()
	.min(6)
	.is()
	.max(40)
	.has()
	.not()
	.spaces()
	.is()
	.not()
	.oneOf(['Password', 'Pwd', 'Password123', 'Pwd123', 'AZERTY', 'QWERTY'])

module.exports = passwordSchema
