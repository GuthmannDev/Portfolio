import { Button } from "@/components/ui/button";
import { LuFingerprint } from "react-icons/lu";
import { useAuth } from "@/hooks/use-auth";

export function GitHubAuthButton() {
  const { signInWithGithub } = useAuth();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={signInWithGithub}
      className="rounded-full hover:bg-muted transition-colors"
      aria-label="Sign in with GitHub"
    >
      <LuFingerprint className="h-5 w-5" aria-hidden="true" />
    </Button>
  );
}
