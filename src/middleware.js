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
                referrer: activeUser.accountName
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
  } catch(e) {
    document.getElementById('leader-table').insertAdjacentHTML(
        'beforebegin', '<span className="error">'+ e +'</span>');
  }
}