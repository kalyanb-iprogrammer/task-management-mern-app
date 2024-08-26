import { Doughnut } from "react-chartjs-2";
import { Legend, Tooltip, ArcElement, Chart as ChartJS,  } from 'chart.js';

type Props = {
    title: string;
    chartData: {
        labels: [string],
        data: [number]
    }
};

ChartJS.register(ArcElement, Legend, Tooltip );

export function CurrentTask({ title, chartData }: Props) {
    
    const data = {
        labels: chartData?.labels ? chartData?.labels : [
            "To Do",
            "Completed",
            "In Review",
            "In Progress"
        ],
        datasets: [
            {
                label: 'Count',
                data: chartData?.data ? chartData?.data : [0,0,0,0],
                backgroundColor: [
                    'rgba(128, 128, 128, 0.8)',
                    'rgba(255, 165, 0, 0.8)',
                    'rgba(0, 123, 255, 0.8)',
                    'rgba(34, 139, 34, 0.8)',
                ],
                borderColor: [
                    'rgba(128, 128, 128, 0.5)',
                    'rgba(255, 140, 0, 0.5)',
                    'rgba(0, 104, 204, 0.5)',
                    'rgba(28, 119, 28, 0.5)',
                ],
                borderWidth: 1,
            }
        ]
    }
    return (
        <div className="bg-white rounded-lg p-2 flex items-center justify-center flex-col">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <div>
          {chartData && (
            <div className="w-full">
                <Doughnut data={data}/>
            </div>
          )}
        </div>
      </div>
    );
}