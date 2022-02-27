pragma solidity ^0.5.6;

interface IPool {
    event SwapToBrag(address indexed user, uint256 amount);
    event SwapToKlay(address indexed user, uint256 amount);

    function swapToBrag() external payable;

    function swapToKlay(uint256 amount) external;
}
