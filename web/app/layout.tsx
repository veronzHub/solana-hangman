import './global.css';
import { UiLayout } from '@/components/ui/ui-layout';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ReactQueryProvider } from './react-query-provider';
import { Roboto, Architects_Daughter, Patrick_Hand } from 'next/font/google';

const architectsDaughter = Architects_Daughter({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-architects-daughter',
});

const roboto = Roboto({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export const metadata = {
  title: 'Solana Hangman Game',
  description:
    "Experience the classic Hangman game enhanced by the capabilities of Solana's blockchain platform.",
  openGraph: {
    images: '/og-1200x630.png',
  },
};

const links: { label: string; path: string }[] = [
  // { label: 'Account', path: '/account' },
  // { label: 'Clusters', path: '/clusters' },
  { label: 'Create New Game', path: '/hangman/create' },
  { label: 'Play Hangman', path: '/hangman/play' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="night"
      className={`${roboto.variable} ${architectsDaughter.variable}`}
    >
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
