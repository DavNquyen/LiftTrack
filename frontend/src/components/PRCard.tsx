import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface PRCardProps {
  exercise: string;
  data: {
    max1RM: number;
    weight: number;
    reps: number;
    date: string;
  };
}

const PRCard: React.FC<PRCardProps> = ({ exercise, data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{exercise}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {data.weight} lbs × {data.reps} reps
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Est. 1RM: {data.max1RM} lbs
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(data.date).toLocaleDateString()}
          </p>
        </div>
        <TrophyIcon className="h-5 w-5 text-yellow-500" />
      </div>
    </div>
  );
};

export default PRCard;