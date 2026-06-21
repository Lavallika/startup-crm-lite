import React from 'react';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="h-7 md:h-9 bg-gray-200 dark:bg-gray-700 rounded w-40 md:w-56 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-52 md:w-72" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full sm:w-64" />
      </div>

      {/* KPI Cards — matches StatsCards responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex justify-between mb-3">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Charts — 2 placeholder rows */}
      {[...Array(2)].map((_, row) => (
        <div key={row} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-64 md:h-80 lg:h-96 flex flex-col gap-4"
            >
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40" />
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
