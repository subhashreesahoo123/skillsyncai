'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, ClipboardCopy, Download, Loader2, UploadCloud, FileText, CheckCircle, XCircle, Sparkles, Star, Lightbulb, TrendingUp, History } from 'lucide-react';
import { tailorResume, parsePdf, TailorResumeForJobOutput } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import jsPDF from 'jspdf';

const formSchema = z.object({
  resumeText: z.string().min(100, {
    message: 'Resume must be at least 100 characters.',
  }),
  jobDescriptionText: z.string().min(100, {
    message: 'Job description must be at least 100 characters.',
  }),
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  template: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type TailorResult = TailorResumeForJobOutput & { originalResume: string, jobTitle: string; company: string; };

const templates = {
  'software-engineer': {
    resume: 'Highly-skilled Software Engineer with 5+ years of experience in developing and deploying scalable web applications using React, Node.js, and TypeScript. Proven ability to lead projects and collaborate with cross-functional teams to deliver high-quality software solutions.',
    jobDescription: 'Seeking a Senior Software Engineer to join our dynamic team. The ideal candidate will have a strong background in full-stack development, with expertise in modern JavaScript frameworks, cloud technologies (AWS/GCP), and agile methodologies. Responsibilities include designing and implementing new features, mentoring junior developers, and contributing to our CI/CD pipeline.',
  },
  'data-analyst': {
    resume: 'Detail-oriented Data Analyst with a passion for uncovering insights from complex datasets. Proficient in SQL, Python (Pandas, NumPy), and data visualization tools like Tableau. Experienced in creating dashboards and reports to support business decisions.',
    jobDescription: 'We are looking for a Data Analyst to help us make data-driven decisions. You will be responsible for collecting, cleaning, and analyzing data, as well as creating visualizations and reports for stakeholders. Strong analytical skills and experience with statistical analysis are required.',
  },
   'fresher': {
    resume: 'Recent computer science graduate with a strong foundation in programming, data structures, and algorithms. Eager to apply my skills and learn new technologies in a challenging and rewarding environment. Completed a capstone project on a full-stack web application using the MERN stack.',
    jobDescription: 'Hiring a Fresher/Junior Developer to join our growing team. This is an excellent opportunity for a recent graduate to gain hands-on experience in a professional setting. The ideal candidate should have a solid understanding of at least one programming language and a willingness to learn.',
  }
}

const processingSteps = [
  { name: 'Uploading', progress: 10 },
  { name: 'Analyzing Resume & JD', progress: 40 },
  { name: 'Matching Keywords', progress: 70 },
  { name: 'Generating Tailored Version', progress: 100 },
];

const useTypingEffect = (text: string, speed = 20) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return displayedText;
};

export default function TailorForm() {
  const [result, setResult] = useState<TailorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingState, setProcessingState] = useState({ step: 0, progress: 0});
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const resumeFileRef = useRef<HTMLInputElement>(null);
  
  const animatedResumeText = useTypingEffect(result?.tailoredResumeText || '', 10);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: '',
      jobDescriptionText: '',
      jobTitle: '',
      company: '',
      template: 'none',
    },
  });

  const historyQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, `users/${user.uid}/tailoredResumes`), orderBy('generatedAt', 'desc')) : null,
    [user, firestore]
  );
  const { data: historyData } = useCollection(historyQuery);


  const handleTemplateChange = (templateKey: string) => {
    if (templateKey in templates) {
      const template = templates[templateKey as keyof typeof templates];
      form.setValue('resumeText', template.resume);
      form.setValue('jobDescriptionText', template.jobDescription);
    } else {
       form.setValue('resumeText', '');
       form.setValue('jobDescriptionText', '');
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    toast({ title: 'Uploading and parsing resume...' });
    try {
        const text = await parsePdf(formData);
        form.setValue('resumeText', text);
        toast({ title: 'Resume parsed successfully!', description: 'Resume text has been added to the form.' });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error parsing resume', description: (e as Error).message });
    }
  };


  const runProcessingAnimation = () => {
    setIsLoading(true);
    let currentStep = 0;
    const interval = setInterval(() => {
        if(currentStep < processingSteps.length -1) {
            currentStep++;
            setProcessingState({ step: currentStep, progress: processingSteps[currentStep].progress });
        } else {
            clearInterval(interval);
        }
    }, 1000);
    return () => clearInterval(interval);
  }

  const onSubmit = async (values: FormValues) => {
    setResult(null);
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in' });
      return;
    }
    
    const stopAnimation = runProcessingAnimation();

    try {
      const response = await tailorResume({
        resumeText: values.resumeText,
        jobDescriptionText: values.jobDescriptionText,
      });

      if (response.tailoredResumeText) {
        const newResult = {
          ...response,
          originalResume: values.resumeText,
          jobTitle: values.jobTitle,
          company: values.company
        };
        setResult(newResult);

        const historyCollectionRef = collection(firestore, `users/${user.uid}/tailoredResumes`);
        const historyItem = {
          userId: user.uid,
          originalResumeId: 'N/A', 
          jobTitle: values.jobTitle,
          company: values.company,
          versionNumber: (historyData?.length || 0) + 1,
          generatedAt: new Date().toISOString(),
          tailoredContent: response.tailoredResumeText,
          atsScore: response.atsScore,
          keywordAnalysis: response.keywordAnalysis,
          strengths: response.strengths,
          suggestions: response.suggestions,
          downloadUrl: 'N/A',
        };
        
        addDocumentNonBlocking(historyCollectionRef, historyItem);

        const userDocRef = doc(firestore, `users/${user.uid}`);
        const currentHistory = historyData || [];
        const newHistory = [...currentHistory, historyItem];

        const newResumesGenerated = newHistory.length;
        const newAverageMatchScore = Math.round(
            newHistory.reduce((acc, item) => acc + item.atsScore, 0) / newHistory.length
        );

        const userStatsUpdate = {
            stats: {
                resumesGenerated: newResumesGenerated,
                averageMatchScore: newAverageMatchScore,
                lastActivity: new Date().toISOString(),
            }
        };
        setDocumentNonBlocking(userDocRef, userStatsUpdate, { merge: true });

        toast({ title: 'Resume tailored successfully!', description: 'You can now view the results.' });

      } else {
        throw new Error('Failed to tailor resume. The AI did not return a result.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      stopAnimation();
      setIsLoading(false);
      setProcessingState({ step: 0, progress: 0 });
    }
  };
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - margin * 2;

    const lines = doc.splitTextToSize(result.tailoredResumeText, textWidth);
    doc.text(lines, margin, margin);

    const safeFileName = `${result.jobTitle.replace(/\s/g, '-')}-${result.company.replace(/\s/g, '-')}-resume.pdf`;
    doc.save(safeFileName);
    toast({
      title: 'Downloading PDF...',
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">AI is at work</CardTitle>
            <CardDescription>Analyzing your documents and crafting the perfect resume...</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Progress value={processingState.progress} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                    {processingSteps.map((step, index) => (
                        <div key={step.name} className={`text-center ${index <= processingState.step ? 'text-primary font-semibold' : ''}`}>
                           <p>{step.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    )
  }

  if (result) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className='lg:col-span-3'>
                <CardHeader>
                    <CardTitle>Top Insights for {result.jobTitle} at {result.company}</CardTitle>
                </CardHeader>
                <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Card className='text-center transition-transform hover:scale-105'>
                        <CardHeader>
                            <TrendingUp className="mx-auto h-8 w-8 text-primary" />
                            <CardTitle className='text-4xl font-bold'>{result.atsScore}%</CardTitle>
                            <CardDescription>ATS Score</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card className="transition-transform hover:scale-105">
                        <CardHeader>
                            <Star className="mx-auto h-8 w-8 text-primary" />
                            <CardTitle>Key Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='list-disc pl-5 space-y-1 text-sm'>
                                {result.strengths.map((s,i) => <li key={i}>{s}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                     <Card className="transition-transform hover:scale-105">
                        <CardHeader>
                             <Lightbulb className="mx-auto h-8 w-8 text-primary" />
                            <CardTitle>Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='list-disc pl-5 space-y-1 text-sm'>
                                {result.suggestions.map((s,i) => <li key={i}>{s}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
            <Card className='lg:col-span-1'>
                <CardHeader>
                    <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div>
                        <h4 className='font-semibold mb-2 flex items-center'><CheckCircle className='text-green-500 mr-2'/> Matched Keywords</h4>
                        <div className='flex flex-wrap gap-2'>
                            {result.keywordAnalysis.matched.map(k => <Badge key={k} variant='secondary' className='bg-green-500/20 text-green-700'>{k}</Badge>)}
                        </div>
                    </div>
                     <div>
                        <h4 className='font-semibold mb-2 flex items-center'><XCircle className='text-red-500 mr-2'/> Missing Keywords</h4>
                        <div className='flex flex-wrap gap-2'>
                            {result.keywordAnalysis.missing.map(k => <Badge key={k} variant='secondary' className='bg-red-500/20 text-red-700'>{k}</Badge>)}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className='lg:col-span-2'>
                <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className='flex items-center'><Sparkles className='text-primary mr-2'/> Tailored Resume</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(result.tailoredResumeText)}>
                    <ClipboardCopy className="h-4 w-4" />
                </Button>
                </CardHeader>
                <CardContent>
                <pre className="h-[400px] overflow-auto whitespace-pre-wrap rounded-md border bg-secondary/30 p-4 font-body text-sm">
                    {animatedResumeText}
                </pre>
                </CardContent>
            </Card>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={() => { setResult(null); form.reset(); }}>Tailor Another Resume</Button>
          <Button variant="outline" onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>1. Job & Resume Details</CardTitle>
                 <CardDescription>Provide the job you're applying for and your resume content.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (
                        <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="e.g., Senior Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                    />
                    <FormField control={form.control} name="company" render={({ field }) => (
                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="e.g., Google" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                    />
                </div>
                 <FormField control={form.control} name="template" render={({ field }) => (
                        <FormItem><FormLabel>Load a Template</FormLabel>
                          <Select onValueChange={v => { field.onChange(v); handleTemplateChange(v) }} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a template to get started" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="software-engineer">Software Engineer</SelectItem>
                              <SelectItem value="data-analyst">Data Analyst</SelectItem>
                              <SelectItem value="fresher">Fresher</SelectItem>
                            </SelectContent>
                          </Select>
                        <FormMessage /></FormItem>
                        )}
                    />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="resumeText" render={({ field }) => (
                    <FormItem className="md:col-span-1">
                        <FormLabel className='flex justify-between items-center'>
                            <span>Your Resume</span>
                            <Button type='button' variant='outline' size='sm' onClick={() => resumeFileRef.current?.click()}>
                                <UploadCloud className="mr-2 h-4 w-4" /> Upload PDF
                            </Button>
                            <input type='file' ref={resumeFileRef} onChange={handleFileUpload} accept=".pdf" className='hidden' />
                        </FormLabel>
                        <FormControl>
                        <Textarea placeholder="Paste the full text of your resume here, or upload a PDF." className="h-[300px] resize-y" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField control={form.control} name="jobDescriptionText" render={({ field }) => (
                    <FormItem className="md:col-span-1">
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Paste the full text of the job description here..." className="h-[300px] resize-y" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button type="submit" size="lg" className='transition-transform hover:scale-105'>
            <Bot className="mr-2 h-4 w-4" />
            Tailor with AI
          </Button>
        </div>
      </form>
    </Form>
    {historyData && historyData.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'><History className='mr-2'/> Recent History</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {historyData.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-semibold">{item.jobTitle} at {item.company}</p>
                    <p className="text-sm text-muted-foreground">Generated on {new Date(item.generatedAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={item.atsScore > 85 ? 'default' : item.atsScore > 70 ? 'secondary' : 'destructive'} className="hidden sm:inline-flex">
                    {item.atsScore}% ATS Score
                  </Badge>
                  <Button variant="ghost" size='sm'><FileText className="h-4 w-4 mr-2"/>View</Button>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    )}
    </div>
  );
}
