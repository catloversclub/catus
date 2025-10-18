import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center gap-8 text-center max-w-[336px] w-full">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Welcome to Catus</h1>
          <p className="text-text-secondary">
            Your cat management platform built with Next.js and shadcn/ui
          </p>
        </div>
        
        <div className="flex flex-col gap-3 w-full">
          <Link href="/design-system" className="w-full">
            <Button className="w-full">Design System</Button>
          </Link>
          <Button variant="outline" className="w-full">
            Learn More
          </Button>
        </div>
      </main>
    </div>
  );
}
