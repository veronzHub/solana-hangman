'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { PublicKey } from '@solana/web3.js';
import { useHangmanProgramAccount } from '@/components/hangman/hangman-data-access';
import { ExplorerLink } from '@/components/cluster/cluster-ui';
import { ellipsify } from '@/components/ui/ui-layout';
import Image from 'next/image';
import Confetti from 'react-confetti';
import { useWallet } from '@solana/wallet-adapter-react';
import { LoadingSpinner, WalletPrompt } from './hangman-ui';
import Link from 'next/link';

export default function PlayAddressPage() {
  const { publicKey } = useWallet();
  return publicKey ? <CheckAddressExists /> : <WalletPrompt />;
}

function CheckAddressExists() {
  const params = useParams();
  const { address } = params;

  const { account, isValidAddress } = useMemo(() => {
    try {
      const publicKey = new PublicKey(address);
      return { account: publicKey, isValidAddress: true };
    } catch (error) {
      return { account: null, isValidAddress: false };
    }
  }, [address]);

  //handles typescript issue
  const { accountQuery, make_guess } = useHangmanProgramAccount(
    account
      ? { account }
      : { account: new PublicKey('11111111111111111111111111111111') }
  );

  const gameData = useMemo(() => {
    const data = accountQuery.data;
    return {
      word: data?.word ?? '',
      maxWrongGuesses: data?.maxWrongGuesses ?? 0,
      wrongGuesses: data?.wrongGuesses ?? 0,
      guessedLetters: data?.guessedLetters ?? [],
      wrong_guessed_letters: data?.wrongGuessedLetters ?? [],
      is_game_over: data?.isGameOver ?? false,
      is_game_won: data?.isGameWon ?? false,
    };
  }, [accountQuery.data]);

  if (accountQuery.isLoading) {
    return (
      <div className="w-full items-center flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return !isValidAddress || !accountQuery.data ? (
    <div className="w-full items-center text-error flex justify-center">
      <span>
        Invalid address or program account not found. Please check the URL and
        try again.
      </span>
    </div>
  ) : (
    <div className="w-full lg:w-2/3 m-auto">
      <GameCard account={account} gameData={gameData} make_guess={make_guess} />
    </div>
  );
}

function GameCard({
  account,
  gameData,
  make_guess,
}: {
  account: PublicKey | null;
  gameData: any;
  make_guess: any;
}) {
  const windowSize = useWindowSize();
  return (
    <div className="relative card card-bordered border-base-300 border-4 text-neutral-content m-4">
      {gameData.is_game_won && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          style={{ position: 'fixed', top: 0, left: 0 }}
          recycle={false}
          gravity={0.2}
        />
      )}
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <p>
            <ExplorerLink
              path={`account/${account}`}
              label={ellipsify(account?.toString())}
            />
          </p>
          <Image
            src={`/${gameData.maxWrongGuesses - gameData.wrongGuesses}.png`}
            width={200}
            height={200}
            alt="Solana"
            className="m-auto"
          />
          <h1 className="text-3xl sm:text-6xl text-secondary mb-20">
            {gameData.word
              .split('')
              .map((letter: string) =>
                gameData.guessedLetters.includes(letter.charCodeAt(0))
                  ? letter
                  : '_'
              )
              .join(' ')}
          </h1>
          <div className="justify-center cursor-pointer">
            {gameData.is_game_over ? (
              <GameOverMessage gameData={gameData} />
            ) : (
              <GameControls
                gameData={gameData}
                make_guess={make_guess}
                account={account}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GameOverMessage({ gameData }: { gameData: any }) {
  return (
    <div>
      <p className="mb-4 mt-10">GAME OVER</p>
      {gameData.is_game_won ? (
        <>
          <h2 className="animate-jump-in text-6xl">You won!</h2>
          <p className="m-10 text-xl underline text-secondary">
            <Link href="/hangman/play">Play another game</Link>
          </p>
        </>
      ) : (
        <>
          <h2 className="animate-jump-in text-6xl">You lost!</h2>
          <p className="text-xl mt-4">
            The word was &quot;{gameData.word}&quot;
          </p>
          <p className="m-10 text-xl underline text-secondary">
            <Link href="/hangman/play">Play another game</Link>
          </p>
        </>
      )}
    </div>
  );
}

function GameControls({
  gameData,
  make_guess,
  account,
}: {
  gameData: any;
  make_guess: any;
  account: PublicKey | null;
}) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  function handleLetterClick(letter: string) {
    const letterCode = letter.charCodeAt(0);
    make_guess.mutateAsync({ account, letter: letterCode });
  }
  return (
    <>
      <p className="justify-center mb-5">
        Wrong Guesses Left: {gameData.maxWrongGuesses - gameData.wrongGuesses}
      </p>
      <div>
        {alphabet.map((letter) => {
          const letterCode = letter.charCodeAt(0);
          const isDisabled =
            gameData.guessedLetters.includes(letterCode) ||
            gameData.wrong_guessed_letters.includes(letterCode);
          return (
            <span key={letter} className="relative">
              <button
                className={`uppercase letters btn-md  text-lg md:text-2xl m-1 md:m-2 rounded-lg ${
                  isDisabled ? '' : ''
                }`}
                onClick={() => handleLetterClick(letter)}
                disabled={isDisabled}
              >
                {letter}
              </button>
              {isDisabled && (
                <span className="absolute w-4/5 h-1 bg-primary md:top-0 bottom-0 top-1 left-1 md:left-2 right-0 rotate-45 z-20"></span>
              )}
            </span>
          );
        })}
      </div>
    </>
  );
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : undefined,
    height: typeof window !== 'undefined' ? window.innerHeight : undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
