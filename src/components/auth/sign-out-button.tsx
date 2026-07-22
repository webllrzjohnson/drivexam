import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

type SignOutButtonProps = {
  compact?: boolean;
};

export function SignOutButton({ compact = false }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <Button size={compact ? "sm" : "default"} type="submit" variant="outline">Sign out</Button>
    </form>
  );
}
