/** @deprecated */
export type ZodError = { errorMessage: string };

/** @deprecated */
export function isZodError(obj: any): obj is ZodError {
  return "errorMessage" in obj;
}
