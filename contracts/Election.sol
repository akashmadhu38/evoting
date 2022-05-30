// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.2;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        uint wardNum;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidateCount;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    address public admin;

    constructor() public {
        addCandidates("Candidate 1",22);
        addCandidates("Candidate 2",33);
    }


    function add() public view returns (string memory){

        return("http://localhost:3000/addcandidate.html");
    }



    function addCandidates (string memory _name,uint _ward) public{
        candidateCount ++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0,_ward);
    }

    
    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidateCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
