import { useEffect, useState } from "react";


const Analytics = ({analytics}) => {
//   const [analytics, setAnalytics] = useState(null);

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const res = await getTaskAnalytics();
//         console.log(res.data.data);
//         setAnalytics(res.data.data);
//       } catch (error) {
//         console.error("Analtics Error :", error);
//       }
//     };

//     fetchAnalytics();
//   }, []);

  // loading state
  if (!analytics) return <p className="mb-4">Loading Analytics...</p>;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      {/* Top Stats */}
      <h1 className="text-xl mb-4 font-semibold">Analytical Result</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-100 p-3 rounded text-center">
          <p className="text-sm">Total Tasks</p>
          <h2 className="text-xl font-bold">{analytics.totalTasks}</h2>
        </div>

        <div className="bg-green-100 p-3 rounded text-center">
          <p className="text-sm">Completion % </p>
          <h2 className="text-xl font-bold">{analytics.completionRate}%</h2>
        </div>

        <div className="bg-red-100 p-3 rounded text-center">
          <p className="text-sm">Overdue</p>
          <h2 className="text-xl font-bold">{analytics.overdueTasks}</h2>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Status</h3>
        <div className="flex gap-6">
          <span>Completed: {analytics.statusCounts.completed}</span>
          <span>Pending: {analytics.statusCounts.pending}</span>
          <span>In Progress: {analytics.statusCounts.inProgress}</span>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div>
        <h3 className="font-semibold mb-1">Priority</h3>
        <div className="flex gap-6">
          <span className="text-red-500">
            High : {analytics.priorityCounts.high}
          </span>
          <span className="text-yellow-500">
            Medium : {analytics.priorityCounts.medium}
          </span>
          <span className="text-green-500">
            Low : {analytics.priorityCounts.low}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
