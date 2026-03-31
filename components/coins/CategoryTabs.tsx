import { fetcher } from '@/lib/coingecko.actions';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  currentCategory?: string;
}

const CategoryTabs = async ({ currentCategory }: CategoryTabsProps) => {
  let categories: { category_id: string; name: string }[] = [];
  try {
    categories = await fetcher<{ category_id: string; name: string }[]>('/coins/categories/list', {}, 3600);
  } catch (error) {
    console.error('Error fetching categories list:', error);
  }

  // Prepend "All Coins" at the beginning
  const allTabs = [
    { category_id: '', name: 'All Coins' },
    ...categories,
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex w-full items-center gap-3 overflow-x-auto pb-4 pt-2 custom-scrollbar">
        {allTabs.map((cat) => {
          const isActive = currentCategory
            ? currentCategory === cat.category_id
            : cat.category_id === '';

          // If it's empty, clicking it removes the category query completely
          const href = cat.category_id ? `/coins?category=${cat.category_id}` : '/coins';

          return (
            <Link
              key={cat.category_id || 'all-coins'}
              href={href}
              className={cn(
                'whitespace-nowrap px-5 py-2 text-sm font-medium rounded-full transition-all border',
                isActive
                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
              )}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
