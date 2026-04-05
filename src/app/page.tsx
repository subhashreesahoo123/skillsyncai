'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';
import { ArrowRight, CheckCircle, Clock, FileText, TrendingDown, XCircle, BrainCircuit, ClipboardPaste, FileDown, UploadCloud, Loader2 } from 'lucide-react';
import { LandingNav } from '@/components/landing-nav';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isUserLoading && user) {
  //     router.replace('/dashboard');
  //   }
  // }, [user, isUserLoading, router]);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image-1');

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <LandingNav />

      <main className="flex-grow">
        <section className="relative container mx-auto flex flex-col items-center px-4 pt-24 pb-20 text-center sm:px-6 lg:px-8">
           <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="glow-effect top-[-20%] left-[-10%] h-3/5 w-3/5 bg-primary/30" />
              <div className="glow-effect bottom-[-20%] right-[-10%] h-3/5 w-3/5 bg-primary/30" />
            </div>

          <h1 className="font-headline text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Land Your Dream Job
            </span>
            <br />
            with an AI-Perfected Resume
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            SkillSync AI analyzes your resume and the job description to craft a perfectly tailored application, optimized to beat ATS and impress recruiters.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="text-lg font-semibold">
              <Link href="/signup">
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-lg font-semibold">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Our powerful features are designed to give you a competitive edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-primary mb-4"/>
                  <h3 className="text-xl font-bold mb-2">AI-Powered Tailoring</h3>
                  <p className="text-muted-foreground">Generate resumes that are perfectly aligned with the job description.</p>
              </div>
              <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-primary mb-4"/>
                  <h3 className="text-xl font-bold mb-2">ATS Optimization</h3>
                  <p className="text-muted-foreground">Maximize your chances of passing through automated screening systems.</p>
              </div>
              <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-primary mb-4"/>
                  <h3 className="text-xl font-bold mb-2">Keyword Analysis</h3>
                  <p className="text-muted-foreground">Identify and include the most important keywords for each job application.</p>
              </div>
          </div>
        </section>

        <section id="problem" className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
            <p className="font-semibold text-primary uppercase tracking-wider">THE PROBLEM</p>
            <h2 className="font-headline text-4xl font-bold tracking-tight mt-2">Why Your Resume Gets Ignored</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              The modern job market is brutal. Here are the hurdles stopping qualified candidates like you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-xl border border-border/20 bg-card/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-primary/20 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Generic Resumes</h3>
              <p className="text-muted-foreground">One-size-fits-all resumes fail to match specific job requirements and get ignored by ATS systems.</p>
            </div>

            <div className="rounded-xl border border-border/20 bg-card/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-primary/20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Time-Consuming</h3>
              <p className="text-muted-foreground">Manually tailoring resumes for each application takes hours of repetitive, mind-numbing effort.</p>
            </div>

            <div className="rounded-xl border border-border/20 bg-card/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-primary/20 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <XCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Keyword Mismatch</h3>
              <p className="text-muted-foreground">Candidates miss critical keywords, causing automated rejection before a human ever sees their application.</p>
            </div>

            <div className="rounded-xl border border-border/20 bg-card/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-primary/20 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Low Callback Rate</h3>
              <p className="text-muted-foreground">75% of resumes are rejected by ATS filters, drastically reducing your chances for an interview.</p>
            </div>
          </div>
        </section>

        <section id="solution" className="bg-background/70 py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="font-semibold text-primary uppercase tracking-wider">OUR SOLUTION</p>
              <h2 className="font-headline text-4xl font-bold tracking-tight mt-2">How It Works in 4 Simple Steps</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Transform your generic resume into a job-winning application with our AI-powered process.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-8 hidden h-0.5 w-full bg-border/30 md:block" aria-hidden="true" />
              <div className="absolute left-8 top-0 h-full w-0.5 bg-border/30 md:hidden" aria-hidden="true" />
              
              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16">
                
                <div className="group relative flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 ring-2 ring-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-600/30">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">1. Upload Resume</h3>
                  <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX format</p>
                </div>

                <div className="group relative flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary ring-2 ring-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                    <ClipboardPaste className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">2. Paste Job Description</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Any JD format</p>
                </div>

                <div className="group relative flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 ring-2 ring-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/30">
                    <BrainCircuit className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">3. LLM Analysis</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Powered by advanced AI</p>
                </div>

                <div className="group relative flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 ring-2 ring-green-500 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/30">
                    <FileDown className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">4. Tailored Resume</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Download ready</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl border bg-card shadow-lg">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={600}
                className="w-full object-cover opacity-75"
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </section>

        {/* Placeholder sections for nav links */}
        <section id="pricing" className="h-40" />
      </main>

      <footer className="container mx-auto border-t px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p>&copy; {new Date().getFullYear()} SkillSync AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
