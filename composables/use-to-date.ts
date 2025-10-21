import { useDateFormat } from "@vueuse/core";

export const useToDate = (time: string) => {
  if (!time) return "";
  return useDateFormat(time, "DD MMMM YYYY");
};
