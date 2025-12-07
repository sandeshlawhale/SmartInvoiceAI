"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export function Visuals() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true); // Auto-plays by default

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <section className="pt-0 pb-12">
            <div className="container max-w-6xl mx-auto">
                <div
                    className="relative rounded-xl border bg-card shadow-2xl overflow-hidden aspect-video md:aspect-[21/9] cursor-pointer group"
                    onClick={togglePlay}
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/videos/SmartInvoiceAI_Tutorial.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Play/Pause Overlay */}
                    <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                        <div className="w-20 h-20 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                            {isPlaying ? (
                                <Pause className="w-8 h-8 text-primary fill-primary" />
                            ) : (
                                <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
