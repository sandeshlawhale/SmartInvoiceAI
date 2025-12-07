"use client";

import { PRICING_PLANS } from "@/constants/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Pricing() {
    return (
        <section id="pricing" className="py-24 px-4 bg-muted/30">
            <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Simple Pricing</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Start for free and upgrade as you grow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRICING_PLANS.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn("h-full", !plan.active && "opacity-70 grayscale-[0.5]")}
                        >
                            <Card className={cn(
                                "h-full flex flex-col relative overflow-hidden",
                                plan.active ? "border-primary shadow-lg scale-105 z-10" : "border-border"
                            )}>
                                {!plan.active && (
                                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                        <span className="bg-muted px-4 py-2 rounded-full text-sm font-medium border shadow-sm">
                                            Coming Soon
                                        </span>
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-muted-foreground">
                                        {plan.name}
                                    </CardTitle>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-4xl font-bold tracking-tight">
                                            {plan.price}
                                        </span>
                                        <span className="ml-1 text-muted-foreground font-medium">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {plan.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <ul className="space-y-3 text-sm">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="w-4 h-4 text-primary shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.active ? "default" : "outline"}
                                        disabled={!plan.active}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
