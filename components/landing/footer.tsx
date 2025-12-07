import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer
            className="fixed bottom-0 left-0 right-0 bg-foreground text-background dark:bg-background dark:text-foreground py-8 -z-10 h-[500px] flex flex-col justify-between border-t"
            style={{ height: '500px' }} // Explicit height for the reveal effect calculation
        >
            <div className="container max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold">Smart Invoicing for<br />Modern Businesses</h3>
                        <p className="text-muted-foreground max-w-md">
                            Streamline your billing process with AI-powered automation.
                            Create, track, and manage invoices effortlessly.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-background/10 rounded-full hover:bg-background/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-background/10 rounded-full hover:bg-background/20 transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-background/10 rounded-full hover:bg-background/20 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Product</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link href="#" className="hover:text-background transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-background transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-background transition-colors">API</Link></li>
                                <li><Link href="#" className="hover:text-background transition-colors">Integration</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Company</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link href="#" className="hover:text-background transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-background transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-background transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-background transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Constrained container for the copyright and links */}
                <div className="container w-full pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} SmartInvoiceAi. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="#" className="hover:text-background transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-background transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-background/20">
                {/* Full width container for the large text to prevent overflow */}
                <div className="w-full overflow-hidden">
                    <h2 className="text-[12vw] leading-none font-bold text-center bg-gradient-to-b from-background/30 dark:from-foreground/30 to-transparent bg-clip-text text-transparent select-none whitespace-nowrap">
                        SMARTINVOICE
                    </h2>
                </div>
            </div>
        </footer>
    );
}
