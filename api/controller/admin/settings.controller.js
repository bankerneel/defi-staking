const {
	getRewardDeposits,
	depositReward,
	withdrawReward,
} = require('../../services/v1/adminService')

module.exports.index = async (req, res) => {
	let rewartToken = await getRewardDeposits(
		'0xfA8ba1cDb7482b0c73c39f259Ce9354ef17A9bB1'
	)
	rewartToken /= 1e18
	rewartToken = rewartToken.toFixed(2)
	res.render('admin/settings', {
		title: 'DeFixy-admin',
		activeBar: 'settings',
		rewartToken,
	})
}

module.exports.depositRewards = async (req, res) => {
	const amount = req.body.depositRewardAmount
	const { privateKey } = req
	const rewards = await depositReward(
		amount,
		'0xfA8ba1cDb7482b0c73c39f259Ce9354ef17A9bB1',
		privateKey
	)
	res.send({
		status: 1,
		message: 'Reward deposited',
	})
}

module.exports.withdrawRewards = async (req, res) => {
	const amount = req.body.withdrawRewardAmount
	const { privateKey } = req
	const rewards = await withdrawReward(
		amount,
		'0xfA8ba1cDb7482b0c73c39f259Ce9354ef17A9bB1',
		privateKey
	)
	res.send({
		status: 1,
		message: 'Reward deposited',
	})
}
