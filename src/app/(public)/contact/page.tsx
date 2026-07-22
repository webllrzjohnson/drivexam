import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function Page() { return <><SiteHeader /><main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12"><Card><CardHeader><CardTitle>Contact</CardTitle></CardHeader><CardContent className="text-slate-600">Verified registered users will be able to submit a text-only contact form here.</CardContent></Card></main><SiteFooter /></>; }
