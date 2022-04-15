/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet';
import * as web3 from '@solana/web3.js';

/**
 * @category Instructions
 * @category CancelBidReceipt
 * @category generated
 */
const cancelBidReceiptStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */;
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'CancelBidReceiptInstructionArgs',
);
/**
 * Accounts required by the _cancelBidReceipt_ instruction
 * @category Instructions
 * @category CancelBidReceipt
 * @category generated
 */
export type CancelBidReceiptInstructionAccounts = {
  receipt: web3.PublicKey;
  instruction: web3.PublicKey;
};

const cancelBidReceiptInstructionDiscriminator = [246, 108, 27, 229, 220, 42, 176, 43];

/**
 * Creates a _CancelBidReceipt_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 *
 * @category Instructions
 * @category CancelBidReceipt
 * @category generated
 */
export function createCancelBidReceiptInstruction(accounts: CancelBidReceiptInstructionAccounts) {
  const { receipt, instruction } = accounts;

  const [data] = cancelBidReceiptStruct.serialize({
    instructionDiscriminator: cancelBidReceiptInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: receipt,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: instruction,
      isWritable: false,
      isSigner: false,
    },
  ];

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey('hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk'),
    keys,
    data,
  });
  return ix;
}
