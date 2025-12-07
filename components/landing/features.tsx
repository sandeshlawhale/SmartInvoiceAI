"use client";

import { FEATURES } from "@/constants/features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Features() {
    return (
        <section id="features" className="py-24 px-4 bg-muted/30">
            <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to manage your invoicing efficiently.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FEATURES.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={cn("h-full", feature.className)}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
                                    <div className="absolute left-15 top-5 opacity-20 transition-opacity duration-500 pointer-events-none">
                                        <Icon className="w-48 h-48 text-primary" />
                                    </div>
                                    <CardHeader className="relative z-10">
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10">
                                        <p className="text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
