import Logo from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
       <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="glow-effect top-[-20%] left-[-10%] h-3/5 w-3/5 bg-primary/60" />
          <div className="glow-effect bottom-[-20%] right-[-10%] h-3/5 w-3/5 bg-blue-500/60" />
        </div>
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      {children}
    </div>
  );
}
