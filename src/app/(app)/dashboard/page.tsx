import TailorForm from '@/components/dashboard/tailor-form';

export default function DashboardPage() {
  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">AI Resume Tailoring</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload your resume, paste a job description, and let our AI craft the perfect application.
        </p>
      </div>
      <TailorForm />
    </div>
  );
}
