"use server";

import { signIn, signup } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function authenticateSignup(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signup(formData);
    await signIn("credentials", {
      redirect: false,
      ...{ email: formData.get("email"), password: formData.get("password") },
    });

    return "success";
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return "Invalid credentials.";
      }
    } else if (error instanceof Error && error.message != null) {
      return error.message;
    } else {
      return "Something went wrong";
    }
  }
}
