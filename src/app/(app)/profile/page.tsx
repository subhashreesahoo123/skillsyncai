'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Calendar, FileText, Github, Globe, Linkedin, Loader2, Mail, MapPin, Phone, UploadCloud, User, X, BarChart2 } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';


const profileFormSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  jobRole: z.string().optional(),
  experienceLevel: z.string().optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().or(z.literal('')).optional(),
    github: z.string().url().or(z.literal('')).optional(),
    portfolio: z.string().url().or(z.literal('')).optional(),
  }),
  skills: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const InputWithIcon = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { prependIcon?: React.ElementType }>(({ prependIcon: PrependIcon, className, ...props }, ref) => {
  if (PrependIcon) {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <PrependIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input {...props} ref={ref} className={cn("pl-10", className)} />
      </div>
    );
  }
  return <Input {...props} ref={ref} className={className} />;
});
InputWithIcon.displayName = 'InputWithIcon';


const ChartsDashboard = ({ resumeHistory }: { resumeHistory: any[] }) => {
  const atsScoreData = useMemo(() => {
    if (!resumeHistory || resumeHistory.length === 0) {
      return [{ version: 1, score: 0 }];
    }
    return resumeHistory
      .sort((a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime())
      .map((item, index) => ({
        version: `v${index + 1}`,
        score: item.atsScore,
      }));
  }, [resumeHistory]);

  const skillsMatchData = useMemo(() => {
    if (!resumeHistory || resumeHistory.length === 0) {
      return [
        { name: 'Matched', value: 0, fill: 'var(--color-matched)' },
        { name: 'Missing', value: 0, fill: 'var(--color-missing)' },
      ];
    }
    const latestResume = [...resumeHistory].sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0];
    if (!latestResume.keywordAnalysis) {
      return [
        { name: 'Matched', value: 0, fill: 'var(--color-matched)' },
        { name: 'Missing', value: 0, fill: 'var(--color-missing)' },
      ];
    }
    return [
      { name: 'Matched', value: latestResume.keywordAnalysis.matched.length, fill: 'var(--color-matched)' },
      { name: 'Missing', value: latestResume.keywordAnalysis.missing.length, fill: 'var(--color-missing)' },
    ];
  }, [resumeHistory]);

  const weeklyActivityData = [
    { name: 'Week 1', resumes: 4 },
    { name: 'Week 2', resumes: 3 },
    { name: 'Week 3', resumes: 8 },
    { name: 'Week 4', resumes: 5 },
  ];
  
  const keywordDistData = [
    { name: 'Frontend', count: 5, fill: 'var(--color-frontend)' },
    { name: 'Backend', count: 8, fill: 'var(--color-backend)' },
    { name: 'Tools', count: 3, fill: 'var(--color-tools)' },
  ];
  
  const chartConfig = {
      score: { label: 'ATS Score', color: 'hsl(var(--primary))' },
      resumes: { label: 'Resumes', color: 'hsl(var(--primary))' },
      count: { label: 'Count', color: 'hsl(var(--primary))' },
      matched: { label: 'Matched', color: 'hsl(var(--chart-2))' },
      missing: { label: 'Missing', color: 'hsl(var(--muted))' },
      frontend: { label: 'Frontend', color: 'hsl(var(--chart-1))'},
      backend: { label: 'Backend', color: 'hsl(var(--chart-2))'},
      tools: { label: 'Tools', color: 'hsl(var(--chart-3))'},
  };

  return (
    <div className="space-y-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="transition-transform hover:scale-[1.02] lg:col-span-2">
          <CardHeader>
            <CardTitle>ATS Score Trend</CardTitle>
            <CardDescription>Your ATS score improvement over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={atsScoreData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="version" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: "3 3"}} content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }}/>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="transition-transform hover:scale-[1.02]">
          <CardHeader>
            <CardTitle>Skills Match</CardTitle>
             <CardDescription>Matched vs. missing skills from your last analysis.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <PieChart>
                 <Tooltip content={<ChartTooltipContent hideLabel />} />
                 <Pie data={skillsMatchData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {skillsMatchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                 </Pie>
                 <Legend content={({ payload }) => (
                     <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
                        {payload?.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{backgroundColor: entry.color}}/>
                            <span>{entry.value}: {entry.payload.value}</span>
                          </div>
                        ))}
                     </div>
                 )}/>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="transition-transform hover:scale-[1.02] lg:col-span-3">
          <CardHeader>
            <CardTitle>Activity & Distribution</CardTitle>
            <CardDescription>Your weekly resume generation activity and keyword distribution.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-center text-sm font-semibold text-muted-foreground">Weekly Activity</h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={weeklyActivityData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Bar dataKey="resumes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            <div>
              <h3 className="mb-4 text-center text-sm font-semibold text-muted-foreground">Keyword Categories</h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={keywordDistData} layout="vertical" margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} width={60} fontSize={12}/>
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                    <Bar dataKey="count" layout="vertical" stackId="a" radius={[0, 4, 4, 0]}>
                      {keywordDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default function ProfilePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
  
  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const tailoredResumesRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'tailoredResumes') : null, [firestore, user]);
  const { data: resumeHistory, isLoading: isHistoryLoading } = useCollection(tailoredResumesRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
      jobRole: '',
      experienceLevel: '',
      location: '',
      phoneNumber: '',
      socialLinks: { linkedin: '', github: '', portfolio: '' },
      skills: [],
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const avgMatchScore = useMemo(() => {
    if (!resumeHistory || resumeHistory.length === 0) return 'N/A';
    const totalScore = resumeHistory.reduce((acc, item) => acc + item.atsScore, 0);
    return Math.round(totalScore / resumeHistory.length);
  }, [resumeHistory]);

  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || '',
        jobRole: userProfile.jobRole || '',
        experienceLevel: userProfile.experienceLevel || '',
        location: userProfile.location || '',
        phoneNumber: userProfile.phoneNumber ? userProfile.phoneNumber.replace(/^\+91/, '') : '',
        socialLinks: userProfile.socialLinks || { linkedin: '', github: '', portfolio: '' },
        skills: userProfile.skills || [],
      });
    }
  }, [userProfile, form]);
  
  if (isProfileLoading || isHistoryLoading) {
    return (
       <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const handlePasswordReset = () => {
    if (user?.email) {
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          toast({ title: "Password reset email sent", description: "Check your inbox to reset your password." });
        })
        .catch((error) => {
          toast({ variant: "destructive", title: "Error", description: error.message });
        });
    }
  };

  const handleFileSelect = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setIsSaving(true);
    const storage = getStorage();
    const storageRef = ref(storage, `users/${user.uid}/profile/avatar`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await updateProfile(user, { photoURL: downloadURL });
      const userDocRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userDocRef, { photoUrl: downloadURL }, { merge: true });
      toast({ title: "Avatar updated successfully!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setIsSaving(true);
    const storage = getStorage();
    const storageRef = ref(storage, `users/${user.uid}/resumes/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const userDocRef = doc(firestore, 'users', user.uid);
      const resumeData = {
        fileName: file.name,
        storagePath: downloadURL,
        uploadedAt: new Date().toISOString(),
      };
      setDocumentNonBlocking(userDocRef, { defaultResume: resumeData }, { merge: true });
      toast({ title: "Default resume updated!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !form.getValues('skills')?.includes(newSkill)) {
        const currentSkills = form.getValues('skills') || [];
        form.setValue('skills', [...currentSkills, newSkill]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues('skills') || [];
    form.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
  };


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSaving(true);

    try {
      if (user.displayName !== data.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }
      const userDocRef = doc(firestore, 'users', user.uid);
      
      const saveData = {
        ...data,
        phoneNumber: data.phoneNumber ? `+91${data.phoneNumber}` : '',
      };

      setDocumentNonBlocking(userDocRef, {
        displayName: saveData.displayName,
        jobRole: saveData.jobRole,
        experienceLevel: saveData.experienceLevel,
        location: saveData.location,
        phoneNumber: saveData.phoneNumber,
        socialLinks: saveData.socialLinks,
        skills: saveData.skills,
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    if (!user) return;
    
    if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
    }

    const { dismiss } = toast({
      title: "Deleting item...",
      description: "This item will be deleted in 5 seconds.",
      action: <Button variant="outline" onClick={() => {
        if (deleteTimeoutRef.current) {
          clearTimeout(deleteTimeoutRef.current);
          deleteTimeoutRef.current = null;
        }
        dismiss();
        toast({ title: "Deletion cancelled." });
      }}>Undo</Button>,
    });

    deleteTimeoutRef.current = setTimeout(() => {
        const docRef = doc(firestore, 'users', user.uid, 'tailoredResumes', id);
        deleteDocumentNonBlocking(docRef);
        toast({ title: "History item deleted." });
        deleteTimeoutRef.current = null;
    }, 5000);
  }

  return (
    <div className="space-y-8">
      <ChartsDashboard resumeHistory={resumeHistory || []} />
      <Separator className="my-8" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-1 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Card className="transition-transform hover:scale-[1.02]">
            <CardContent className="pt-6 text-center">
              <div className="relative mx-auto w-fit">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userProfile?.photoUrl} alt={userProfile?.displayName || ''} />
                  <AvatarFallback className="text-3xl">{getInitials(userProfile?.displayName)}</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" onClick={() => handleFileSelect(fileInputRef)}>
                    <UploadCloud className="h-4 w-4"/>
                    <span className="sr-only">Upload avatar</span>
                </Button>
                 <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">{userProfile?.displayName || 'User'}</h2>
              <p className="text-muted-foreground">{userProfile?.jobRole || 'Job Role'}</p>
              <div className="mt-4 flex justify-center gap-4">
                <a href={userProfile?.socialLinks?.linkedin || '#'} target="_blank" rel="noopener noreferrer"><Linkedin className="text-muted-foreground hover:text-foreground" /></a>
                <a href={userProfile?.socialLinks?.github || '#'} target="_blank" rel="noopener noreferrer"><Github className="text-muted-foreground hover:text-foreground" /></a>
                <a href={userProfile?.socialLinks?.portfolio || '#'} target="_blank" rel="noopener noreferrer"><Globe className="text-muted-foreground hover:text-foreground" /></a>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle>User Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Resumes Generated</span>
                <span className="font-bold">{userProfile?.stats?.resumesGenerated || 0}</span>
              </div>
               <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. Match Score</span>
                <span className="font-bold">{userProfile?.stats?.averageMatchScore || 'N/A'}%</span>
              </div>
               <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Activity</span>
                <span className="font-bold">{userProfile?.stats?.lastActivity ? new Date(userProfile.stats.lastActivity).toLocaleDateString() : 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <Button variant="outline" className="w-full" onClick={handlePasswordReset}>Change Password</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8 lg:col-span-2 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField control={form.control} name="displayName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl><InputWithIcon {...field} prependIcon={User} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><InputWithIcon value={user?.email || ''} disabled prependIcon={Mail} /></FormControl>
              </FormItem>
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex h-10 w-full items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <span className="flex h-full items-center border-r bg-muted px-3 text-muted-foreground">+91</span>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="234 567 890"
                          className="w-full border-0 bg-transparent p-2 shadow-none focus-visible:ring-0"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><InputWithIcon {...field} placeholder="Your city, country" prependIcon={MapPin} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="jobRole" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role</FormLabel>
                    <FormControl><InputWithIcon {...field} placeholder="e.g., Senior Software Engineer" prependIcon={Briefcase} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
           <Card className="transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField control={form.control} name="socialLinks.linkedin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl><InputWithIcon {...field} placeholder="https://linkedin.com/in/..." prependIcon={Linkedin} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField control={form.control} name="socialLinks.github" render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl><InputWithIcon {...field} placeholder="https://github.com/..." prependIcon={Github} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField control={form.control} name="socialLinks.portfolio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl><InputWithIcon {...field} placeholder="https://your-portfolio.com" prependIcon={Globe} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add skills separated by commas or enter.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-wrap gap-2 rounded-md border p-2">
                          {field.value?.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button type="button" onClick={() => removeSkill(skill)}><X className="h-3 w-3"/></button>
                            </Badge>
                          ))}
                          <InputWithIcon
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            placeholder="Add a skill..."
                            className="flex-1 border-0 shadow-none focus-visible:ring-0"
                          />
                      </div>
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
             <div className="p-6 pt-0 text-right">
                 <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
          </Card>
          </form>
          </Form>

          <Card className="transition-transform hover:scale-[1.02]">
             <CardHeader>
                <CardTitle>Resume Manager</CardTitle>
                <CardDescription>Upload a default resume to use for tailoring.</CardDescription>
            </CardHeader>
            <CardContent>
                {userProfile?.defaultResume ? (
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className='flex items-center gap-3'>
                             <FileText className="h-6 w-6 text-primary"/>
                            <div>
                                <p className="font-medium">{userProfile.defaultResume.fileName}</p>
                                <p className="text-sm text-muted-foreground">Uploaded on {new Date(userProfile.defaultResume.uploadedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => handleFileSelect(resumeInputRef)}>
                            <UploadCloud className="mr-2"/> Change
                        </Button>
                    </div>
                ) : (
                    <Button className="w-full" variant="outline" onClick={() => handleFileSelect(resumeInputRef)}>
                        <UploadCloud className="mr-2"/> Upload Default Resume
                    </Button>
                )}
                 <input type="file" ref={resumeInputRef} onChange={handleResumeUpload} accept=".pdf,.doc,.docx,.txt" className="hidden" />
            </CardContent>
          </Card>
          
           <Card className="transition-transform hover:scale-[1.02]">
             <CardHeader>
                <CardTitle>Resume History</CardTitle>
                <CardDescription>View, download, or delete your past tailored resumes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {resumeHistory && resumeHistory.length > 0 ? resumeHistory.map((item) => (
                       <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                           <div>
                               <p className="font-semibold">{item.jobTitle} at {item.company}</p>
                               <p className="text-sm text-muted-foreground">Generated on {new Date(item.generatedAt).toLocaleDateString()}</p>
                           </div>
                           <div className="flex items-center gap-2">
                               <Badge variant={item.atsScore > 90 ? "default" : item.atsScore > 80 ? "secondary" : "outline"}>
                                    {item.atsScore}% Match
                                </Badge>
                               <Button variant="ghost" size="icon" onClick={() => setSelectedHistoryItem(item)}><FileText className="h-4 w-4"/></Button>
                               <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteHistoryItem(item.id)}><X className="h-4 w-4"/></Button>
                           </div>
                       </div>
                    )) : (
                        <p className="text-center text-muted-foreground">No resume history found.</p>
                    )}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {selectedHistoryItem && (
        <Dialog open={!!selectedHistoryItem} onOpenChange={(isOpen) => !isOpen && setSelectedHistoryItem(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tailored Resume for {selectedHistoryItem.jobTitle}</DialogTitle>
              <DialogDescription>
                For {selectedHistoryItem.company}, generated on {new Date(selectedHistoryItem.generatedAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
                <pre className="whitespace-pre-wrap font-body text-sm">
                    {selectedHistoryItem.tailoredContent}
                </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
