'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Cpu, Database, Rocket, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

const techStack = [
  { name: 'Next.js & React', icon: <Cpu className="h-6 w-6 text-primary" />, description: 'For a fast and modern frontend experience.' },
  { name: 'Tailwind CSS', icon: <Sparkles className="h-6 w-6 text-primary" />, description: 'For beautiful and responsive user interfaces.' },
  { name: 'Firebase', icon: <Database className="h-6 w-6 text-primary" />, description: 'For authentication, database, and storage.' },
  { name: 'Genkit & Gemini', icon: <BrainCircuit className="h-6 w-6 text-primary" />, description: 'For powerful, cutting-edge AI capabilities.' },
];

export default function AboutPage() {
  return (
    <div className="w-full space-y-16 py-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in-up">
        <h1 className="font-headline text-5xl font-bold tracking-tight">About SkillSync AI</h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Empowering job seekers with AI-driven resume optimization to help you land your dream job faster. SkillSync AI is an intelligent platform that helps users create job-specific, ATS-optimized resumes using the power of Large Language Models.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="animate-fade-in-up" style={{animationDelay: '150ms'}}>
        <CardHeader className="text-center">
            <Rocket className="mx-auto h-12 w-12 text-primary mb-2" />
            <CardTitle className="font-headline text-3xl">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-xl text-muted-foreground max-w-4xl mx-auto">
                To simplify and democratize the job application process by automating the tedious task of resume tailoring, giving every candidate the best possible chance to get noticed and secure interviews.
            </p>
        </CardContent>
      </Card>
      
      {/* Vision Section */}
      <Card className="animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <CardHeader className="text-center">
            <Globe className="mx-auto h-12 w-12 text-primary mb-2" />
            <CardTitle className="font-headline text-3xl">Our Vision</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center text-xl text-muted-foreground max-w-4xl mx-auto">
                To forge a future where career advancement is universally accessible, empowering every individual to bridge the gap between their potential and their dream opportunity. We envision a world where AI eliminates barriers, ensuring that skill and talent—not application hurdles—define professional success on a global scale.
            </p>
        </CardContent>
      </Card>

      {/* How It Works */}
      <div className="animate-fade-in-up" style={{animationDelay: `450ms`}}>
        <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-2 text-lg text-muted-foreground">A simple, four-step process to success.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {["Upload Resume", "Paste Job Description", "AI Analysis", "Get Tailored Resume"].map((step, index) => (
                 <Card key={index} className="text-center p-6 transition-transform hover:scale-105">
                     <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-xl mx-auto mb-4">{index + 1}</div>
                     <h3 className="font-semibold">{step}</h3>
                 </Card>
            ))}
        </div>
      </div>
      
      {/* Tech Stack */}
      <div className="animate-fade-in-up" style={{animationDelay: `600ms`}}>
        <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Our Technology</h2>
            <p className="mt-2 text-lg text-muted-foreground">Built with a modern, scalable, and secure tech stack.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map(tech => (
                <Card key={tech.name} className="flex flex-col items-center text-center p-6 transition-transform hover:scale-105">
                    {tech.icon}
                    <h3 className="mt-4 font-bold text-lg">{tech.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{tech.description}</p>
                </Card>
            ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center p-8 rounded-lg bg-gradient-to-r from-primary/20 to-blue-500/20 animate-fade-in-up" style={{animationDelay: `750ms`}}>
         <h2 className="font-headline text-3xl font-bold">Start Building Your Perfect Resume Today 🚀</h2>
         <p className="mt-4 text-lg text-muted-foreground">Stop getting rejected by algorithms. Start landing interviews.</p>
         <Button size="lg" className="mt-6" asChild>
            <Link href="/dashboard">
                Get Started For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
         </Button>
      </div>
    </div>
  );
}
