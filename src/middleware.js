
import * as waxjs from "@waxio/waxjs/dist";

const WAX_RPC_URL = 'https://wax.greymass.com'
const wax = new waxjs.WaxJS(WAX_RPC_URL, null, null, false);


export async function submitVote (activeUser, ballotName, voteOption) {
try {
    let checkReg = await wax.rpc.get_table_rows({
      code: 'decide',
      scope: activeUser.accountName,
      table: 'voters',
      limit: 1,
      json: true
    });
    let actions = [
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
    if (Array.isArray(checkReg.rows) && checkReg.rows.length === 0) {
      actions.unshift({
        account: 'decide',
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
      });
    }
    console.log(actions);
    console.log(activeUser);
    const voteTransaction = {
      actions: actions
    };

    const voteResult = await activeUser.signTransaction(
      voteTransaction, {
        blocksBehind: 3,
        expireSeconds: 30
    });
    console.log(voteResult);
  } catch(e) {
    document.getElementById('castvote').append(e);
  }
}