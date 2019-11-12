const express = require('express')
const router = express.Router()

const AuthController = require('./controllers/Auth')

router.post('/register', async (req, res) => (new AuthController(req, res)).register())

router.post('/active', async (req, res) => (new AuthController(req, res)).activeAccount())

router.post('/resend-activation-code', async (req, res) => (new AuthController(req, res)).resendActivationCode())

router.post('/authenticate', async (req, res) => (new AuthController(req, res)).authenticate())

router.post('/forgot-password', async (req, res) => (new AuthController(req, res)).forgotPassword())

router.post('/reset-password', async (req, res) => (new AuthController(req, res)).resetPassword())

module.exports = app => app.use('/auth/V1', router)