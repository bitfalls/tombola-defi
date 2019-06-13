pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

contract Tombola {
    
    address[] public players;
    uint256 public startTime;
    address public creator;
    address public winner;
    
    mapping (address => bool) public playing;
    
    constructor() public {
        startTime = now;
        creator = msg.sender;
    }
    
    function join() public {
        require(playing[msg.sender] == false, "Already playing!");
        players.push(msg.sender);
        playing[msg.sender] = true;
    }
    
    function pickOne() public {
        require(now > startTime + 4 hours, "4 hours have not yet passed");
        require(winner == address(0), "Winner must not have been picked already");
        winner = players[randomGen()];
    }
    
    function reRoll() public {
        require(msg.sender == creator, "Only the admin can reroll");
        winner = players[randomGen()];
    }
    
    function getNumberOfParticipants() public view returns (uint256) {
        return players.length;
    }
    
    function randomGen() view internal returns (uint256 randomNumber) {
        return(uint256(keccak256(abi.encodePacked(blockhash(block.number-1), uint256(blockhash(block.number - 200)) ))) % players.length);
    }
}