import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function Page() { return <><SiteHeader /><main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12"><Card><CardHeader><CardTitle>News</CardTitle></CardHeader><CardContent className="text-slate-600">DriveTest updates, Ontario rule changes, and road-safety news will appear here.</CardContent></Card></main><SiteFooter /></>; }
