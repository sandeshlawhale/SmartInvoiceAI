"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

import { NAV_LINKS } from "@/constants/links";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl">SmartInvoiceAi</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {session ? (
                        <Button asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
