import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-amber-100/30 dark:from-accent/10 dark:via-background dark:to-accent/5" />
      <form
        action={loginAction}
        className="relative flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-8 shadow-xl dark:bg-stone-900"
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Viatora</p>
          <h1 className="mt-1 text-2xl font-semibold">Admin sign in</h1>
        </div>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            Invalid email or password.
          </p>
        ) : null}
        <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/admin/dashboard"} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <Button type="submit" className="mt-2 w-full">
          Sign in
        </Button>
      </form>
    </main>
  );
}
