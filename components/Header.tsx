'use client';

import React from 'react'
import Image from 'next/image';
import  Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic'; // 1. Import dynamic

// 2. Load SearchModal secara dinamis (Hanya render di browser)
const SearchModal = dynamic(
  () => import('./SearchModal').then((mod) => mod.SearchModal),
  { 
    ssr: false,
    loading: () => (
      <div className="h-10 w-24 bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-800" />
    )
  }
);



const Header = () => {
  const pathname = usePathname();
  return (
    <header>
    <div className="main-container inner">
      <Link href="/">
        <Image
          src="/logo2.png"
          alt="CuanWatch Logo"
          width={200}
          height={40}
        />
      </Link>
      <nav>
        <Link rel="stylesheet" href="/" className={cn('nav-link',
          {'is-active' : pathname == '/',
            'is-home' : true
          } )}
          > Home </Link>

        <SearchModal initialTrendingCoins={[]} />
        <Link href="/coins" className={cn('nav-link',
          {'is-active' : pathname == '/coins',
            'is-home' : false
          } )}> All Coins </Link>

        <Link href="/whale-watch" className={cn('nav-link',
          {'is-active' : pathname == '/whale-watch',
            'is-home' : false
          } )}> Whale Watch </Link>
      </nav>
    </div>
    </header>

  )
}

export default Header