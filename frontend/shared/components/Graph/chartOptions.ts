import { ChartOptions } from 'chart.js';


// Im sure you can guess off the name
export const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(99, 102, 241, 0.5)',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label(context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';

          const value = context.parsed.y;
          if (value != null) {
            return value >= 1000
              ? `${label}${(value / 1000).toFixed(1)}K`
              : `${label}${value}`;
          }
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(64, 64, 64, 0.5)',
        drawTicks: false,
      },
      ticks: {
        color: 'rgba(253, 253, 253, 0.5)',
        font: { size: 11 },
        maxRotation: 0,
        autoSkip: true,
        autoSkipPadding: 20,
      },
      border: { display: false },
    },
    y: {
      grid: {
        color: 'rgba(64, 64, 64, 0.5)',
        drawTicks: false,
      },
      ticks: {
        color: 'rgba(253, 253, 253, 0.5)',
        font: { size: 11 },
        callback(value) {
          const num = typeof value === 'number' ? value : 0;
          return num >= 1000 ? `${(num / 1000).toFixed(0)}K` : num.toString();
        },
      },
      border: { display: false },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
};
