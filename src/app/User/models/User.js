const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	accountType: {
		type: String,
		enum: ['Common', 'Developer', 'Admin'],
		default: 'Common'
	},
	accountDeveloper: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'AccountDeveloper'
	},
	accountCommon: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'AccountCommon'
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	passwordResetToken: {
		type: String,
		select: false,
	},
	passwordResetExpires: {
		type: Date,
		select: false,
	},
	status: {
		type: Boolean,
		default: false
	},
	activationCode: {
		type: Number,
		select: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
	},
	loggedAt:  {
		type: Date,
	}
});

UserSchema.pre('save', async function (next) {
	if (this.password) {
		const hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
	}
	// if (this.phone) this.phone = this.phone.replace(/\D/g, '');
	this.updatedAt = new Date();
	next();
});

// UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
