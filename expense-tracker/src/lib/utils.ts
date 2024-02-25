import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {toast as _toast} from "react-toastify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toast(): typeof _toast {
  return _toast
}
