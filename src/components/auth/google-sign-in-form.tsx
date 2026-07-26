import { signInWithGoogle } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

type GoogleSignInFormProps = {
  callbackUrl?: string;
  enabled?: boolean;
};

export function GoogleSignInForm({ callbackUrl = "", enabled = true }: GoogleSignInFormProps) {
  return (
    <div className="space-y-2">
      <form action={signInWithGoogle}>
        <input name="callbackUrl" type="hidden" value={callbackUrl} />
        <Button className="w-full" disabled={!enabled} type="submit" variant="outline">Continue with Google</Button>
      </form>
      {!enabled ? <p className="text-center text-xs text-slate-500">Google sign-in is not configured yet.</p> : null}
    </div>
  );
}
