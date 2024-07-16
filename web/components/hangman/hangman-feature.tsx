'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useHangmanProgram } from './hangman-data-access';
import { HangmanCreate, HangmanList } from './hangman-ui';

export default function HangmanFeature() {
  const { publicKey } = useWallet();
  const { programId } = useHangmanProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Hangman"
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
      <HangmanList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}