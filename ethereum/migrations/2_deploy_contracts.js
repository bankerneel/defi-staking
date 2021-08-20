require('dotenv').config()

const DeFiXyToken = artifacts.require('DeFiXyToken')
const DeFiXyStaking = artifacts.require('DeFiXyStaking')

const PlatformKey = process.env.PLATFORM_KEY
console.log('PlatformKey', PlatformKey)
module.exports = function (deployer) {
	deployer.deploy(
		DeFiXyStaking,
		'0xc5e095f55AbBFf29960C6CD4D11954F31607C883',
		PlatformKey
	)
}

// module.exports = function (deployer) {
// 	deployer.deploy(DeFiXyToken, 'DeFiXy', 'DFX', 18, 100000000)
// }
