'use client';

import { WalletButton } from '../solana/solana-provider';

export function WalletPrompt() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <span className="loading loading-spinner loading-lg text-center"></span>
  );
}
