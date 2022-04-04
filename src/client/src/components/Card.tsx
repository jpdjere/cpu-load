import { FC } from "react";

type CardProps = {
  title: string;
  description: string;
  value: string | number;
  color?: string;
};

const COLORS = {
  default: "text-indigo-500",
  alert: "text-red-500",
  success: "text-green-500",
} as Record<string, string>;

export const Card: FC<CardProps> = ({
  title,
  description,
  value,
  color = "default",
}) => {
  return (
    <div className="shadow-lg flex flex-col justify-around rounded-2xl p-6 mr-3 mb-3 bg-white relative min-h-[50%] overflow-hidden w-full md:w-64">
      <p className="text-gray-800 text-lg font-medium mb-2">{title}</p>
      <p className="text-gray-400 text-xs">{description}</p>
      <p className={`${COLORS[color]} text-xl font-medium`}>{value}</p>
    </div>
  );
};
