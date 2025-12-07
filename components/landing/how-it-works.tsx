"use client";

import { HOW_IT_WORKS } from "@/constants/howItWorks";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HowItWorks() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="how-it-works" className="py-24 px-4">
            <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Create professional invoices in three simple steps.
                    </p>
                </div>

                <div className="space-y-24">
                    {HOW_IT_WORKS.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className={cn(
                                "flex flex-col md:flex-row items-center gap-12",
                                index % 2 === 1 ? "md:flex-row-reverse" : ""
                            )}
                        >
                            <div className="flex-1 space-y-2 relative">
                                <div className="absolute -left-4 -top-10 text-[10rem] font-bold text-primary/20 select-none leading-none -z-10">
                                    {step.step}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold pt-4">{step.title}</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted shadow-xl group">
                                    {mounted && (
                                        <>
                                            <Image
                                                src={step.imageLight}
                                                alt={`${step.title} Light Mode`}
                                                fill
                                                className={cn(
                                                    "object-cover transition-opacity duration-500",
                                                    theme === "dark" ? "opacity-0" : "opacity-100"
                                                )}
                                            />
                                            <Image
                                                src={step.imageDark}
                                                alt={`${step.title} Dark Mode`}
                                                fill
                                                className={cn(
                                                    "object-cover transition-opacity duration-500 absolute inset-0",
                                                    theme === "dark" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </>
                                    )}
                                    {/* Fallback/Loading state could go here */}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
