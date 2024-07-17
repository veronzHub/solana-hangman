'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useHangmanProgram } from './hangman-data-access';
import { HangmanList } from './hangman-ui';

export default function HangmanPlayPage() {
  const { publicKey } = useWallet();
  const { programId } = useHangmanProgram();

  return publicKey ? (
    <div>
      <AppHero title="Play Hangman" subtitle={'Start playing a game below'}>
        <HangmanList />
      </AppHero>
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
