App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        alert(account);
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    //Render Voter Address at register
    urlVal = window.location.href;
    if (urlVal == "http://localhost:3000/register.html") {
      window.ethereum.enable().then(function(){

        web3.eth.getCoinbase(function (err, account) {
          if (err === null) {
            App.account = account;
            $("#addrOfVoter").val(account);
          }
        });
      
      })

    }

    // Load contract data
    App.contracts.Election.deployed().then(function (instance) {
      
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function (candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function (candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          var wardNum = candidate[3];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td><td>" + wardNum + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);

          //Render candidate Add Btton
          web3.eth.getCoinbase(function (err, account) {
            if (err === null && account == 0xBc8E4Ab9075B09e9aAA61024F8Bd244eBDa31c48) {

            }
            else {
              $('#add').hide();
            }
          });
        });
      }
      return electionInstance.voters(App.account);
    }).then(function (hasVoted) {
      // Do not allow a user to vote
      if (hasVoted) {
        web3.eth.getCoinbase(function (err, account) {
          if (err === null && account == 0xBc8E4Ab9075B09e9aAA61024F8Bd244eBDa31c48) {
            $('#candidatesSelect').hide();
            $('#selectID').hide();
            $('#submit').hide();
          }
          else {
            $('form').hide();
          }
        });
      }
      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });
  },

  toVoter: function () {
    var electionInstance;
    web3.eth.getCoinbase(function (err, account) {
      addr1 = account.toString();
      web3.eth.sendTransaction(
        {
          from: addr1,
          to: "0xbbdd536883dcF14629715d0Fa3950e5e964B7c5e",
          value: "5000000000000000000",
          data: "0xdf",
          gas: 21300
        }, function (err, transactionHash) {
          if (!err) {
            alert("2")
            web3.eth.getCoinbase(function (err, account) {
              if (err === null) {
                App.contracts.Election.deployed().then(function (instance) {
                  electionInstance = instance;
                  alert("1");
                  x1 = parseInt($('#locOfRetailer').val());
                  x2 = $('#addrOfVoter').val();
                  x3 = $('#exampleLastName').val();
                  x4 = $('#exampleFirstName').val();
                  alert(typeof x1)
                  return electionInstance.addVoter(x4+' '+x3,x1,x2);
                }).then(function (x) {
                  alert(x)
                  window.location.href = x;
                })
              }
            });
          }
          else {
            alert(err)
          }
        });
    });
  },




  OnLoad: function () {
    var electionInstance;
    web3.eth.getCoinbase(function (err, account) {
      if (err === null && account == 0x308A32f1Ab0428FdDa0e380FaBb5cC93A3E6590e) {
        App.contracts.Election.deployed().then(function (instance) {
          electionInstance = instance;
          $('#user').html(account)
          return electionInstance.candidatesCount();
        }).then(function (candidatesCount) {
          var id = parseInt(candidatesCount) + 1;
          var vc = 0;
          $('#ID').val(id)
          $('#VoteCount').val(vc)
        })
      }
      else {
        alert("Permission Denied")
        return electionInstance.add();
      }
    });
  },

  addCandidate: function () {

    var x1 = $('#Name').val();
    var x2 = $('#ID').val();
    var x3 = $('#VoteCount').val();
    var x4 = $('#WardNum').val();
    var electionInstance;
    web3.eth.getCoinbase(function (err, account) {
      if (err === null && account == 0x308A32f1Ab0428FdDa0e380FaBb5cC93A3E6590e) {
        App.contracts.Election.deployed().then(function (instance) {
          electionInstance = instance;
          alert(x1)
          return electionInstance.addCandidates(x1, x4);
        }).catch(function (err) {
          console.log(err)
        })
      }
      else {
        alert("Permission Denied")
        return electionInstance.add();
      }
    });
  },

  voterCheck: function () {
    var electionInstance;

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.contracts.Election.deployed().then(function (instance) {
          electionInstance = instance;
          alert(account)
          var acc = account;
          return electionInstance.voterClick(acc);
        }).then(function (x) {
          alert(x);
          window.location.href = x;

        })
      }
    });

  },





  checkAdmin: function () {
    var electionInstance;
    web3.eth.getCoinbase(function (err, account) {
      if (err === null && account == 0x308A32f1Ab0428FdDa0e380FaBb5cC93A3E6590e) {
        App.contracts.Election.deployed().then(function (instance) {
          electionInstance = instance;
          alert("Admin")
          return electionInstance.add();
        }).then(function (x) { window.location.href = x; }
        )
      }
      else {
        alert("Permission Denied")
        return electionInstance.add();
      }
    });
  },

  castVote: function () {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function (result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
