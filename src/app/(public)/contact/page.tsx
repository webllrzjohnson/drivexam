import Link from "next/link";

import { auth } from "@/auth";
import { submitContactForm } from "@/app/(public)/contact/actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ContactPageProps = {
  searchParams: Promise<{ submitted?: string }>;
};

export default async function Page({ searchParams }: ContactPageProps) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const isVerified = Boolean(session?.user?.emailVerified);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-12">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-800">Support</p>
          <h1 className="text-3xl font-bold text-slate-950">Contact drivexam</h1>
          <p className="text-slate-600">Send a text-only support message about your account, study progress, question content, or roadmap feedback.</p>
        </div>

        {params.submitted === "contact" ? (
          <Alert className="border-green-200 bg-green-50 text-green-950">
            <AlertTitle>Message sent.</AlertTitle>
            <AlertDescription>Thanks — an admin can now review your contact submission.</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
          </CardHeader>
          <CardContent>
            {isVerified ? (
              <form action={submitContactForm} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" maxLength={120} name="subject" placeholder="Question about my G1 progress" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    className="min-h-40 w-full rounded-lg border border-border bg-white px-3 py-2 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-green-700 md:text-sm"
                    id="message"
                    maxLength={3000}
                    name="message"
                    placeholder="Tell us what you need help with. Please do not include passwords or sensitive documents."
                    required
                  />
                </div>
                <Button type="submit">Submit message</Button>
              </form>
            ) : (
              <div className="space-y-4 text-sm text-slate-700">
                <p>Contact submissions are available to signed-in learners with a verified email address so admins can follow up safely.</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild><Link href="/sign-in?callbackUrl=/contact">Sign in</Link></Button>
                  <Button asChild variant="outline"><Link href="/sign-up">Create account</Link></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}
