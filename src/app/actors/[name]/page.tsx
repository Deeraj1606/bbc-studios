"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ContentGrid } from "@/components/content-grid";
import { User, Film } from "lucide-react";

export default function ActorProfilePage() {
    const params = useParams() as { name: string };
    const actorName = decodeURIComponent(params.name);

    // We can reuse the ContentGrid component which already fetches data, 
    // but we need to filter it. The ContentGrid accepts a 'category' prop 
    // which it uses to filter by genre or type. 
    // Ideally, we should update ContentGrid to accept a custom filter or 
    // fetch data here and pass it to a dumb list component.
    // Given the current ContentGrid implementation, it fetches its own data.
    // Let's create a specialized view here that fetches data and passes it to ContentGrid 
    // if ContentGrid supported passing items directly. 
    // Checking ContentGrid... it accepts 'items' in props but immediately overwrites them in useEffect.
    // We need to modify ContentGrid to respect passed items or create a new grid here.
    // Let's create a new grid here to avoid modifying ContentGrid logic too much right now 
    // OR verify if ContentGrid can be easily patched. 
    // ContentGrid logic:
    // useEffect(() => { fetch... setItems(filtered) }, [category]);
    // It doesn't check if items were passed. 

    // Simplest approach: Fetch here and map manually to reuse UI cards, OR update ContentGrid.
    // Updating ContentGrid to optional fetch is better for long term.

    // However, for this task, I will implement the fetch here and render the grid logic 
    // by copying the relevant parts or by making ContentGrid smarter. 
    // Let's make ContentGrid smarter in a separate step? 
    // Actually, looking at ContentGrid, it exports the component.
    // Let's try to just fetch and render our own grid using the same card styles 
    // or duplicates of the card component if it's extracted. It seems it uses 'ContentCard' internally? 
    // 'ContentGrid' is the main export.

    // Let's stick to creating the page first.

    const [movies, setMovies] = useState<any[]>([]);
    const [actorDetails, setActorDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Actor Details
                const actorRes = await fetch(`/api/actors/${encodeURIComponent(actorName)}`);
                const actorData = await actorRes.json();
                setActorDetails(actorData);

                // Fetch Movies
                const contentRes = await fetch('/api/content');
                const contentData = await contentRes.json();
                const actorMovies = contentData.filter((movie: any) =>
                    movie.cast && movie.cast.some((c: string) => c.toLowerCase() === actorName.toLowerCase())
                );
                setMovies(actorMovies);
            } catch (error) {
                console.error("Failed to fetch actor data", error);
            } finally {
                setLoading(false);
            }
        };

        if (actorName) {
            fetchData();
        }
    }, [actorName]);

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-16">
                    <div className="shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl bg-gray-900 group relative">
                        {actorDetails?.imageUrl ? (
                            <img
                                src={actorDetails.imageUrl}
                                alt={actorName}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-24 h-24 text-primary opacity-20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full mb-4 border border-primary/20">
                            OFFICIAL PROFILE
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">{actorName}</h1>

                        {actorDetails?.bio && (
                            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                                {actorDetails.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                            <div className="flex flex-col">
                                <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Total Titles</span>
                                <div className="flex items-center gap-2 text-white font-bold text-lg">
                                    <Film className="w-5 h-5 text-primary" />
                                    {movies.length}
                                </div>
                            </div>
                            {actorDetails?.birthDate && (
                                <div className="flex flex-col border-l border-white/10 pl-6">
                                    <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Born</span>
                                    <span className="text-white font-bold text-lg">{actorDetails.birthDate}</span>
                                </div>
                            )}
                            {actorDetails?.birthPlace && (
                                <div className="flex flex-col border-l border-white/10 pl-6">
                                    <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Origin</span>
                                    <span className="text-white font-bold text-lg">{actorDetails.birthPlace}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Filmography</h2>
                        <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {movies.length > 0 ? (
                                <ContentGrid title="" initialItems={movies} layout="grid" />
                            ) : (
                                <div className="text-center text-gray-500 py-20 bg-card/30 rounded-2xl border border-white/5 shadow-inner">
                                    <Film className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                    <p className="text-xl font-medium">No titles found for this actor.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>

    );
}
