import Link from "next/link";

import { toggleRoadTestChecklistProgress } from "@/app/(public)/road-test/actions";
import { Button } from "@/components/ui/button";

type RoadTestChecklistProgressFormProps = {
  itemId: string;
  stage: "G2" | "G";
  isCompleted: boolean;
  canSaveProgress: boolean;
};

export function RoadTestChecklistProgressForm({ canSaveProgress, isCompleted, itemId, stage }: RoadTestChecklistProgressFormProps) {
  if (!canSaveProgress) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in to save checklist progress</Link>
      </Button>
    );
  }

  return (
    <form action={toggleRoadTestChecklistProgress}>
      <input name="itemId" type="hidden" value={itemId} />
      <input name="stage" type="hidden" value={stage} />
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm">
        <input defaultChecked={isCompleted} name="completed" type="checkbox" />
        {isCompleted ? "Completed" : "Mark complete"}
      </label>
      <Button className="ml-2" size="sm" type="submit" variant={isCompleted ? "outline" : "default"}>Save</Button>
    </form>
  );
}
