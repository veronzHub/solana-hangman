'use client';

import { Keypair, PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useHangmanProgram,
  useHangmanProgramAccount,
} from './hangman-data-access';

export function HangmanCreate() {
  const [word, setWord] = useState('');
  const [maxWrongGuesses, setMaxWrongGuesses] = useState(8);
  const { start_game } = useHangmanProgram();

  const handleSubmit = (e) => {
    e.preventDefault();
    const keypair = Keypair.generate();
    start_game.mutateAsync({
      keypair,
      word,
      max_wrong_guesses: maxWrongGuesses,
    });
  };

  return (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            <label className="font-bold text-lg">Your word</label>
            <input
              type="text"
              className="form-control input input-bordered w-full"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <label className="font-bold text-lg">Max Wrong Guesses</label>
            <input
              type="number"
              className="form-control input input-bordered w-full"
              value={maxWrongGuesses}
              onChange={(e) => setMaxWrongGuesses(e.target.value)}
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              disabled={start_game.isPending}
            >
              Create Game{start_game.isPending && '...'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function HangmanList() {
  const { accounts, getProgramAccount } = useHangmanProgram();

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
          {accounts.data?.map((account) => (
            <HangmanCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function HangmanCard({ account }: { account: PublicKey }) {
  const { accountQuery } = useHangmanProgramAccount({ account });

  const word = useMemo(
    () => accountQuery.data?.word ?? 0,
    [accountQuery.data?.word]
  );
  const maxWrongGuesses = useMemo(
    () => accountQuery.data?.maxWrongGuesses ?? 0,
    [accountQuery.data?.maxWrongGuesses]
  );

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            Word
          </h2>
          <p>{word}</p>

          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            Max wrong guesses
          </h2>
          <p>{maxWrongGuesses}</p>
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
