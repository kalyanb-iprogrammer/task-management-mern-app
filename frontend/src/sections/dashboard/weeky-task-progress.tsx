import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

type Props = {
    title?: string;
    chartData: {
        toDo: [number];
        inProgress: [number]
        inReview: [number]
        completed: [number]
    }
}

export function WeeklyTaskProgress({ title, chartData }: Props) {

    console.log('chart data', chartData);

    const data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'To Do',
                data: chartData?.toDo ? chartData?.toDo : [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255, 166, 0, 1)',
                borderWidth: 1,
            },
            {
                label: 'In Progress',
                data: chartData?.inProgress ? chartData?.inProgress : [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(239, 86, 117, 1)',
                borderWidth: 1,
            },
            {
                label: 'In Review',
                data: chartData?.inReview ? chartData?.inReview : [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 63, 92, 1)',
                borderWidth: 1,
            },
            {
                label: 'Completed',
                data: chartData?.completed ? chartData?.completed : [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(122, 81, 149, 1)',
                borderWidth: 1,
            },
        ],
    }
    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    }
    return (

        <div className="bg-white rounded-lg p-0 flex items-center flex-col">
            <h4 className="mt-0 text-sm font-medium text-gray-500">{title}</h4>
            <div className="w-full">
                <Bar data={data} options={options} />
            </div>
        </div>
    );

}