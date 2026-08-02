"use client";

import type { LicenseStage } from "@prisma/client";
import { useActionState } from "react";

import { completeLearnerOnboarding } from "@/app/(account)/onboarding/actions";
import type { FormState } from "@/app/(auth)/actions";
import { FormMessage } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: FormState = {};
const stageOptions: Array<{ value: LicenseStage; label: string; description: string; nextStep: string }> = [
  {
    value: "G1",
    label: "G1 knowledge test",
    description: "Learn Ontario signs and rules for your learner permit.",
    nextStep: "Start with a realistic 40-question mock exam.",
  },
  {
    value: "G2",
    label: "G2 road test",
    description: "Build observation, control, and everyday road-test habits.",
    nextStep: "Start with your G2 readiness checklist and mock-drive guide.",
  },
  {
    value: "G",
    label: "Full G road test",
    description: "Prepare for advanced traffic, lane, and highway decisions.",
    nextStep: "Start with your Full G readiness checklist and highway guide.",
  },
];

export function OnboardingForm() {
  const [state, formAction] = useActionState(completeLearnerOnboarding, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <FormMessage state={state} />
      <fieldset className="space-y-3">
        <legend className="text-base font-semibold text-slate-950">Which licence are you preparing for?</legend>
        <div className="grid gap-3">
          {stageOptions.map((option) => (
            <label className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition hover:border-green-400 has-[:checked]:border-green-700 has-[:checked]:bg-green-50 has-[:checked]:ring-2 has-[:checked]:ring-green-200" key={option.value}>
              <span className="flex gap-3">
                <input className="mt-1 h-4 w-4 accent-green-800" defaultChecked={option.value === "G1"} name="currentStage" required type="radio" value={option.value} />
                <span>
                  <span className="block font-semibold text-slate-950">{option.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">{option.description}</span>
                  <span className="mt-2 block text-sm font-medium text-green-900">{option.nextStep}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="targetTestDate">When is your test?</Label>
        <Input aria-describedby="onboarding-test-date-help" id="targetTestDate" name="targetTestDate" type="date" />
        <p className="text-sm leading-6 text-slate-600" id="onboarding-test-date-help">Optional. You can add or change this later in Account settings.</p>
      </div>

      <SubmitButton pendingText="Saving your plan...">Save and start my plan</SubmitButton>
    </form>
  );
}
