'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import {
    getCandlestickConfig,
    getChartConfig,
    LIVE_INTERVAL_BUTTONS,
    PERIOD_BUTTONS,
    PERIOD_CONFIG,
} from '@/constants';
import { CandlestickSeries, createChart, IChartApi, ISeriesApi, OhlcData } from 'lightweight-charts';
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';



const CandlestickChart = ({ children,
    data,
    coinId,
    height = 360,
    initialPeriod = 'daily',
}: CandlestickChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);


    const [period, setPeriod] = useState(initialPeriod);
    const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
    const [isPending, startTransition] = useTransition();

    const fetchOHLCData = async (selectedPeriod: Period) => {
        try {
            const config = PERIOD_CONFIG[selectedPeriod];

            const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
                vs_currency: 'usd',
                days: config.days,
            });

            setOhlcData(newData ?? []);
        } catch (error) {
            console.error('Error fetching OHLC data:', error);
        }
    }

    const handlePeriodChange = (newPeriod: Period) => {
        if (newPeriod === period) return;

        startTransition(async () => {
            setPeriod(newPeriod);
            await fetchOHLCData(newPeriod);
        });
    };

    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const showTime = ['daily', 'weekly', 'monthly'].includes(period);

        const chart = createChart(container, {
            ...getChartConfig(height, showTime),
            width: container.clientWidth,
        });
        const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

        const convertedToSeconds = ohlcData.map((item) =>
            [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData
        );
        series.setData(convertOHLCData(convertedToSeconds));
        chart.timeScale().fitContent();

        chartRef.current = chart;
        candleSeriesRef.current = series;

        const observer = new ResizeObserver((entries) => {
            if (!entries.length) return;
            chart.applyOptions({ width: entries[0].contentRect.width });
        });
        observer.observe(container);

        return () => {
            observer.disconnect();
            chart.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        }
    }, [height, period]);

    useEffect(() => {
        if (!candleSeriesRef.current) return;

        const convertedToSeconds = ohlcData.map((item) =>
            [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as
            OHLCData,
        );

        const converted = convertOHLCData(convertedToSeconds);
        candleSeriesRef.current.setData(converted);
        chartRef.current?.timeScale().fitContent();
    }, [ohlcData, period]);
    return (
        <div id='candlestickchart'>
            <div className="chart-header">
                <div className="flex-1">
                    {children}
                </div>
                <div className="button-group flex items-center bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    <span className='text-xs mx-3 font-bold text-zinc-500 uppercase tracking-widest'>Period:</span>
                    <div className="flex gap-3">
                        {PERIOD_BUTTONS.map(({ value, label }) => (
                            <button
                                key={value}
                                className={period === value ? 'rounded-sm px-2.5 py-1.5 border-0 cursor-pointer text-sm text-gray-900 bg-green-500'
                                    : 'rounded-sm border-0 cursor-pointer px-2.5 py-2 text-xs xl:text-sm text-purple-100 hover:bg-dark-400 hover:text-whitetext-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}
                                onClick={() => handlePeriodChange(value)}
                                disabled={isPending}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div ref={chartContainerRef} className='chart' style={{ height }}></div>
        </div>
    )
}

export default CandlestickChart