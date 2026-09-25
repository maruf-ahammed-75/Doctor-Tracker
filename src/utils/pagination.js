/**
 * Helper to compute pagination options from query parameters
 * Sane defaults: page=1, limit=10, max limit=100
 * @param {Object} query - Express req.query or object with { page, limit }
 * @param {number} defaultLimit - default number of items per page (default: 10)
 * @param {number} maxLimit - maximum allowed items per page (default: 100)
 * @returns {{ skip: number, limit: number, page: number }}
 */
export const getPaginationOptions = (query = {}, defaultLimit = 10, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const parsedLimit = parseInt(query.limit, 10) || defaultLimit;
  const limit = Math.min(maxLimit, Math.max(1, parsedLimit));
  const skip = (page - 1) * limit;

  return { skip, limit, page };
};

/**
 * Helper to structure standardized paginated API response
 * @param {Array} data - List of documents
 * @param {number} total - Total count of documents matching filter
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {{ data: Array, pagination: { page: number, limit: number, total: number, totalPages: number } }}
 */
export const formatPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || (total === 0 ? 0 : 1);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export default {
  getPaginationOptions,
  formatPaginatedResponse,
};
