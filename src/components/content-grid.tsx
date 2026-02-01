"use client";

import { Play, Info, Plus, Star, TrendingUp, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWatchlist } from "@/contexts/watchlist-context";
import { downloadStore } from "@/lib/download-store";
import { ContentGridSkeleton } from "@/components/skeletons";

interface ContentItem {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    rating: string;
    year: number;
    genre: string[];
    views: number;
    type: string;
    uploadedAt: string;
}

interface ContentGridProps {
    title: string;
    subtitle?: string;
    layout?: "grid" | "featured" | "magazine";
    category?: string;
    initialItems?: ContentItem[];
}

export function ContentGrid({
    title,
    subtitle,
    layout = "grid",
    category,
    initialItems
}: ContentGridProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [items, setItems] = useState<ContentItem[]>(initialItems || []);
    const [loading, setLoading] = useState(!initialItems);
    const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist();

    useEffect(() => {
        if (initialItems) {
            setItems(initialItems);
            setLoading(false);
            return;
        }

        const fetchContent = async () => {
            try {
                const response = await fetch('/api/content');
                const data = await response.json();

                // Filter by category if provided, otherwise show all
                let filtered = data;
                if (category) {
                    if (category === 'trending') {
                        filtered = data.slice(0, 6);
                    } else if (category === 'new') {
                        filtered = data.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
                    } else {
                        filtered = data.filter((item: any) =>
                            item.genre.some((g: string) => g.toLowerCase().includes(category.toLowerCase())) ||
                            item.type === category
                        );
                    }
                }

                setItems(filtered);
            } catch (error) {
                console.error("Failed to fetch content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [category, initialItems]);

    const toggleWatchlist = (e: React.MouseEvent, item: ContentItem) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWatchlist(item.id)) {
            removeFromWatchlist(item.id);
        } else {
            addToWatchlist({
                contentId: item.id,
                title: item.title,
                type: item.type,
                thumbnailUrl: item.thumbnailUrl,
                year: item.year,
                rating: item.rating,
                duration: "",
                genre: item.genre
            });
        }
    };

    const handleDownload = (e: React.MouseEvent, item: ContentItem) => {
        e.preventDefault();
        e.stopPropagation();
        downloadStore.addDownload({
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnailUrl,
            size: "1.2 GB",
            quality: "1080p",
        });
    };

    if (loading) {
        return <ContentGridSkeleton />;
    }

    if (items.length === 0) {
        return null;
    }

    if (layout === "featured") {
        return (
            <div className="my-12 px-4 md:px-12">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
                    </div>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.slice(0, 6).map((item, i) => (
                        <Link href={`/content/${item.id}`} key={item.id} className={cn(
                            "group relative rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 block",
                            i === 0 ? "md:col-span-2 md:row-span-2" : "",
                            "hover:scale-[1.02] hover:z-30 hover:shadow-2xl hover:shadow-primary/20"
                        )}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >

                            <div className={cn(
                                "relative w-full bg-gray-900",
                                i === 0 ? "h-96" : "h-64"
                            )}>
                                <img
                                    src={item.thumbnailUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-white" />
                                    #{i + 1} Trending
                                </div>

                                <div className={cn(
                                    "absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-300",
                                    hoveredId === item.id || i === 0 ? "translate-y-0" : "translate-y-2"
                                )}>
                                    <h3 className="text-xl font-bold text-white mb-2 shadow-black drop-shadow-md">{item.title}</h3>
                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-200 font-medium">
                                        <span className="bg-secondary/80 px-2 py-0.5 rounded text-white">{item.year}</span>
                                        <span className="text-shadow-sm">•</span>
                                        <span className="text-shadow-sm">{item.genre[0]}</span>
                                        <span className="text-shadow-sm">•</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-primary fill-primary" />
                                            <span>{item.rating}</span>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "flex flex-wrap gap-2 transition-opacity duration-300",
                                        hoveredId === item.id || i === 0 ? "opacity-100" : "opacity-0"
                                    )}>
                                        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                                            <Play className="w-4 h-4 fill-white" />
                                            Play Now
                                        </button>
                                        <button
                                            onClick={(e) => toggleWatchlist(e, item)}
                                            className={cn(
                                                "backdrop-blur-md hover:bg-white/10 text-white p-2.5 rounded-lg transition-all shadow-xl border border-white/20 hover:scale-105",
                                                isInWatchlist(item.id) ? "bg-primary border-primary" : "bg-white/5"
                                            )}
                                        >
                                            <Plus className={cn("w-5 h-5", isInWatchlist(item.id) && "rotate-45")} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDownload(e, item)}
                                            className="backdrop-blur-md bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-lg transition-all shadow-xl border border-white/20 hover:scale-105"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    if (layout === "magazine") {
        return (
            <div className="my-12 px-4 md:px-12">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map((item, i) => (
                        <Link href={`/content/${item.id}`} key={item.id}
                            className="group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:z-20 block bg-gray-900"
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300",
                                hoveredId === item.id ? "opacity-100" : ""
                            )}>
                                <button className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <Play className="w-5 h-5 fill-white" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h4 className="text-white font-semibold text-sm truncate">{item.title}</h4>
                                <p className="text-xs text-gray-300">{item.year}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="my-12 px-4 md:px-12">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
                {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {items.map((item, i) => (
                    <Link href={`/content/${item.id}`} key={item.id}
                        className="group relative rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300 hover:z-20 block bg-gray-900"
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <div className="relative aspect-video">
                            <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                            <div className={cn(
                                "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300",
                                hoveredId === item.id ? "opacity-100" : ""
                            )}>
                                <button className="bg-primary text-white p-4 rounded-full hover:bg-primary/90 transition-colors shadow-xl">
                                    <Play className="w-6 h-6 fill-white" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-white font-semibold text-sm mb-1 truncate">{item.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <Star className="w-3 h-3 text-primary fill-primary" />
                                    <span>{item.rating}</span>
                                    <span>•</span>
                                    <span>{item.year}</span>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl p-3 flex gap-2 transform translate-y-full transition-all duration-300 border-t border-white/10",
                            hoveredId === item.id ? "translate-y-0" : ""
                        )}>
                            <button className="flex-1 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded text-xs font-bold transition-all hover:scale-[1.02] active:scale-95">
                                Watch Now
                            </button>
                            <button
                                onClick={(e) => toggleWatchlist(e, item)}
                                className={cn(
                                    "p-2 rounded transition-all border border-white/10 hover:bg-white/10",
                                    isInWatchlist(item.id) ? "bg-primary border-primary" : "bg-white/5"
                                )}
                            >
                                <Plus className={cn("w-4 h-4", isInWatchlist(item.id) && "rotate-45")} />
                            </button>
                            <button
                                onClick={(e) => handleDownload(e, item)}
                                className="p-2 rounded transition-all border border-white/10 bg-white/5 hover:bg-white/10"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
