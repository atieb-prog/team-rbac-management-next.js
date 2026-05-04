"use client";

import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";

export type RegisterState = {
  success?: boolean;
  error?: string;
};

const RegisterPage = () => {
  const [state, registerAction, isPending] = useActionState(
    async (
      prevState: RegisterState,
      formData: FormData,
    ): Promise<RegisterState> => {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const teamCode = formData.get("teamCode") as string;
      try {
        await apiClient.register({
          name,
          email,
          password,
          teamCode: teamCode || undefined,
        });
        window.location.href = "/dashboard";
        return { success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Registration failed",
        };
      }
    },
    { error: undefined, success: undefined },
  );

  return (
    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">
      <form action={registerAction}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Create New Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            or{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        {state?.error && (
          <div className="bg-red-900/50 border-red-700 text-red-300 px-4 py-3 rounded mb-4">
            {state.error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              required
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2.5 text-sm"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2.5 text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2.5 text-sm"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label
              htmlFor="teamCode"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Team Code (optional)
            </label>
            <input
              type="text"
              name="teamCode"
              id="teamCode"
              autoComplete="off"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2.5 text-sm"
              placeholder="Enter team code if you have one"
            />
            <p className="mt-1 text-sm text-slate-400">
              If you don't have a team code, you can leave this field blank.
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
