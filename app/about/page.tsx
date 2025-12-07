"use client";

import React from "react";

import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { about } from "@/constants/about";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Github, Linkedin, Globe } from "lucide-react";
import Link from "next/link";

const iconMap: { [key: string]: React.ElementType } = {
    Mail,
    Github,
    Linkedin,
    Globe,
};

export default function AboutPage() {
    return (
        <div className="min-h-screen font-sans">
            <Navbar />

            <main className="relative z-10 bg-background mb-[500px] shadow-2xl rounded-b-3xl border-b overflow-hidden">

                {/* 1. HERO BANNER */}
                <section className="relative pt-24 pb-12 overflow-hidden bg-muted/20">
                    {/* Abstract Gradient Background */}
                    <div className="absolute inset-0 -z-10 opacity-10">
                        <div className="absolute top-0 left-1/4 w-96 h-full bg-primary/50 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-full bg-purple-500/50 rounded-full blur-[100px]" />
                    </div>

                    <div className="container max-w-xl mx-auto space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl md:text-5xl font-bold tracking-tight"
                        >
                            {about.hero.heading}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-xl text-muted-foreground max-w-2xl leading-relaxed text-center"
                        >
                            {about.hero.subheading}
                        </motion.p>
                    </div>
                </section>

                {/* 2. OUR STORY SECTION */}
                <section className="py-12 px-4 bg-background">
                    <div className="container max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
                            >
                                {/* Placeholder for Story Image */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                    <span className="text-muted-foreground font-medium">Our Story Image</span>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold">Our Story</h2>
                                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {about.story}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 3. WHAT WE DO SECTION */}
                <section className="py-12 px-4 bg-muted/30">
                    <div className="container max-w-6xl mx-auto">
                        <div className="text-center mb-4">
                            <h2 className="text-3xl font-bold">What We Do</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Empowering you with tools to manage your business finances.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {about.whatWeDo.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-background p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                                >
                                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. OUR MISSION */}
                <section className="py-12 px-4 bg-background">
                    <div className="relative container max-w-4xl mx-auto text-center">
                        <div className="absolute text-primary/10 top-0 left-0 rotate-180">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-[12vw]" viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5a2 2 0 0 1 2 2v6c0 3.13 -1.65 5.193 -4.757 5.97a1 1 0 1 1 -.486 -1.94c2.227 -.557 3.243 -1.827 3.243 -4.03v-1h-3a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 2 -2z" /><path d="M18 5a2 2 0 0 1 2 2v6c0 3.13 -1.65 5.193 -4.757 5.97a1 1 0 1 1 -.486 -1.94c2.227 -.557 3.243 -1.827 3.243 -4.03v-1h-3a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-3a2 2 0 0 1 2 -2z" /></svg>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                            <p className="text-2xl md:text-3xl font-medium leading-relaxed text-muted-foreground">
                                &ldquo;{about.mission.trim()}&rdquo;
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 5. MEET THE CREATOR */}
                <section className="py-12 px-4 bg-muted/30">
                    <div className="container max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="shrink-0"
                            >
                                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-background shadow-xl relative">
                                    {/* Placeholder for Creator Image if not found */}
                                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground">Sandesh</span>
                                    </div>
                                    {/* Uncomment when image is available */}
                                    {/* <Image 
                                src="/sandesh.jpg" 
                                alt={about.creator.name} 
                                fill 
                                className="object-cover"
                             /> */}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-center md:text-left"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold">{about.creator.name}</h2>
                                    <p className="text-primary font-medium">Creator & Developer</p>
                                </div>
                                <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {about.creator.description}
                                </div>
                                <div className="flex gap-4 mt-4">
                                    {about.creator.socials.map((social: { name: string; href: string; icon: string }, index: number) => {
                                        const Icon = iconMap[social.icon];
                                        return (
                                            <Link
                                                key={index}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                                                title={social.name}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 6. ROADMAP (OPTIONAL) */}
                <section className="py-12 px-4 bg-background">
                    <div className="container max-w-6xl mx-auto">
                        <div className="text-center mb-4">
                            <h2 className="text-3xl font-bold">Roadmap</h2>
                            <p className="text-muted-foreground">What&apos;s coming next for Smart AI Invoice.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {about.roadmap.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. CONTACT */}
                <section className="relative py-12 px-4 overflow-hidden rounded-b-3xl text-primary-foreground">

                    {/* Background with radial gradient */}
                    <div
                        className="absolute inset-0 -z-20"
                        style={{
                            background: "radial-gradient(circle at center, #60A5FA 0%, #A78BFA 100%)",
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 0.05, x: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute left-20 top-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-lg rotate-[-12deg] hidden lg:block pointer-events-none"
                    />
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 0.05, x: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute right-20 -top-1/2 translate-y-1/2 w-48 h-48 bg-white rounded-lg rotate-[12deg] hidden lg:block pointer-events-none"
                    />

                    <div className="container max-w-4xl mx-auto text-center space-y-8">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
                            <p className="text-primary-foreground/80 text-xl mb-8">
                                Have questions, feedback, or just want to say hi?
                            </p>
                            <Link
                                href={`mailto:${about.contact.email}`}
                                className="inline-flex items-center gap-2 bg-background text-foreground px-4 py-2 rounded-full font-semibold text-lg hover:bg-background/90 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                <Mail className="w-5 h-5" />
                                {about.contact.email}
                            </Link>
                        </motion.div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
