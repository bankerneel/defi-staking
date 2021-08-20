// const { response } = require("express");

const stakingContractAddress = '0xc5e095f55AbBFf29960C6CD4D11954F31607C883';
const stakingABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'platformKey',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
    ],
    name: 'Claimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardDeposits',
        type: 'uint256',
      },
    ],
    name: 'RewardDeposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardDeposits',
        type: 'uint256',
      },
    ],
    name: 'RewardWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Staked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Unstaked',
    type: 'event',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'platformKey',
        type: 'string',
      },
    ],
    name: 'setPlatformKey',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStakes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'totalRewards',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'stakeAmount',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'key',
        type: 'string',
      },
    ],
    name: 'createStake',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'key',
        type: 'string',
      },
    ],
    name: 'removeStake',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'stakeholder',
        type: 'address',
      },
    ],
    name: 'getStakedUsersDetails',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'key',
        type: 'string',
      },
    ],
    name: 'claimReward',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'depositReward',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawReward',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRewardDeposits',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
];

let stakingContract;

const initialize = async () => {
  const { ethereum } = window;
  window.web3 = new Web3(ethereum);

  stakingContract = new web3.eth.Contract(
    JSON.parse(JSON.stringify(stakingABI)),
    stakingContractAddress,
  );

  setInterval(() => {
    $.get('/dashboard/update-reward', (result) => {
      if (result.message == 'Success') {
        $('#lableReward').html(
          `${result.data.rewards.reward.toFixed(2)} ${
            result.data.rewards.symbol
          }`,
        );
      }
    });
  }, 20000);
};

function requestAccount() {
  return ethereum.request({
    method: 'eth_requestAccounts',
  });
}
async function createStake() {
  try {
    const account = await requestAccount();
    const tokens = $('#stake-modal input[name=no-of-tokens]').val();

    $.get(`/dashboard/check-tokens/${tokens}`, (data) => {
      if (data.message == 'true') {
        const amount = web3.utils.toWei(tokens.toString(), 'ether');
        // return false;
        const bntokens = web3.utils.toBN(amount);
        stakingContract.methods
          .createStake(bntokens, data.data)
          .send({
            from: account[0],
            gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'Gwei')),
            // to: '0x9e4e53636722a54c2fca4582a7c43993576e1594',
            // data: '0xa9059cbb0000000000000000000000002f318c334780961fb129d2a6c30d0763d9a5c9700000000000000000000000000000000000000000000000000000000000003a98',
            // gas: 60000,
            // gasPrice: '20000000000',
          })
          .on('transactionHash', (hash) => {
            $('.preloader').removeClass('da-none');
            setTimeout(() => {
              $('.preloader').addClass('da-none');
              $('#stake-modal').modal('toggle');
              swal({
                title: 'Transaction Initiated',
                text:
                  'Please click on Sync Blockchain Data button, once your transaction gets confirmed by etherscan.io',
              });
            }, 300000);
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            $('.preloader').addClass('da-none');
          })
          .on('receipt', (receipt) => {
            // receipt example
            $.post('/dashboard/createStakingDetail', (result) => {
              if (result.message == 'Success') {
                window.location.reload();
              }
            });
            $('.preloader').addClass('da-none');
          })
          .on('error', console.error);
      } else {
        swal({
          title: 'Insufficient Balance !!',
          text: 'Cannot Stake Tokens !!',
          type: 'warning',
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function unstake() {
  try {
    $.get('/dashboard/update-reward/', async (result) => {
      const tokens = result.data.rewards.reward;
      if (tokens >= 0.5) {
        swal({
          title: 'Please Claim The Rewards First !!',
          text: 'Cannot Unstake Tokens if Accumulated Rewards are > 0.5',
          type: 'warning',
        });
      }
      const account = await requestAccount();
      stakingContract.methods
        .removeStake(result.data.platformKey)
        .send({
          from: account[0],
          gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'Gwei')),
          // to: '0x9e4e53636722a54c2fca4582a7c43993576e1594',
          // data: '0xa9059cbb0000000000000000000000002f318c334780961fb129d2a6c30d0763d9a5c9700000000000000000000000000000000000000000000000000000000000003a98',
          // gas: 60000,
          // gasPrice: '20000000000',
        })
        .on('transactionHash', (hash) => {
          $.post(
            '/dashboard/updateTransactionHash',
            { txhash: hash },
            (result) => {},
          );
          $('.preloader').removeClass('da-none');
          setTimeout(() => {
            $('.preloader').addClass('da-none');
            // $('#stake-modal').modal('toggle');
            swal({
              title: 'Transaction Initiated',
              text:
                'Please click on Sync Blockchain Data button, once your transaction gets confirmed by etherscan.io',
            });
          }, 300000);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          $('.preloader').addClass('da-none');
        })
        .on('receipt', (receipt) => {
          // receipt example
          $.post('/dashboard/deleteStakingDetail', (result) => {
            if (result.message == 'Success') {
              window.location.reload();
            }
          });
          $('.preloader').addClass('da-none');
        })
        .on('error', console.error);
    });
  } catch (error) {
    console.error(error);
  }
}

async function claimReward() {
  try {
    $.get('/dashboard/update-reward/', async (result) => {
      const tokens = result.data.rewards.reward;
      if (tokens < 0.5) {
        swal({
          title: '',
          text: 'Cannot Claim Rewards if Accumulated Rewards are < 0.5',
          type: 'warning',
        });
        return false;
      }
      const account = await requestAccount();
      const amount = web3.utils.toWei(tokens.toString(), 'ether');
      const bntokens = web3.utils.toBN(amount);
      stakingContract.methods
        .claimReward(bntokens, result.data.platformKey)
        .send({
          from: account[0],
          gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'Gwei')),
        })
        .on('transactionHash', (hash) => {
          $('.preloader').removeClass('da-none');
          setTimeout(() => {
            $('.preloader').addClass('da-none');
            swal({
              title: 'Transaction Initiated',
              text:
                'Please click on Sync Blockchain Data button, once your transaction gets confirmed by etherscan.io',
            });
          }, 300000);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          $.post('/dashboard/updateStakingTime', (result) => {
            if (result.message == 'Success') {
              window.location.reload();
            }
          });
          $('.preloader').addClass('da-none');
        })
        .on('receipt', (receipt) => {
          // receipt example
        });
    });
  } catch (error) {
    console.error(error);
  }
}

async function createStakingDetail() {
  $.post('/dashboard/syncBlockchainData', (result) => {
    if (result.message == 'Success') {
      swal({
        title: 'Success',
        text: 'Blockchain Data Synced Successfully',
        type: 'success',
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } else {
      swal({
        title: 'Failed',
        text: 'Blockchain Data Synced Failed',
      });
    }
  });
}

window.addEventListener('DOMContentLoaded', initialize);
