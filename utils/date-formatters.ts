export const formatReleaseDate = (date: string) => {
  if (!date) return false;
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};
