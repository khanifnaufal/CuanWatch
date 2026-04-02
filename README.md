# CuanWatch 📉🚀

**CuanWatch** is a professional-grade cryptocurrency dashboard and portfolio simulator. It provides real-time market data, institutional treasury monitoring, and sentiment analysis to help traders make informed decisions.

![CuanWatch Dashboard Preview](https://github.com/khanifnaufal/CuanWatch/blob/main/public/preview.png?raw=true)

## 🌟 Key Features

### 1. **Live Market Overview**
- Track thousands of cryptocurrencies with real-time prices and 24h charts.
- Discover trending coins and categories.
- Advanced candlestick charts (Lightweight Charts) for technical analysis.

### 2. **Whale Watch (Public Treasury)**
- Monitor Bitcoin and Ethereum holdings of public companies like MicroStrategy, Tesla, and Block Inc.
- Analyze institutional adoption and market cap dominance.

### 3. **Market Insights**
- **Crypto Fear & Greed Index**: A custom gauge chart visualizing market sentiment.
- **Global Market Dominance**: Donut charts showing BTC, ETH, and altcoin market dominance based on CoinGecko global data.

### 4. **Portfolio Simulator**
- Track your "bags" with real-time Profit/Loss (P&L) calculations.
- Integrated **Search & Add** workflow using the existing market search logic.
- Data privacy guaranteed: All portfolio data is stored locally in your browser's **Local Storage**—no account or database required.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Charts**: [Recharts](https://recharts.org), [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- **State/Fetching**: [SWR](https://swr.vercel.app), [react-use](https://github.com/streamich/react-use)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- [CoinGecko API Key](https://www.coingecko.com/en/developers/dashboard) (Demo Tier works fine)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/khanifnaufal/CuanWatch.git
    cd CuanWatch
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
    COINGECKO_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open in browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

**CuanWatch** — *Monitor your bags, master the market.* 🌊💰
