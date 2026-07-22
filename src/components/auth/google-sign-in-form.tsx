import { signInWithGoogle } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

type GoogleSignInFormProps = {
  callbackUrl?: string;
};

export function GoogleSignInForm({ callbackUrl = "" }: GoogleSignInFormProps) {
  return (
    <form action={signInWithGoogle}>
      <input name="callbackUrl" type="hidden" value={callbackUrl} />
      <Button className="w-full" type="submit" variant="outline">Continue with Google</Button>
    </form>
  );
}
