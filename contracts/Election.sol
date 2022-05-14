// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.20;

contract Election{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;

    uint public candidateCount;

    constructor() public{
        addCandidate("Candidate 1");
        addCandidate ("Candidate 2");
    }

    function addCandidate(string memory _name) private{
        candidateCount ++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }
} 