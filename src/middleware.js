export async function submitVote (activeUser, ballotName, voteOption) {
try {
    let actions = [
        {
            account: 'oig',
            name: 'regvoter',
            authorization: [{
                actor: activeUser.accountName,
                permission: 'active',
            }],
            data: {
                voter: activeUser.accountName,
                treasury_symbol: '8,VOTE',
                referrer: 'oig'
            },
        },
      {
        account: 'decide',
        name: 'sync',
        authorization: [{
          actor: activeUser.accountName,
          permission: 'active',
        }],
        data: {
          voter: activeUser.accountName,
        },
      },
      {
        account: 'oig',
        name: 'updtstate',
        authorization: [{
          actor: activeUser.accountName,
          permission: 'active',
        }],
        data: {}
      },
      {
        account: 'decide',
        name: 'castvote',
        authorization: [{
          actor: activeUser.accountName,
          permission: 'active',
        }],
        data: {
          voter: activeUser.accountName,
          options: [voteOption],
          ballot_name: ballotName
        },
      }
    ]

    const voteTransaction = {
      actions: actions
    };



    await activeUser.signTransaction(
      voteTransaction, {
        blocksBehind: 3,
        expireSeconds: 30
    });
    let castVote = document.getElementById('castvote');
    castVote.classList.add("success");
    castVote.classList.remove("error");
    castVote.innerHTML = 'You successfully cast a vote!';
  } catch(e) {
    let castVote = document.getElementById('castvote');
    castVote.classList.add("error");
    castVote.classList.remove("success");
    castVote.innerHTML = e;
  }
}