const env = require('../config/env');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

let mongoconnect = env.env === 'local' ? 'mongodb://localhost:27017/2devs' : 'mongodb://localhost:27017/2devs';
let mongo = mongoose.connect(mongoconnect, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('\x1b[32m%s\x1b[0m', '[ Ok ]', `mongodb has been connected: ${env.env}`);
}).catch(err => {
	console.log('\x1b[31m%s\x1b[0m', '[ Er ]', `mongodb was not connected: ${env.env}`);
	console.log(err);
});

module.exports = mongo;
