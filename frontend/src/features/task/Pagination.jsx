const Pagination = ({ pagination, setPagination }) => {
  const { page, totalPages } = pagination;

  const nextPage = () => {
    if (page < totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        onClick={prevPage}
        disabled={page === 1}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm font-medium text-slate-400">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={nextPage}
        disabled={page === totalPages}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
