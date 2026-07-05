const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  // clear all filters
  const clearFilters = () => {
    onFilterChange("clear");
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
      {/* Status Filter */}
      <select
        name="status"
        value={filters.status || ""}
        onChange={handleChange}
        className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
      >
        <option value="">All status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority Filter */}
      <select
        name="priority"
        value={filters.priority || ""}
        onChange={handleChange}
        className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400"
      >
        <option value="">All priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
      >
        Clear
      </button>
    </div>
  );
};

export default FilterBar;
