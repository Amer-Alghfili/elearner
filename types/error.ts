export type ZodError = { errorMessage: string };

export function isZodError(obj: any): obj is ZodError {
  return "errorMessage" in obj;
}
