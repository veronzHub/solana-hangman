'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useHangmanProgram } from './hangman-data-access';
import { Keypair } from '@solana/web3.js';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import { useRouter } from 'next/navigation';
import { WalletPrompt } from './hangman-ui';

export default function HangmanCreatePage() {
  const { publicKey } = useWallet();
  const { programId } = useHangmanProgram();

  return publicKey ? (
    <>
      <AppHero
        title="Create New Hangman Game"
        subtitle={
          'Create a new game by choosing a word and clicking the "Create Game" button.'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <HangmanCreate />
      </AppHero>
    </>
  ) : (
    <WalletPrompt />
  );
}

function HangmanCreate() {
  const [word, setWord] = useState('');
  const [maxWrongGuesses, setMaxWrongGuesses] = useState(7);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [wordErrorMessage, setWordErrorMessage] = useState('');
  const [numErrorMessage, setNumErrorMessage] = useState('');
  const router = useRouter();
  const { start_game } = useHangmanProgram();

  const handleStartGame = async (
    keypair: Keypair,
    word: string,
    maxWrongGuesses: number
  ) => {
    try {
      await start_game.mutateAsync({
        keypair,
        word,
        max_wrong_guesses: maxWrongGuesses,
      });
      router.push('/hangman/play');
    } catch (error) {
      console.log('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let isFormValid = true;

    if (maxWrongGuesses > 7 || maxWrongGuesses < 2) {
      setNumErrorMessage('Please enter a number between 2 and 7.');
      setLoading(false);
      isFormValid = false;
    } else {
      setNumErrorMessage('');
    }

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (response.ok) {
        setIsValid(true);
        setWordErrorMessage('');
      } else {
        isFormValid = false;
        setWordErrorMessage('Invalid word. Please enter a valid English word.');
      }
    } catch (error) {
      isFormValid = false;
      setWordErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }

    setIsValid(isFormValid);

    if (isFormValid) {
      const keypair = Keypair.generate();
      handleStartGame(keypair, word, maxWrongGuesses);
    } else {
      return;
    }
  };

  return (
    <div className="card card-bordered  border-4 text-neutral-content">
      <div className="card-body items-center text-center w-full">
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit}>
            <label className="font-bold text-lg">Max Wrong Guesses</label>
            <input
              type="number"
              value={maxWrongGuesses}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMaxWrongGuesses(Number(e.target.value))
              }
              className={cn(
                'w-20 form-control input input-bordered mb-5 mt-2 mx-auto',
                numErrorMessage.length > 1 ? 'border-error' : ''
              )}
            />
            {!isValid && <p className="text-error mb-5">{numErrorMessage}</p>}
            <label className="font-bold text-lg">Your Word</label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className={cn(
                'form-control input input-bordered w-full mb-5 mt-2',
                wordErrorMessage.length > 1 ? 'border-error' : ''
              )}
            />
            {!isValid && <p className="text-error mb-5">{wordErrorMessage}</p>}

            <button
              className="btn btn-lg btn-primary mt-5"
              disabled={start_game.isPending}
            >
              {loading
                ? 'Checking...'
                : start_game.isPending
                ? 'Submitting...'
                : 'Create Game'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
