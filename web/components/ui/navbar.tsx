'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from '../solana/solana-provider';
import { ClusterUiSelect } from '../cluster/cluster-ui';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import Hamburger from 'hamburger-react';

export default function Navbar({
  links,
}: {
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0  justify-between p-6">
      <Link href="/" className="mr-20" onClick={handleLinkClick}>
        <Image src="/hangman-logo.png" alt="Logo" width={260} height={62} />
      </Link>
      <div className="relative">
        <div className="lg:hidden cursor-pointer z-50 fixed top-6 right-6">
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <div
          className={cn(
            'fixed top-0 right-0 h-full bg-[#333333] bg-opacity-90 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden pt-16 z-40',
            isOpen ? 'translate-x-0' : 'translate-x-full',
            'w-64'
          )}
        >
          <LinkList
            links={links}
            handleLinkClick={handleLinkClick}
            mobile={true}
          />
        </div>
        <LinkList
          links={links}
          handleLinkClick={handleLinkClick}
          pathname={pathname}
        />
      </div>
    </nav>
  );
}

function LinkList({
  links,
  handleLinkClick,
  mobile,
  pathname,
}: {
  links: { label: string; path: string }[];
  handleLinkClick: () => void;
  mobile?: boolean;
  pathname?: string;
}) {
  return (
    <ul
      className={cn(
        'items-center',
        mobile
          ? 'flex flex-col  px-1 lg:space-y-4 pt-6'
          : 'hidden lg:flex space-x-2'
      )}
    >
      {links.map(({ label, path }) => (
        <li
          key={path}
          className={cn(
            'items-center',
            mobile ? 'block w-full text-center lg:pr-5' : 'group pr-5'
          )}
        >
          <Link
            className={cn(
              'block py-3',
              mobile && 'hover:bg-base-100 transition-colors duration-200'
            )}
            href={path}
            onClick={handleLinkClick}
          >
            {label}
          </Link>
          {!mobile && (
            <span
              className={cn(
                'block max-w-0 transition-all duration-500 h-0.5 bg-[#333333] opacity-40 group-hover:max-w-full',
                {
                  ' max-w-full': pathname === path,
                }
              )}
            ></span>
          )}
        </li>
      ))}
      <li className="lg:pr-5 py-3">
        <WalletButton />
      </li>
      <li className="lg:pr-5 py-3">
        <ClusterUiSelect />
      </li>
    </ul>
  );
}
