'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );


  const response = await fetch(url, {
    headers: {
      'x-cg-demo-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
  }

  return response.json();
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  try {
    if (network && contractAddress) {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`
      );
      return poolData.data?.[0] ?? fallback;
    }
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id }
    );
    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}
// Pastikan nama fungsinya sama dengan yang di-import di SearchModal.tsx tutorial itu
export async function searchCoins(query: string) {
  if (!query) return [];

  try {
    // FETCH 1: Cari ID koin (ini nggak ada data harga/persen)
    const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
    const searchData = await searchRes.json();
    
    if (!searchData.coins || searchData.coins.length === 0) return [];

    // EXTRACTION: Ambil 10 ID saja biar nggak lemot
    const top10Ids = searchData.coins.slice(0, 10).map((c: any) => c.id).join(',');

    // FETCH 2: Ambil data market (ini baru ada data persennya)
    const marketRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${top10Ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );
    const marketData = await marketRes.json();

    // MERGE: Satukan datanya
    return searchData.coins.slice(0, 10).map((coin: any) => {
      const marketInfo = marketData.find((m: any) => m.id === coin.id);
      return {
        ...coin,
        // Pastikan mapping nama propertinya benar sesuai yang dipanggil di SearchItem
        data: {
          price_change_percentage_24h: marketInfo?.price_change_percentage_24h_in_currency || marketInfo?.price_change_percentage_24h || 0
        }
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}