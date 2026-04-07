'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { UserNav } from '@/components/user-nav';
import { Separator } from './ui/separator';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#problem', label: 'The Problem' },
  { href: '#solution', label: 'How It Works' },
  { href: '/pricing', label: 'Subscription' },
  { href: '/about', label: 'About' },
];

export function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-accent-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
          </button>
        </div>
        <div className="flex flex-1 items-center justify-between">
            <div className="hidden md:flex md:items-center md:space-x-6">
                <div className="md:hidden">
                    <Logo />
                </div>
                 <nav className="hidden md:flex md:space-x-8">
                    {navLinks.map((link) => (
                        <Link
                        key={link.label}
                        href={link.href}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                        {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex items-center justify-end flex-1 space-x-2">
                 {user ? (
                    <>
                        <Button asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <UserNav />
                    </>
                 ) : (
                    <>
                        <Button asChild variant="ghost">
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </>
                 )}
            </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="mb-4 ml-2">
                <Logo />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <Separator className="my-2" />
            {user ? (
                <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
                >
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-accent"
                    >
                        Get Started
                    </Link>
                </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
