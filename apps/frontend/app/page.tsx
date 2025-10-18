import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 place-items-center before:bg-gradient-radial after:bg-gradient-conic relative z-[1] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-4xl font-bold">Welcome to Catus</h1>
        <div className="flex gap-4">
          <Link href="/design-system">
            <Button>Design System</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
