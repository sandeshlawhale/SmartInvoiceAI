"use client";

import { FINAL_CTA_CONTENT } from "@/constants/finalCta";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function FinalCTA() {
    const { data: session } = useSession();
    const href = session ? "/dashboard" : "/login";

    return (
        <section className="relative py-24 px-4 overflow-hidden rounded-b-3xl">
            {/* Background with radial gradient */}
            <div
                className="absolute inset-0 -z-20"
                style={{
                    background: "radial-gradient(circle at center, #60A5FA 0%, #A78BFA 100%)",
                }}
            />

            {/* Glowing blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2" />

            {/* Floating invoice mockups (decorative) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 0.05, x: 0 }}
                transition={{ duration: 1 }}
                className="absolute left-10 top-1/2 -translate-y-1/2 w-64 h-80 bg-white rounded-lg rotate-[-12deg] hidden lg:block pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 0.05, x: 0 }}
                transition={{ duration: 1 }}
                className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-80 bg-white rounded-lg rotate-[12deg] hidden lg:block pointer-events-none"
            />

            <div className="container max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* Glowing effect behind heading */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white relative z-10 tracking-tight">
                            {FINAL_CTA_CONTENT.heading}
                        </h2>
                    </div>

                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                        {FINAL_CTA_CONTENT.subheading}
                    </p>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 hover:scale-105 transition-all duration-300 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] h-14 px-8 text-lg rounded-full"
                            asChild
                        >
                            <Link href={href}>
                                {FINAL_CTA_CONTENT.buttonText}
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
