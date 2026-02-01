// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    uint public constant REWARD_RATE = 1e18;
    uint private totalStakedTokens;
    uint public rewardPerTokenStored;
    uint public lastUpdateTime;

    mapping(address => uint) public stakedBalance;
    mapping(address => uint) public rewards;
    mapping(address => uint) public userRewardPerTokenPaid;

    event Staked(address indexed user, uint256 indexed amount);
    event Withdrawn(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

    constructor(address stakingToken, address rewardToken) {
        require(stakingToken != address(0), "Staking token cannot be zero address");
        require(rewardToken != address(0), "Reward token cannot be zero address");
        s_stakingToken = IERC20(stakingToken);
        s_rewardToken = IERC20(rewardToken);
    }

    function rewardPerToken() public view returns (uint) {
        if (totalStakedTokens == 0) {
            return rewardPerTokenStored;
        }
        uint totalTime = block.timestamp - lastUpdateTime;
        uint totalRewards = REWARD_RATE * totalTime;
        return
            rewardPerTokenStored +
            (totalRewards * 1e18 / totalStakedTokens);
    }

    function earned(address account) public view returns (uint) {
        return
            (stakedBalance[account] *
                (rewardPerToken() - userRewardPerTokenPaid[account])) /
            1e18 +
            rewards[account];
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }

    function stake(uint amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        totalStakedTokens = totalStakedTokens + amount;
        stakedBalance[msg.sender] = stakedBalance[msg.sender] + amount;
        emit Staked(msg.sender, amount);
        bool success = s_stakingToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Transfer Failed");
    }

    function withdrawStakedTokens(
        uint amount
    ) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Amount must be greater than zero");
        require(
            stakedBalance[msg.sender] >= amount,
            "Staked amount not enough"
        );
        totalStakedTokens = totalStakedTokens - amount;
        stakedBalance[msg.sender] = stakedBalance[msg.sender] - amount;
        emit Withdrawn(msg.sender, amount);
        bool success = s_stakingToken.transfer(msg.sender, amount);
        require(success, "Transfer Failed");
    }

    function getReward() external nonReentrant updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        require(
            s_rewardToken.balanceOf(address(this)) >= reward,
            "Insufficient reward token balance"
        );
        rewards[msg.sender] = 0;
        emit RewardsClaimed(msg.sender, reward);
        bool success = s_rewardToken.transfer(msg.sender, reward);
        require(success, "Transfer Failed");
    }
}

//0xF8DfC4770C2D0cd0ce68D72cF290b8CF65E6e0A2