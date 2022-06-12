// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.2;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        uint256 wardNum;
    }

    struct Voter {
        string name;
        uint256 loc;
        string addr;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint256 => Candidate) public candidates;

    mapping(uint256 => uint256) public candidates2;
    //Fetch Voter
    mapping(uint256 => Voter) public voter;
    //Check voter already exist
    mapping(address => bool) voterExists;
    // Store Candidates Count
    uint256 public candidatesCount;

    uint256 public candidatesCount2;

    uint256 public indexCount=1;

    // voted event
    event votedEvent(uint256 indexed _candidateId);

    constructor() public {
        addCandidates("Candidate 1", 22);
        addCandidates("Candidate 2", 33);
    }

    modifier onlyVoter() {
        require(voterExists[msg.sender]);
        _;
    }

    function add() public pure returns (string memory) {
        if (true) {
            return ("http://localhost:3000/addcandidate.html");
        }
    }

    function addCandidates(string memory _name, uint256 _ward) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0,_ward);
    }

    function voterClick(string memory addr) public view returns (string memory) {
        for (uint i = 1; i <= indexCount; i++) {
            if (voterExists[msg.sender]) {
                return ("http://localhost:3000/castvote.html");
            } else {
                return ("http://localhost:3000/register.html");
            }
        }
    }

     function castVote(bool a) public view returns (string memory){
         if(a){
             return ("http://localhost:3000/castvote.html");
         }
         else{
             return ("http://localhost:3000/castvote.html");
         }
     }

 function addVoter2(
        uint256 _ward
    )public{
        candidates2[_ward]= 2*_ward;
    }



    function addVoter(
        string memory _name,
        uint256 _ward,
        string memory voterAddr
    )public{
        indexCount = indexCount + 1;
        voter[indexCount].name = _name;
        voter[indexCount].loc = _ward;
        voter[indexCount].addr = voterAddr;
        voterExists[msg.sender] = true;
        castVote(voterExists[msg.sender]);
        // for (uint i = 1; i <= indexCount; i++) {
        //     if (voterExists[msg.sender]) {
        //         return ("http://localhost:3000/castvote.html");
        //     } else {
        //         return ("http://localhost:3000/register.html");
        //     }
        // }

        // return ("http://localhost:3000/castvote.html");
    }



    function vote(uint256 _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
