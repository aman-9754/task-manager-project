const Analytics = ({ analytics }) => {
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
  if (!analytics)
    return (
      <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5 text-sm text-slate-300 shadow-xl shadow-slate-950/20">
        Loading analytics...
      </div>
    );

  return (
    <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-slate-100 shadow-xl shadow-slate-950/20">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Overview
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">Analytics</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-center shadow-lg shadow-sky-950/10">
          <p className="text-sm font-medium text-sky-200">Total tasks</p>
          <h2 className="mt-2 text-3xl font-black text-white">{analytics.totalTasks}</h2>
          <p className="mt-1 text-xs text-sky-200/70">All visible tasks</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center shadow-lg shadow-emerald-950/10">
          <p className="text-sm font-medium text-emerald-200">Completion rate</p>
          <h2 className="mt-2 text-3xl font-black text-white">{analytics.completionRate}%</h2>
          <p className="mt-1 text-xs text-emerald-200/70">Healthy progress signal</p>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-center shadow-lg shadow-rose-950/10">
          <p className="text-sm font-medium text-rose-200">Overdue</p>
          <h2 className="mt-2 text-3xl font-black text-white">{analytics.overdueTasks}</h2>
          <p className="mt-1 text-xs text-rose-200/70">Needs attention</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            Status
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-500/20">
              Completed: {analytics.statusCounts.completed}
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10">
              Pending: {analytics.statusCounts.pending}
            </span>
            <span className="rounded-full bg-sky-500/15 px-4 py-2 text-sm font-semibold text-sky-200 ring-1 ring-sky-500/20">
              In progress: {analytics.statusCounts.inProgress}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            Priority
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 ring-1 ring-rose-500/20">
              High: {analytics.priorityCounts.high}
            </span>
            <span className="rounded-full bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-200 ring-1 ring-amber-500/20">
              Medium: {analytics.priorityCounts.medium}
            </span>
            <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-500/20">
              Low: {analytics.priorityCounts.low}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
