export async function getFearGreedIndex(): Promise<FearGreedResponse | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) throw new Error('Failed to fetch Fear & Greed Index');
    return res.json();
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return null;
  }
}
