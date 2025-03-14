import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorError } from '@coral-xyz/anchor';
import { assert } from 'chai';

import { governanceKeypair } from './hooks';
import { assertKeysEqual } from './genericTests';
import { SvmRestaking } from '../target/types/svm_restaking';

describe('update_governance', () => {
  const program = anchor.workspace.SvmRestaking as Program<SvmRestaking>;

  const newGovernanceKeypair = anchor.web3.Keypair.generate();

  const [globalState] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('global_state')],
    program.programId
  );

  it('Not allow others to update governance', async () => {
    try {
      await program.methods
        .updateGovernance(newGovernanceKeypair.publicKey)
        .accounts({
          governance: program.provider.publicKey, //not the actual governance
          globalState,
        })
        .rpc();
    } catch (error) {
      const errMsg = 'Caller not governance';
      assert.equal((error as AnchorError).error.errorMessage, errMsg);
    }
  });

  it('Allow governance to update', async () => {
    await program.methods
      .updateGovernance(newGovernanceKeypair.publicKey)
      .accounts({
        governance: governanceKeypair.publicKey,
        globalState,
      })
      .signers([governanceKeypair]) //signing txn by governance
      .rpc();

    const gs = await program.account.globalState.fetch(globalState);

    assertKeysEqual(gs.governance, newGovernanceKeypair.publicKey);
  });

  after(async () => {
    //give governance back to actual address
    await program.methods
      .updateGovernance(governanceKeypair.publicKey)
      .accounts({
        governance: newGovernanceKeypair.publicKey,
        globalState,
      })
      .signers([newGovernanceKeypair]) //signing txn by governance
      .rpc();
  });
});
