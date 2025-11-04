import { useDateFormat } from "@vueuse/core";

export const useToDate = (time?: string | Date | unknown) => {
  if (typeof time !== "string" && typeof time !== "object") return "";
  return useDateFormat(time, "DD MMMM YYYY");
};
