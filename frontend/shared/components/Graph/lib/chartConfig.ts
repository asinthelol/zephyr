import { GraphDataPoint } from '@/shared/components/types';

// Builds the chart data structure based on the provided graph data and label
export const createChartData = (
  label: string,
  graphData: GraphDataPoint[]
) => {
  const labels = graphData.map(point => point.timestamp);
  const values = graphData.map(point => point.value);

  return {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: 'rgb(99, 102, 241)', // Color for line
        backgroundColor: 'rgba(99, 102, 241, 0.1)', // Color for fill under line
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(99, 102, 241)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };
};