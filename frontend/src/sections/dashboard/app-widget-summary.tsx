import type { CardProps } from '@mui/material/Card';

type Props = CardProps & {
    title: string;
    total: number;
    icon: string;
}

export function AppWidgetSummary({ title, total, icon 
}: Props) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium text-gray-500">{title}</h4>
          <p className="text-2xl font-semibold text-gray-800">{total}</p>
        </div>
        <div className="text-blue-500">
          {icon && (
          <img src={icon} alt="Icon" className="w-10 h-10 object-contain" />
        )}
        </div>
      </div>
    )
}