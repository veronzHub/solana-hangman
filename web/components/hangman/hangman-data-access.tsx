'use client';

import {
  getHangmanProgram,
  getHangmanProgramId,
} from '@example-create-solana-dapp/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useHangmanProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getHangmanProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getHangmanProgram(provider);

  const accounts = useQuery({
    queryKey: ['hangman', 'all', { cluster }],
    queryFn: () => program.account.hangman.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const start_game = useMutation({
    mutationKey: ['hangman', 'start_game', { cluster }],
    mutationFn: ({
      keypair,
      word,
      max_wrong_guesses,
    }: {
      keypair: Keypair;
      word: string;
      max_wrong_guesses: number;
    }) =>
      program.methods
        .startGame(word, max_wrong_guesses)
        .accounts({ hangman: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    accounts,
    start_game,
    program,
    programId,
    getProgramAccount,
  };
}

export function useHangmanProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useHangmanProgram();

  const accountQuery = useQuery({
    queryKey: ['hangman', 'fetch', { cluster, account }],
    queryFn: () => program.account.hangman.fetch(account),
  });

  const make_guess = useMutation({
    mutationKey: ['hangman', 'make_game', { cluster }],
    mutationFn: ({ account, letter }: { account: PublicKey; letter: number }) =>
      program.methods.makeGuess(letter).accounts({ hangman: account }).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accountQuery.refetch();
    },
    onError: () => toast.error('Failed to work'),
  });

  return {
    accountQuery,
    make_guess,
  };
}
