import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
const assert = require("chai").assert;
// import { SolanaHangman } from "../target/types/solana_hangman";

describe("hangman_game", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.HangmanGame;

  it("Starts a game", async () => {
    const hangman = anchor.web3.Keypair.generate();
    const word = "hello";
    const maxWrongGuesses = 5;

    await program.rpc.startGame(word, new anchor.BN(maxWrongGuesses), {
      accounts: {
        hangman: hangman.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [hangman],
    });

    const hangmanAccount = await program.account.hangman.fetch(
      hangman.publicKey
    );

    assert.isTrue(hangmanAccount.isInitialized);
    assert.equal(hangmanAccount.word, word);
    assert.equal(hangmanAccount.wordLength, word.length);
    assert.equal(hangmanAccount.maxWrongGuesses, maxWrongGuesses);
    assert.equal(hangmanAccount.wrongGuesses, 0);
    assert.lengthOf(hangmanAccount.guessedLetters, word.length);
  });

  it("Makes a correct guess", async () => {
    const hangman = anchor.web3.Keypair.generate();
    const word = "hello";
    const maxWrongGuesses = 5;

    await program.rpc.startGame(word, new anchor.BN(maxWrongGuesses), {
      accounts: {
        hangman: hangman.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [hangman],
    });

    await program.rpc.makeGuess("h".charCodeAt(0), {
      accounts: {
        hangman: hangman.publicKey,
      },
    });

    const hangmanAccount = await program.account.hangman.fetch(
      hangman.publicKey
    );

    assert.equal(hangmanAccount.guessedLetters[0], "h".charCodeAt(0));
    assert.equal(hangmanAccount.wrongGuesses, 0);
  });

  it("Makes an incorrect guess", async () => {
    const hangman = anchor.web3.Keypair.generate();
    const word = "hello";
    const maxWrongGuesses = 5;

    await program.rpc.startGame(word, new anchor.BN(maxWrongGuesses), {
      accounts: {
        hangman: hangman.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [hangman],
    });

    await program.rpc.makeGuess("z".charCodeAt(0), {
      accounts: {
        hangman: hangman.publicKey,
      },
    });

    const hangmanAccount = await program.account.hangman.fetch(
      hangman.publicKey
    );

    assert.equal(hangmanAccount.wrongGuesses, 1);
  });
});
