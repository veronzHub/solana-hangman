// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import HangmanIDL from '../target/idl/hangman_game.json';
import type { HangmanGame } from '../target/types/hangman_game';

// Re-export the generated IDL and type
export { HangmanGame, HangmanIDL };

// The programId is imported from the program IDL.
export const HANGMAN_PROGRAM_ID = new PublicKey(HangmanIDL.address);

// This is a helper function to get the Hangman Anchor program.
export function getHangmanProgram(provider: AnchorProvider) {
  return new Program(HangmanIDL as HangmanGame, provider);
}

// This is a helper function to get the program ID for the Hangman program depending on the cluster.
export function getHangmanProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return HANGMAN_PROGRAM_ID;
  }
}
