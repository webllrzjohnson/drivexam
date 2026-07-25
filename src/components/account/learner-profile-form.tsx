"use client";

import type { LicenseStage } from "@prisma/client";
import { useActionState } from "react";

import { updateLearnerProfile } from "@/app/(account)/account/actions";
import type { FormState } from "@/app/(auth)/actions";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: FormState = {};

const stageOptions: Array<{ value: LicenseStage; label: string; description: string }> = [
  { value: "G1", label: "G1 knowledge test", description: "Written knowledge practice for your learner permit." },
  { value: "G2", label: "G2 road test", description: "Road-test readiness after G1 practice." },
  { value: "G", label: "Full G road test", description: "Advanced road-test preparation." },
];

type LearnerProfileFormProps = {
  currentStage: LicenseStage | null;
  targetTestDate: string;
};

export function LearnerProfileForm({ currentStage, targetTestDate }: LearnerProfileFormProps) {
  const [state, formAction] = useActionState(updateLearnerProfile, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage state={state} />

      <div className="space-y-3">
        <Label>Current licence goal</Label>
        <div className="grid gap-3">
          {stageOptions.map((option) => (
            <label className="flex cursor-pointer gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:border-green-300" key={option.value}>
              <input
                className="mt-1 h-4 w-4 accent-green-800"
                defaultChecked={(currentStage ?? "G1") === option.value}
                name="currentStage"
                required
                type="radio"
                value={option.value}
              />
              <span>
                <span className="block font-semibold text-slate-950">{option.label}</span>
                <span className="block text-sm leading-6 text-slate-600">{option.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetTestDate">Target test date</Label>
        <Input id="targetTestDate" name="targetTestDate" type="date" defaultValue={targetTestDate} />
        <p className="text-sm leading-6 text-slate-600">Optional. This helps drivexam decide if your dashboard plan should be steady or urgent.</p>
      </div>

      <SubmitButton pendingText="Saving profile...">Save learner profile</SubmitButton>
    </form>
  );
}
