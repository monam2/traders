"use client";

import {
  createChart,
  ColorType,
  IChartApi,
  AreaSeries,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

interface AnalysisChartProps {
  data: { time: string; value: number }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const AnalysisChart = ({ data, colors = {} }: AnalysisChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: chartContainerRef.current!.clientWidth,
      });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: colors.backgroundColor || "transparent",
        },
        textColor: colors.textColor || "#333",
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(197, 203, 206, 0.5)" }, // soft grid
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
    });

    chartRef.current = chart;

    const newSeries = chart.addSeries(AreaSeries, {
      lineColor: colors.lineColor || "#2962FF",
      topColor: colors.areaTopColor || "#2962FF",
      bottomColor: colors.areaBottomColor || "rgba(41, 98, 255, 0.28)",
    });

    newSeries.setData(data);
    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, colors]);

  return <div ref={chartContainerRef} className="w-full h-[300px]" />;
};
