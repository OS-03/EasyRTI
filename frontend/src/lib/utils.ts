import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = function _cn(...inputs: Array<string | undefined | null | boolean>): string {
  return twMerge(clsx(inputs));
};

export default cn;