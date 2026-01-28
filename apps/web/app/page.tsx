import { Button } from "@feedback/ui/components/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Feedback</h1>
          <p className="text-muted-foreground text-lg">
            Collect, organize, and manage feedback through workspaces and
            projects
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
