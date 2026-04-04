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
    <div className="flex justify-center items-center gap-4 mt-4">
      <button
        onClick={prevPage}
        disabled={page === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        onClick={nextPage}
        disabled={page === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
