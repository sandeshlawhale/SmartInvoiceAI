import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="pt-32 pb-16 md:pt-28 md:pb-8 px-4">
            <div className="container mx-auto max-w-4xl text-center space-y-2">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Smart, Simple &<br />
                    <span className="text-primary">Fast Invoicing</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    Create, manage & download invoices in seconds —<br />powered by AI assistance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button size="default" className="h-12 px-8 text-lg rounded-full" asChild>
                        <Link href="/dashboard">
                            Create your first invoice
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    {/* <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full" asChild>
                        <Link href="#how-it-works">
                            See how it works
                        </Link>
                    </Button> */}
                </div>
            </div>
        </section>
    );
}
