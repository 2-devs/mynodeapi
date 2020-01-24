const UserModel = require('../../../User/models/User');
const crypto = require('crypto');
const mailer = require('../../../../modules/mail');
const bcrypt = require('bcryptjs');
const { generateToken, generatePinCode } = require('../../../../utils/hash');

class User {    
	constructor (request, response) {
		this.request = request;
		this.response = response;
		this.fieldsNotCreated = ['_id', '__v', 'createdAt', 'updatedAt', 'loggedAt', 'passwordResetToken', 'passwordResetExpires', 'status', 'activationCode'];
		this.fieldsNotUpdated = ['_id', '__v', 'email', 'createdAt', 'updatedAt', 'loggedAt', 'passwordResetToken', 'passwordResetExpires', 'activationCode'];
	}

	async login() {
		try {
			const { email, password } = this.request.body;
			const user = await UserModel.findOne({ email }).select('+password');

			if (!user) throw { email: 'User not found' };
			if (!user.status) throw 'User account is not active';
			if (!await bcrypt.compare(password, user.password)) throw { password: 'Invalid password' };

			user.password = undefined;
			await UserModel.updateOne({ _id: user._id }, { $set: { loggedAt: new Date() } });

			const data = { token: generateToken({ _id: user._id, email: user.email }) };
			return this.response.success(data);
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}

	async register () {
		try {
			const { name, email, password, accountType } = this.request.body;

			if (!name || !email || !password || !accountType) throw '\'email\', \'password\', \'name\' and \'accountType\' are required';
			if (await UserModel.findOne({ email })) throw 'User already exist';

			const user = new UserModel({
				name,
				email,
				password,
				accountType
			});

			/*
			const pinCode = generatePinCode();
			user.activationCode = pinCode;

			await mailer.sendMail({
				to: this.request.body.email,
				from: process.env.email_from,
				template: 'auth/active-account',
				context: { pinCode }
			});
			*/

			user.status = true;
			await user.save();

			return this.response.success({ message: 'User created' });
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}
    
	async activeAccount () {
		try {
			const { email, activationCode } = this.request.body;
			if (!email || !activationCode) throw '\'email\' and \'activationCode\' are required';
            
			const user = await UserModel.findOne({ email }).select('+activationCode');

			if (!user) throw 'User not found';
			if (!user.activationCode) throw 'Activation code is no longer valid';
			if (user.activationCode !== activationCode) throw 'Activation code is invalid';
            
			user.status = true;
			user.activationCode = undefined;
			await user.save();
            
			return this.response.success({ message: 'User successfully activated' });
		} catch (err) {
			return this.response.error(err);
		}
	}
    
	async resendActivationCode () {
		try {
			const { email } = this.request.body;
			if (!email) throw '\'email\' is required';
            
			const user = await UserModel.findOne({ email });

			if (!user) throw 'User not found';
			if (user.status) throw 'User account is already active';

			const pinCode = generatePinCode();
			user.activationCode = pinCode;
            
			await mailer.sendMail({
				to: email,
				from: 'mauro.marssola@hotmail.com',
				template: 'auth/active-account',
				context: { pinCode }
			});
			await user.save();
            
			return this.response.success({ message: 'Activation code sent successfully' });
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}
    
	async authenticate () {
		const { email, password } = this.request.body;
		const user = await UserModel.findOne({ email }).select('+password');

		if (!user) throw { email: 'User not found' };
		if (!user.status) throw 'User account is not active';
		if (!await bcrypt.compare(password, user.password)) throw { password: 'Invalid password' };
        
		user.password = undefined;
		await UserModel.updateOne({ _id: user._id }, { $set: { loggedAt: new Date() } });
        
		const data = { token: generateToken({ _id: user._id, email: user.email }) };
		return this.response.success({ data });
	}
    
	async forgotPassword () {
		try {
			const { email } = this.request.body;
			if (!email) throw { email: '\'email\' is required' };
            
			const user = await UserModel.findOne({ email });

			if (!user) throw 'User not found';
            
			const token = crypto.randomBytes(20).toString('hex');
			const expires = new Date();
			expires.setHours(expires.getHours() + 1);
            
			user.passwordResetToken = token;
			user.passwordResetExpires = expires;
			await user.save();
            
			await mailer.sendMail({
				to: this.request.body.email,
				from: 'mauro.marssola@hotmail.com',
				template: 'auth/forgot-password',
				context: { token }
			});
            
			return this.response.success({ message: 'The code to recover your password was successfully sent to your email' });
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}
    
	async resetPassword () {
		try {
			const { email, token, password } = this.request.body;
			if (!email || !token || !password) throw '\'email\', \'token\' and \'password\' are required';
            
			const user = await UserModel.findOne({ email }).select('+passwordResetToken +passwordResetExpires');

			if (!user) throw 'User not found';
			if (user.passwordResetToken !== token) throw 'Token is invalid';
			if (new Date() > user.passwordResetExpires) throw 'Token is expired, generate a new one';
            
			user.password = password;
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save();
            
			return this.response.success({ message: 'Your password has been changed successfully' });
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}
}

module.exports = User;
