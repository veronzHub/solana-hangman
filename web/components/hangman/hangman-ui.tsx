'use client';

import { Keypair, PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useHangmanProgram,
  useHangmanProgramAccount,
} from './hangman-data-access';


export function HangmanList() {
  const { accounts, getProgramAccount } = useHangmanProgram();

  const sortedGamesByOpen = accounts.data?.slice().sort((a, b) => {
    if (a.account.isGameOver === b.account.isGameOver) {
      return 0;
    }
    return a.account.isGameOver ? 1 : -1;
  });

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {sortedGamesByOpen?.map((account) => (
            <HangmanCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No Games Found</h2>
        </div>
      )}
    </div>
  );
}

function HangmanCard({ account }: { account: PublicKey }) {
  const { accountQuery, make_guess } = useHangmanProgramAccount({ account });
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const gameData = useMemo(
    () => ({
      word: accountQuery.data?.word ?? '',
      maxWrongGuesses: accountQuery.data?.maxWrongGuesses ?? 0,
      wrongGuesses: accountQuery.data?.wrongGuesses ?? 0,
      guessedLetters: accountQuery.data?.guessedLetters ?? [],
      wrong_guessed_letters: accountQuery.data?.wrongGuessedLetters ?? [],
      is_game_over: accountQuery.data?.isGameOver ?? false,
      is_game_won: accountQuery.data?.isGameWon ?? false,
    }),
    [
      accountQuery.data?.word,
      accountQuery.data?.maxWrongGuesses,
      accountQuery.data?.wrongGuesses,
      accountQuery.data?.guessedLetters,
      accountQuery.data?.wrongGuessedLetters,
      accountQuery.data?.isGameOver,
      accountQuery.data?.isGameWon,
    ]
  );

  const handleLetterClick = (letter: string) => {
    const letterCode = letter.charCodeAt(0);

    make_guess.mutateAsync({
      account,
      letter: letterCode,
    });
  };

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2 className="card-title justify-center cursor-pointer text-4xl">
            {gameData.word
              .split('')
              .map((letter) =>
                gameData.guessedLetters.includes(letter.charCodeAt(0))
                  ? letter
                  : '_'
              )
              .join(' ')}
          </h2>

          <div className="justify-center cursor-pointer">
            {gameData.is_game_over ? (
              <div>
                <p>GAME OVER</p>
                <p>
                  {gameData.is_game_won
                    ? 'You won!'
                    : `You lost! The word was "${gameData.word}"`}
                </p>
              </div>
            ) : (
              <>
                <p className="justify-center cursor-pointer mb-5">
                  Wrong Guesses Left:{' '}
                  {gameData.maxWrongGuesses - gameData.wrongGuesses}
                </p>
                <div>
                  {alphabet.map((letter) => {
                    const letterCode = letter.charCodeAt(0);
                    const isDisabled =
                      gameData.guessedLetters.includes(letterCode) ||
                      gameData.wrong_guessed_letters.includes(letterCode);
                    return (
                      <button
                        className={`m-1 pr-2 pl-2 pt- rounded-lg text-black ${
                          isDisabled ? 'bg-slate-700' : 'bg-slate-300'
                        }`}
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        disabled={isDisabled}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
