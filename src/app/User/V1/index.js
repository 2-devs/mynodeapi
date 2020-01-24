const { Router } = require('express');
const router = Router();
const auth = require('../../../middlewares/auth');
const UserController = require('./controllers/User');

router.get('/', auth, (req, res) => (new UserController(req, res)).get());

router.put('/', auth, async (req, res) => (new UserController(req, res)).update());

router.delete('/', auth, async (req, res) => (new UserController(req, res)).delete());

router.get('/list', async (req, res) => (new UserController(req, res)).getList());

module.exports = app => app.use('/user/V1', router);
