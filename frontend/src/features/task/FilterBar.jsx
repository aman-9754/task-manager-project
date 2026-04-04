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
    <div className="flex gap-4 mb-4 items-center">
      {/* Status Filter */}
      <select
        name="status"
        value={filters.status || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Priority Filter */}
      <select
        name="priority"
        value={filters.priority || ""}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 cursor-pointer"
      >
        Clear
      </button>
    </div>
  );
};

export default FilterBar;
