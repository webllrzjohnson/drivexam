import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { FormState } from "@/app/(auth)/actions";

type FormMessageProps = { state: FormState };

export function FormMessage({ state }: FormMessageProps) {
  if (!state.error && !state.success) return null;
  return (
    <Alert>
      <AlertTitle>{state.error ? "Something went wrong" : "Success"}</AlertTitle>
      <AlertDescription>{state.error ?? state.success}</AlertDescription>
    </Alert>
  );
}
