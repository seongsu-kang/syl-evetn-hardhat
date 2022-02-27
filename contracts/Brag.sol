pragma solidity ^0.5.0;

import "./klaytn-contracts/token/KIP7/KIP7Mintable.sol";
import "./klaytn-contracts/token/KIP7/KIP7Burnable.sol";
import "./klaytn-contracts/token/KIP7/KIP7Pausable.sol";
import "./klaytn-contracts/token/KIP7/KIP7Metadata.sol";
import "./klaytn-contracts/math/SafeMath.sol";

contract BRAG is
    KIP7Mintable,
    KIP7Burnable,
    KIP7Pausable,
    KIP7Metadata("BRAG", "BRAG", 18)
{
    constructor() public {
        _mint(msg.sender, SafeMath.mul(10000000, 1e18));
    }
}
