import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer footer-center px-10 py-16 text-base-content border-t-2 border-[#1a1a1a] text-xs mt-20">
      <aside>
        <p>
          Solana Hangman is a project created by{' '}
          <Link
            className="link hover:text-white"
            href="https://github.com/zataara"
            target="_blank"
            rel="noopener noreferrer"
          >
            zataara
          </Link>
          ,{' '}
          <Link
            className="link hover:text-white"
            href="https://github.com/lacodajeff"
            target="_blank"
            rel="noopener noreferrer"
          >
            lacodajeff
          </Link>
          , and{' '}
          <Link
            className="link hover:text-white"
            href="https://github.com/veronzHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            veronzHub
          </Link>
        </p>
        <p className="mt-120">
          <Link
            className="link hover:text-white"
            href="https://github.com/veronzHub/solana-hangman/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Git Repo
          </Link>
        </p>
      </aside>
    </footer>
  );
}
