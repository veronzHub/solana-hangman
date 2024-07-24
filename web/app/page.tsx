import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="py-[64px] flex flex-col md:flex-row justify-center items-center md:space-x-20 p-10">
      <div className="w-full md:w-1/2 text-center mb-20 md:mb-0">
        <h1 className="text-4xl sm:text-6xl text-secondary mb-10">
          Decentralized Hangman{' '}
        </h1>
        <p className="text-2xl md:text-3xl mb-10 leading-8 md:leading-10">
          Experience the classic Hangman game enhanced by the capabilities of
          Solana&apos;s blockchain platform.
        </p>
        <p className="mb-10">
          <Image
            src="/logo.png"
            width={200}
            height={200}
            alt="Solana"
            className="m-auto"
          />
        </p>
        <p>
          <Link
            href="/hangman/play"
            className="btn btn-lg btn-primary rounded-btn text-white text-3xl px-3 py-3 md:inline-block block md:px-16"
          >
            Play Now
          </Link>
        </p>
      </div>
      <div className="w-full md:w-1/3">
        <Image
          src="/large-hangman.png"
          alt="Hero Image"
          width={700}
          height={700}
          className="w-full"
        />
      </div>
    </main>
  );
}
