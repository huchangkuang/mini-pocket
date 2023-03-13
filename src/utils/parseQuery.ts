export const parseQuery = (query: string): Record<string, any> => {
  const newQuery = query.startsWith("?") ? query.slice(1) : query;
  return Object.fromEntries(newQuery.split("&").map((i) => i.split("=")));
};
