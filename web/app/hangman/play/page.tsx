import HangmanPlayPage from '@/components/hangman/hangman-play';

export const metadata = {
  title: 'Play a Hangman Game',
  description: 'Select a hangman game to play.',
};

export default function Page() {
  return <HangmanPlayPage />;
}
