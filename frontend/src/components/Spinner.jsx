import React from "react";

const sizeClasses = {
  4: "w-4 h-4",
  6: "w-6 h-6",
  8: "w-8 h-8",
  10: "w-10 h-10",
  12: "w-12 h-12",
  14: "w-14 h-14",
};

const colorClasses = {
  "blue-500": "border-blue-500",
  "white": "border-white",
  "gray-700": "border-gray-700"
};

const Spinner = ({ size = 10, color = "blue-500" }) => {
  const sizeClass = sizeClasses[size] || "w-10 h-10";
  const colorClass = colorClasses[color] || "border-blue-500";

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClass} border-4 ${colorClass} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
