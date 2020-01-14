const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = {
	generateToken: (params) => jwt.sign({ params }, authConfig.secret, { expiresIn: 86400 }),
	generatePinCode: () => parseInt((Math.random() * 99999999999).toFixed().padStart(4, 1).slice(0, 4)),
};