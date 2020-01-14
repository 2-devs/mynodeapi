module.exports = {
	env: process.env.ENV || 'production',
	port: process.env.PORT || '3000',
	email_from: 'orlandokauan.barros@gmail.com'
};

if (process.env.ENV === 'development') {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
}
