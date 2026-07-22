import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const cards = ["Daily goal", "Readiness score", "Weak areas", "Next action", "Study streak", "Achievements"];
export function DashboardShell() { return <div className="grid gap-4 md:grid-cols-3">{cards.map((card) => <Card key={card}><CardHeader><CardTitle className="text-lg">{card}</CardTitle></CardHeader><CardContent className="text-sm text-slate-600">Coming in Phase 4.</CardContent></Card>)}</div>; }
