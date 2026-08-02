import { toggleRoadTestChecklistProgress } from "@/app/(public)/road-test/actions";
import { Button } from "@/components/ui/button";

type RoadTestChecklistProgressFormProps = {
  itemId: string;
  itemTitle: string;
  stage: "G2" | "G";
  isCompleted: boolean;
  canSaveProgress: boolean;
};

export function RoadTestChecklistProgressForm({ canSaveProgress, isCompleted, itemId, itemTitle, stage }: RoadTestChecklistProgressFormProps) {
  if (!canSaveProgress) {
    return null;
  }

  return (
    <form action={toggleRoadTestChecklistProgress} className="scroll-mt-24 outline-none" id={`checklist-item-${itemId}`} tabIndex={-1}>
      <input name="itemId" type="hidden" value={itemId} />
      <input name="stage" type="hidden" value={stage} />
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm">
        <input defaultChecked={isCompleted} name="completed" type="checkbox" />
        {isCompleted ? "Completed" : "Mark complete"}
      </label>
      <Button className="ml-2" size="sm" type="submit" variant={isCompleted ? "outline" : "default"}>Save <span className="sr-only">{itemTitle}</span></Button>
    </form>
  );
}
