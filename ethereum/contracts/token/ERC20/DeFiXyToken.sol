//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./ERC20.sol";
import "../../libs/access/Ownable.sol";

contract DeFiXyToken is ERC20, Ownable {
    address private _stakingContractAddress;

    /**
     * @notice The constructor for creating the DeFiXy token
     * @param name_ The name of the token
     * @param symbol_ The symbol for the token
     * @param decimals_ The decimals for the token
     * @param totalSupply_ The max number of tokens in existence
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 totalSupply_
    ) public ERC20(name_, symbol_) {
        totalSupply_ = totalSupply_ * (10**uint256(decimals_));

        if (totalSupply_ > 0) {
            _mint(owner(), totalSupply_);
        }
    }

    /**
     * @dev Assigns the address of staking contract
     *
     * @param stakingContractAddress Address of contract to be assigned
     *
     */
    function setStakingContractAddress(address stakingContractAddress)
        external
        onlyOwner
    {
        _stakingContractAddress = stakingContractAddress;
    }

    /**
     * @dev Transfers `stakeAmount` number of tokens from sender address to staking address.
     *
     * @param sender Address from which tokens are to withdrawn.
     * @param recipient Address to which tokens are to be deposited.
     * @param amount The number of tokens to be transferred.
     *
     * @return true, if token transfer is successful.
     *
     * Requirements:
     *
     * - This function can be called only from the `_stakingContractAddress`.
     */
    function stakeTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) external virtual returns (bool) {
        require(
            _stakingContractAddress == _msgSender(),
            "DeFiXyToken: You can stake tokens using staking platform"
        );
        _transfer(sender, recipient, amount);
        return true;
    }
}
