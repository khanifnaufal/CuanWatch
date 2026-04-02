'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { searchCoins } from '@/lib/coingecko.actions';
import { Search as SearchIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { cn, formatPercentage } from '@/lib/utils';
import useSWR from 'swr';
import { useDebounce, useKey } from 'react-use';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const TRENDING_LIMIT = 8;
const SEARCH_LIMIT = 10;

const SearchItem = ({ coin, onSelect, isActiveName }: SearchItemProps) => {
  // Gunakan optional chaining (?.) untuk mencegah crash jika data tidak ada
  const isSearchCoin = typeof coin?.data?.price_change_percentage_24h === 'number';

  // Pastikan kita cek semua level objek sebelum mengakses nilainya
  const change = isSearchCoin
    ? (coin as SearchCoin).data?.price_change_percentage_24h ?? 0
    : (coin as TrendingCoin['item']).data?.price_change_percentage_24h?.usd ?? 0;

return (
  <CommandItem
    value={coin.id}
    onSelect={() => onSelect(coin.id)}
    // Tambahkan utility class tailwind untuk spacing & gap
    className='flex items-center justify-between p-3 mb-2 rounded-xl cursor-pointer hover:bg-zinc-900 transition-all'
  >
    <div className='flex items-center gap-4'>
      <div className="relative w-10 h-10">
        <Image 
          src={coin.thumb} 
          alt={coin.name} 
          fill 
          className="rounded-full object-cover" 
        />
      </div>

      <div className="flex flex-col">
        <p className={cn('font-bold text-sm', isActiveName && 'text-white')}>
          {coin.name}
        </p>
        <p className='text-xs text-zinc-500 uppercase'>{coin.symbol}</p>
      </div>
    </div>

    {/* Sisi Kanan: Persentase */}
    <div className={cn('flex items-center gap-1 text-sm font-medium', {
        'text-green-500': change > 0,
        'text-red-500': change < 0,
      })}
    >
      {change !== 0 && (change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />)}
      <span>{formatPercentage(Math.abs(change))}</span>
    </div>
  </CommandItem>
);
};

export const SearchModal = ({
  initialTrendingCoins = [],
  onSelect,
  trigger,
}: {
  initialTrendingCoins?: TrendingCoin[];
  onSelect?: (coinId: string) => void;
  trigger?: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useDebounce(
    () => {
      setDebouncedQuery(searchQuery.trim());
    },
    500,
    [searchQuery]
  );

const { data: searchResults = [], isValidating: isSearching } = useSWR<SearchCoin[]>(
  debouncedQuery ? ['coin-search', debouncedQuery] : null,
  ([, query]) => searchCoins(query as string),
  {
    revalidateOnFocus: false,      
    revalidateOnReconnect: false,  
    dedupingInterval: 60000,       
    shouldRetryOnError: false,    
  }
);

  useKey(
    (event) =>
      event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey),
    (event) => {
      event.preventDefault();
      setOpen((prev) => !prev);
    },
    {},
    [setOpen]
  );

  const handleSelect = (coinId: string) => {
    setOpen(false);
    setSearchQuery('');
    setDebouncedQuery('');
    if (onSelect) {
      onSelect(coinId);
    } else {
      router.push(`/coins/${coinId}`);
    }
  };

  const hasQuery = debouncedQuery.length > 0;
  const trendingCoins = initialTrendingCoins.slice(0, TRENDING_LIMIT);
  const showTrending = !hasQuery && trendingCoins.length > 0;

  const isSearchEmpty = !isSearching && !hasQuery && !showTrending;
  const isTrendingListVisible = !isSearching && showTrending;

  const isNoResults = !isSearching && hasQuery && searchResults.length === 0;
  const isResultsVisible = !isSearching && hasQuery && searchResults.length > 0;

  return (
    <div id='search-modal'>
      {trigger ? (
        <div 
          onClick={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true); }}
          role="button"
          tabIndex={0}
        >
          {trigger}
        </div>
      ) : (
        <Button variant='ghost' onClick={() => setOpen(true)} className='trigger'>
          <SearchIcon size={18} /> Search
          <kbd className='kbd'>ctrl + k</kbd>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden border-none bg-transparent shadow-none max-w-2xl">
          {/* 🔥 KUNCINYA: Bungkus langsung dengan Command di sini 🔥 */}
          <Command className="rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <CommandInput
              placeholder='Search for a token...'
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-12 border-none focus:ring-0"
            />
            <CommandList className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {/* Masukkan isi list kamu di sini (isSearching, results, dll) */}
              {isResultsVisible && (
                <CommandGroup heading="Results">
                  {searchResults.map(coin => (
                    <SearchItem key={coin.id} coin={coin} onSelect={handleSelect} isActiveName={false} />
                  ))}
                </CommandGroup>
              )}
              {isNoResults && <CommandEmpty>No results found.</CommandEmpty>}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
};