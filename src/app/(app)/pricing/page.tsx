'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';

const pricingPlans = {
  monthly: [
    {
      name: 'Free',
      price: '₹0',
      period: '/ month',
      features: [
        '3 resume generations per day',
        'Basic ATS score',
        'Limited keyword suggestions',
        'Email support',
      ],
      buttonText: 'Get Started',
      variant: 'secondary' as const,
    },
    {
      name: 'Pro',
      price: '₹199',
      period: '/ month',
      features: [
        'Unlimited resume tailoring',
        'Advanced ATS score analysis',
        'Smart keyword optimization',
        'Download as PDF/DOCX',
        'Priority email support',
      ],
      buttonText: 'Upgrade Now',
      variant: 'default' as const,
      popular: true,
    },
    {
      name: 'Premium',
      price: '₹399',
      period: '/ month',
      features: [
        'Everything in Pro',
        'AI-powered Interview Preparation',
        'Automated Cover Letter Generator',
        'Priority processing queue',
        '24/7 dedicated support',
      ],
      buttonText: 'Go Premium',
      variant: 'secondary' as const,
    },
  ],
  yearly: [
    {
      name: 'Free',
      price: '₹0',
      period: '/ year',
      features: [
        '3 resume generations per day',
        'Basic ATS score',
        'Limited keyword suggestions',
        'Email support',
      ],
      buttonText: 'Get Started',
      variant: 'secondary' as const,
    },
    {
      name: 'Pro',
      price: '₹1999',
      period: '/ year',
      features: [
        'Unlimited resume tailoring',
        'Advanced ATS score analysis',
        'Smart keyword optimization',
        'Download as PDF/DOCX',
        'Priority email support',
      ],
      buttonText: 'Upgrade Now',
      variant: 'default' as const,
      popular: true,
    },
    {
      name: 'Premium',
      price: '₹3999',
      period: '/ year',
      features: [
        'Everything in Pro',
        'AI-powered Interview Preparation',
        'Automated Cover Letter Generator',
        'Priority processing queue',
        '24/7 dedicated support',
      ],
      buttonText: 'Go Premium',
      variant: 'secondary' as const,
    },
  ],
};

const featureComparison = [
    { feature: 'Resume Generations', free: '3/day', pro: 'Unlimited', premium: 'Unlimited' },
    { feature: 'ATS Score', free: 'Basic', pro: 'Advanced', premium: 'Advanced' },
    { feature: 'Keyword Suggestions', free: 'Limited', pro: 'Smart Optimization', premium: 'Smart Optimization' },
    { feature: 'Download PDF/DOCX', free: '❌', pro: '✅', premium: '✅' },
    { feature: 'AI Interview Prep', free: '❌', pro: '❌', premium: '✅' },
    { feature: 'Cover Letter Generator', free: '❌', pro: '❌', premium: '✅' },
    { feature: 'Support', free: 'Email', pro: 'Priority Email', premium: '24/7 Dedicated' },
];

const faqs = [
    {
        question: "Is my data safe and private?",
        answer: "Absolutely. We prioritize your privacy and data security. Your resume data is encrypted and never shared with third parties. You have full control to delete your data at any time."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time from your profile settings. Your plan will remain active until the end of the current billing period, and you won't be charged again."
    },
    {
        question: "Do you store my resumes?",
        answer: "We store your original and tailored resumes to provide you with a version history. This allows you to track your progress and access previous versions. All stored data is encrypted and secure."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and UPI payments through our secure payment gateway partner, Stripe."
    }
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const plans = isYearly ? pricingPlans.yearly : pricingPlans.monthly;

  return (
    <div className="w-full space-y-16 py-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in-up">
        <h1 className="font-headline text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Choose the plan that best fits your career goals. No hidden fees, ever.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <span>Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} aria-label="Toggle billing period" />
          <span className="flex items-center">
            Yearly
            <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">Save 20%</Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={cn(
              'flex flex-col rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-primary/20',
              plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/50',
              'animate-fade-in-up'
            )}
            style={{animationDelay: `${index * 150}ms`}}
          >
            {plan.popular && (
                <Badge className='absolute -top-3 left-1/2 -translate-x-1/2'>Most Popular</Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.variant} size="lg">
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       {/* Feature Comparison Table */}
      <div className="animate-fade-in-up" style={{animationDelay: `600ms`}}>
        <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Compare All Features</h2>
            <p className="mt-2 text-lg text-muted-foreground">Find the perfect plan for your needs.</p>
        </div>
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[40%]">Feature</TableHead>
                    <TableHead className="text-center">Free</TableHead>
                    <TableHead className="text-center">Pro</TableHead>
                    <TableHead className="text-center">Premium</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {featureComparison.map((item) => (
                    <TableRow key={item.feature}>
                        <TableCell className="font-medium">{item.feature}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{item.free}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{item.pro}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{item.premium}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
      </div>

       {/* FAQ Section */}
      <div className="max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: `750ms`}}>
           <div className="text-center mb-8">
                <h2 className="font-headline text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
                 <p className="mt-2 text-lg text-muted-foreground">Have questions? We've got answers.</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
      </div>
      
       {/* CTA Section */}
      <div className="text-center p-8 rounded-lg bg-gradient-to-r from-primary/20 to-blue-500/20 animate-fade-in-up" style={{animationDelay: `900ms`}}>
         <h2 className="font-headline text-3xl font-bold">Start Building Your Perfect Resume Today 🚀</h2>
         <p className="mt-4 text-lg text-muted-foreground">Stop getting rejected by algorithms. Start landing interviews.</p>
         <Button size="lg" className="mt-6">
            Get Started For Free <ArrowRight className="ml-2 h-5 w-5" />
         </Button>
      </div>
    </div>
  );
}
