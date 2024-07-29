'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useHangmanProgram,
  useHangmanProgramAccount,
} from './hangman-data-access';
import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import Link from 'next/link';
import { LoadingSpinner, WalletPrompt } from './hangman-ui';

export default function HangmanPlayPage() {
  const { publicKey } = useWallet();

  return publicKey ? (
    <AppHero title="Play Hangman" subtitle="Start playing a game below">
      <HangmanList />
    </AppHero>
  ) : (
    <WalletPrompt />
  );
}

export function HangmanList() {
  const { accounts, getProgramAccount } = useHangmanProgram();
  const activeGames = accounts.data?.filter(
    (account) => !account.account.isGameOver
  );

  if (getProgramAccount.isLoading) {
    return <LoadingSpinner />;
  }
  if (!getProgramAccount.data?.value) {
    return <NoAccountMessage />;
  }
  return (
    <div className="space-y-6">
      {activeGames?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {activeGames.map((account) => (
            <HangmanCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <NoActiveGamesMessage />
      )}
    </div>
  );
}

function NoAccountMessage() {
  return (
    <div className="alert alert-info flex justify-center">
      <span>
        Program account not found. Make sure you have deployed the program and
        are on the correct cluster.
      </span>
    </div>
  );
}

function NoActiveGamesMessage() {
  return (
    <div className="text-center">
      <p className="text-warning">
        No Active Games Found.{' '}
        <Link href="/hangman/create" className="text-primary">
          Create one!
        </Link>
      </p>
    </div>
  );
}

function HangmanCard({ account }: { account: PublicKey }) {
  const { accountQuery } = useHangmanProgramAccount({ account });

  const gameData = useMemo(
    () => extractGameData(accountQuery.data),
    [accountQuery.data]
  );

  if (accountQuery.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content ">
      <div className=" card-body items-center text-center">
        <div className="space-y-6">
          <GameTitle gameData={gameData} />
          <GameControls gameData={gameData} account={account} />
          <AccountLink account={account} />
        </div>
      </div>
    </div>
  );
}

function extractGameData(data) {
  return {
    word: data?.word ?? '',
    maxWrongGuesses: data?.maxWrongGuesses ?? 0,
    wrongGuesses: data?.wrongGuesses ?? 0,
    guessedLetters: data?.guessedLetters ?? [],
    wrong_guessed_letters: data?.wrongGuessedLetters ?? [],
    is_game_over: data?.isGameOver ?? false,
    is_game_won: data?.isGameWon ?? false,
  };
}

function GameTitle({ gameData }) {
  return (
    <h2 className="card-title justify-center cursor-pointer text-4xl">
      {gameData.word
        .split('')
        .map((letter) =>
          gameData.guessedLetters.includes(letter.charCodeAt(0)) ? letter : '_'
        )
        .join(' ')}
    </h2>
  );
}

function GameControls({ gameData, account }) {
  if (gameData.is_game_over) return null;

  return (
    <>
      <p className="justify-center cursor-pointer mb-5">
        Wrong Guesses Left: {gameData.maxWrongGuesses - gameData.wrongGuesses}
      </p>
      <div>
        <Link
          href={`/hangman/play/${account}`}
          className="btn btn-md btn-primary rounded-btn text-white text-lg px-3 py-3 md:inline-block block md:px-8"
        >
          Play
        </Link>
      </div>
    </>
  );
}

function AccountLink({ account }) {
  return (
    <div className="text-center space-y-4">
      <p>
        <ExplorerLink
          path={`account/${account}`}
          label={ellipsify(account.toString())}
        />
      </p>
    </div>
  );
}
