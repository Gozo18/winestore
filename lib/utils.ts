import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma objedct to js object
export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".")
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Handle zod errors
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    )

    return fieldErrors.join(" ")
  } else if ((error.name = "PrismaClientKnownRequestError")) {
    // Handle prisma errors
    const field = error.meta?.target ? error.meta.target[0] : "Field"
    return `${field.charAt(0).toUpperCase() + field.slice(1)} už existuje.`
  } else {
    // Handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message)
  }
}
