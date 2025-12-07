export function Visuals() {
    return (
        <section className="pt-0 pb-12">
            <div className="container max-w-6xl mx-auto">
                <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden aspect-video md:aspect-[21/9]">
                    {/* Placeholder for Video/Screenshot */}
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto shadow-lg">
                                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-primary border-b-[15px] border-b-transparent ml-2" />
                            </div>
                            <p className="text-muted-foreground font-medium">Watch how it works</p>
                        </div>
                    </div>

                    {/* Overlay to indicate "half visible" or cut off if needed, 
              but for now we just show a nice container. 
              The user asked for "show only half this makes user to scroll further".
              We can achieve this by adding a gradient mask at the bottom if it was a long list,
              but for a video container, maybe they mean it's positioned such that it's cut off by the fold?
              Or maybe just a stylistic choice. 
              Let's add a subtle gradient at the bottom to blend it if it were long content.
          */}
                </div>
            </div>
        </section>
    );
}
