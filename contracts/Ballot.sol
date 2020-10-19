// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.11 <0.8.0;
    
/* 
    Smart contract to represent a ballot. Ballot is owned and managed by a presiding officer.
    Presiding Officer can enroll candidates. Voters can vote for a candidate using his/her name.
*/

contract Ballot {
    bool _active = true;
    address public presidingOfficer;
    string private winningParty;
    
    struct Voter {
        bool voted;
        // add other data related to voter here
    }
    
    struct Candidate {
        string name;
        string party;
        uint voteCount;
    }
    
    // Data structure to keep track of all voters
    mapping (address => Voter) public voters;
    
    // Data structure to keep track of all candidates
    mapping (string => Candidate) public candidates;
    
    string[] public candidateList;  // List of candidate names
    
    modifier restricted() {
        require(msg.sender == presidingOfficer, "Only Presiding Officer can perform this action");
        _;
    }
    
    modifier isActive() {
        require(_active == true, 'Ballot no longer active');
        _;
    }
    
    constructor() {
        presidingOfficer = msg.sender;
    }
        
    function enrollCandidate(string memory name, string memory party) public restricted isActive {       
        require(bytes(candidates[name].name).length == 0, 'Candidate already exists');
        candidates[name] = Candidate({name: name, party: party, voteCount: 0});
        candidateList.push(name);
    }
    
    function castVote(string memory candidateName) public isActive {
        require(voters[msg.sender].voted == false, "Already voted!");
        require(bytes(candidates[candidateName].name).length != 0, "Candidate does not exist");
        candidates[candidateName].voteCount += 1;
        voters[msg.sender].voted = true;
    }
    
    function closeBallot() public restricted isActive returns(string memory) {
        uint max = 0;
        string memory winner = '';
        for(uint i = 0; i < candidateList.length; i++) {
            Candidate memory current = candidates[candidateList[i]];
            if (current.voteCount > max) {
                winner = current.name;
                max = current.voteCount;
            }
            
        }
        _active = false;
        winningParty = candidates[winner].party;
    }
    
    function getResult() public view returns(string memory) {
        return winningParty;
    }
    
}