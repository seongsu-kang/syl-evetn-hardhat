pragma solidity ^0.5.6;

import "./klaytn-contracts/token/KIP17/IKIP17Enumerable.sol";
import "./klaytn-contracts/token/KIP7/IKIP7.sol";
import "./klaytn-contracts/math/SafeMath.sol";
import "./klaytn-contracts/ownership/Ownable.sol";
import "hardhat/console.sol";

//    address syl = 0xdb8cb9905d81eebc77bac749db9a0b8ce6ab9bef;
//    address sylNft = 0xe2dd65c215089dda1695ae96cce77f301a1750e5;
contract GatherSYL is Ownable {
    using SafeMath for uint256;
    address[] public distributeNum;
    mapping(address => bool) public stakeAllowed;
    mapping(address => bool) public nftAllowed;
    mapping(address => mapping(address => uint256[])) public nftStaked;

    function() external payable {}

    //스테이킹
    function staking(address _nfts, uint256 _sylId) external {
        require(nftAllowed[_nfts]);
        require(stakeAllowed[msg.sender]);
        IKIP17Enumerable nfts = IKIP17Enumerable(_nfts);
        uint256 tokenId = nfts.tokenByIndex(_sylId);
        require(nfts.ownerOf(tokenId) == msg.sender, "not owner");
        nfts.transferFrom(msg.sender, address(this), tokenId);
        nftStaked[_nfts][msg.sender].push(tokenId);
    }

    // 수거 ( 자기 것만 )
    function withdraw(address _nfts, uint256 _sylId) external {
        require(nftAllowed[_nfts]);
        require(stakeAllowed[msg.sender]);
        IKIP17Enumerable nfts = IKIP17Enumerable(_nfts);
        uint256 tokenId = nfts.tokenByIndex(_sylId);
        require(nfts.ownerOf(tokenId) == address(this), "not owner");
        for (
            uint256 k = 0;
            k < nftStaked[_nfts][msg.sender].length;
            k = k.add(1)
        ) {
            if (nftStaked[_nfts][msg.sender][k] == tokenId) {
                delete nftStaked[_nfts][msg.sender][k];
                nfts.transferFrom(address(this), msg.sender, tokenId);
            }
        }
    }

    // 토큰 비율 대로 분배
    function distributionToken(address _token) external {
        IKIP7 token = IKIP7(_token);
        uint256 amount = token.balanceOf(address(this)).div(10);
        for (uint256 i = 0; i < 6; i = i.add(1)) {
            if (i < 4) {
                token.transfer(distributeNum[i], amount.mul(2));
            } else {
                token.transfer(distributeNum[i], amount.mul(1));
            }
        }
    }

    function addNftAllowed(address _nft) public onlyOwner {
        nftAllowed[_nft] = true;
    }

    function addStakeAllowed(address _account) public onlyOwner {
        stakeAllowed[_account] = true;
    }

    function addDistributeNum(address _account) public onlyOwner {
        distributeNum.push(_account);
    }
}
