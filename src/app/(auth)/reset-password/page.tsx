import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function Page() { return <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12"><Card className="w-full"><CardHeader><CardTitle>Reset password</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-slate-600"><p>Secure password reset form foundation.</p><Button asChild variant="outline"><Link href="/">Back home</Link></Button></CardContent></Card></main>; }
