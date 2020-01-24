const UserModel = require('../../models/User');

class User {    
	constructor (request, response) {
		this.request = request;
		this.response = response;
		this.fieldsNotCreated = ['_id', '__v', 'createdAt', 'updatedAt', 'loggedAt', 'passwordResetToken', 'passwordResetExpires', 'status', 'activationCode'];
		this.fieldsNotUpdated = ['_id', '__v', 'email', 'createdAt', 'updatedAt', 'loggedAt', 'passwordResetToken', 'passwordResetExpires', 'activationCode'];
	}

	async get () {
		try {
			const { _id } = this.request.user;
			const data = await UserModel.findOne({ _id });

			if (!data) throw 'User not found';
			if (!data.status) throw 'User account is not active';

			return this.response.success(data);
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}

	async getList () {
		try {
			let query = {};
			const { createdAt } = this.request.query;
			if (createdAt)
				query.createdAt = { $gte: new Date(createdAt) };

			const data = await UserModel.find(query).select('name email phone');
			return this.response.success(data);
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}
    
	async update () {
		try {
			if (!Object.keys(this.request.body).length) throw 'No data received';
            
			const { _id } = this.request.user;
			const user = await UserModel.findOne({ _id });

			if (!user) throw 'User not found';
			if (!user.status) throw 'User account is not active';

			Object.keys(this.request.body).map(k => this.fieldsNotUpdated.indexOf(k) < 0 ? user[k] = this.request.body[k] : null);
			await user.save();
            
			return this.response.success({ message: 'User data updated successfully' });
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}
    
	async delete () {
		try {
			const { _id } = this.request.user;
			const user = await UserModel.findOne({ _id });
			if (!user) throw 'User not found';
			if (!user.status) throw 'User account is not active';

			await user.remove();
            
			return this.response.success({ message: 'User account has been deleted successfully' });
		} catch (err) {
			console.error(err);
			return this.response.error(err);
		}
	}
}

module.exports = User;
