const { Router } = require('express');
const router = Router();
const auth = require('../../../middlewares/auth');
const UserController = require('./controllers/User');

router.get('/', auth, (req, res) => (new UserController(req, res)).getUser());

router.put('/', auth, async (req, res) => (new UserController(req, res)).updateUser());

router.delete('/', auth, async (req, res) => (new UserController(req, res)).deleteUser());

module.exports = app => app.use('/user/V1', router);
