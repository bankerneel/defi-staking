require('dotenv').config()

module.exports = {
	db: {
		// str: 'mongodb://127.0.0.1:27017/DeFiXy',
		str: process.env.DEFIXY_MONGO_URL,
		options: {
			auto_reconnect: true,
			reconnectTries: Number.MAX_SAFE_INTEGER,
			poolSize: 200,
			useNewUrlParser: true,
			readPreference: 'primaryPreferred',
		},
	},
	base_url: 'https://localhost:3000/',
	tokenContractAddress: '0xc5e095f55AbBFf29960C6CD4D11954F31607C883',
}
