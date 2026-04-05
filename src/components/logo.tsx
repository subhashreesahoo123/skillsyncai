import Link from 'next/link';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-lg font-bold font-headline',
        className
      )}
    >
      <FileText className="h-6 w-6 text-primary" />
      <span>SkillSync AI</span>
    </Link>
  );
}
