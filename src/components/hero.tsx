"use client";

import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContentItem {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    year: number;
    rating: string;
    director: string;
    cast: string[];
}

export function Hero() {
    const { isAdmin } = useAuth();
    const [featuredItems, setFeaturedItems] = useState<ContentItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fetch('/api/content');
                const data = await response.json();
                if (data && data.length > 0) {
                    // Take up to 4 items for the hero carousel
                    setFeaturedItems(data.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch featured content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
    }, [featuredItems.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
    };

    // Auto-scroll
    useEffect(() => {
        if (featuredItems.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, featuredItems.length]);

    if (loading) {
        return (
            <div className="relative h-[85vh] w-full bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (featuredItems.length === 0) {
        return (
            <div className="relative h-[60vh] w-full bg-background flex flex-col items-center justify-center p-8 text-center border-b border-white/10">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to BBC Movies</h1>
                <p className="text-gray-400 max-w-lg mb-8">
                    {isAdmin
                        ? "Upload your first movie or TV show to get started. The featured content will appear here."
                        : "Premium entertainment is coming soon. Please check back later."}
                </p>
                {isAdmin && (
                    <Link href="/admin/upload">
                        <Button variant="default" size="lg">Go to Upload</Button>
                    </Link>
                )}
            </div>
        );
    }

    const featured = featuredItems[currentIndex];

    return (
        <div className="relative h-[85vh] w-full overflow-hidden group">
            {/* Carousel Items */}
            {featuredItems.map((item, index) => (
                <div
                    key={item.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                        <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-20 h-full max-w-7xl mx-auto px-4 md:px-12 flex items-center">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full mt-16">
                            {/* Info */}
                            <div className={cn(
                                "space-y-6 transition-all duration-700 delay-300",
                                index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                            )}>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/90 text-white text-xs font-bold tracking-wider rounded-full shadow-lg shadow-primary/20 mb-2">
                                    FEATURED PREMIERE
                                </div>

                                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
                                    {item.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
                                    <span className="bg-white/10 px-2 py-1 rounded text-white border border-white/10">{item.year}</span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {item.rating}
                                    </span>
                                    <span>{item.director}</span>
                                </div>

                                <p className="text-lg text-gray-300 leading-relaxed max-w-xl line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 pt-4">
                                    <Link href={`/content/${item.id}`}>
                                        <Button size="lg" className="h-14 px-10 text-lg gap-3 shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 font-bold">
                                            <Play className="w-6 h-6 fill-white" />
                                            Watch Now
                                        </Button>
                                    </Link>
                                    <Link href={`/content/${item.id}`}>
                                        <Button size="lg" variant="secondary" className="h-14 px-10 text-lg gap-3 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 font-bold">
                                            <Info className="w-6 h-6" />
                                            More Info
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Poster */}
                            <div className={cn(
                                "hidden lg:flex justify-end relative transition-all duration-700 delay-500",
                                index === currentIndex ? "scale-100 opacity-100 rotate-3" : "scale-90 opacity-0 rotate-0"
                            )}>
                                <div className="relative w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Starring</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.cast.slice(0, 3).map((actor, i) => (
                                                <span key={i} className="text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white">
                                                    {actor}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            {featuredItems.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                        {featuredItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    index === currentIndex ? "bg-primary w-8" : "bg-white/30 hover:bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
