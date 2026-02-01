"use client";

import { Play, X, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ContinueWatchingItem {
    contentId: string;
    title: string;
    thumbnailUrl: string;
    currentTime: number;
    duration: number;
    percentage: number;
    timestamp: number;
}

export function ContinueWatching() {
    const [items, setItems] = useState<ContinueWatchingItem[]>([]);

    useEffect(() => {
        loadContinueWatching();
    }, []);

    const loadContinueWatching = () => {
        const data = localStorage.getItem('continueWatching');
        if (data) {
            setItems(JSON.parse(data));
        }
    };

    const removeItem = (contentId: string) => {
        const updated = items.filter(item => item.contentId !== contentId);
        setItems(updated);
        localStorage.setItem('continueWatching', JSON.stringify(updated));
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (hrs > 0) {
            return `${hrs}h ${mins}m left`;
        }
        return `${mins}m left`;
    };

    if (items.length === 0) return null;

    return (
        <div className="my-12 px-4 md:px-12">
            <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Continue Watching</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {items.map((item) => (
                    <div
                        key={item.contentId}
                        className="group relative rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="relative aspect-video bg-gradient-to-br from-secondary/30 to-accent/30">
                            <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${item.percentage}%` }}
                                />
                            </div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="bg-primary text-white p-4 rounded-full hover:bg-primary/90 transition-colors transform scale-100 group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-6 h-6 fill-white" />
                                </button>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeItem(item.contentId);
                                }}
                                className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        <div className="p-3 bg-card">
                            <h4 className="text-white font-semibold text-sm mb-1 truncate">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{formatTime(item.duration - item.currentTime)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
