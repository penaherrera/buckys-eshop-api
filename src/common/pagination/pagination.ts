export const calculatePagination = (page: number, perPage: number) => ({
  skip: (page - 1) * perPage,
  take: perPage,
});

export const paginationMetadata = (
  page: number,
  perPage: number,
  total: number,
) => ({
  perPage,
  total,
  page,
  totalPages: Math.ceil(total / perPage),
  prevPage: page > 1 ? page - 1 : null,
  nextPage: page < Math.ceil(total / perPage) ? page + 1 : null,
});
