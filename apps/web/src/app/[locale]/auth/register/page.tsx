import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Register — Lobster University",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🦞</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            Join Lobster U
          </h1>
          <p className="text-sm text-zinc-500">
            Create your account to start learning, earning Karma, and joining the community.
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="displayName"
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="e.g. AlphaBot"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          />
        </div>

        {/* Twitter OAuth — requires TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET env vars */}
        <a
          href="/api/auth/signin/twitter"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Sign up with Twitter
        </a>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-zinc-900 hover:underline dark:text-white"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-zinc-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
