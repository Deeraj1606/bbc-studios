"use client";

import { ContentGrid } from "@/components/content-grid";
import { Bookmark } from "lucide-react";
import { useWatchlist } from "@/contexts/watchlist-context";
import { useEffect, useState } from "react";

export default function MyListPage() {
    const { watchlist } = useWatchlist();
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        // Map watchlist items to ContentItem format
        const mappedItems = watchlist.map(item => ({
            id: item.contentId,
            title: item.title,
            thumbnailUrl: item.thumbnailUrl,
            year: item.year,
            rating: item.rating,
            duration: item.duration,
            type: item.type,
            genre: item.genre || [],
            videoUrl: "", // Not needed for grid card
            description: "", // Not needed for grid card
            director: "",
            cast: []
        }));
        setItems(mappedItems.reverse()); // Show newest first
    }, [watchlist]);

    return (
        <main className="min-h-screen bg-background pt-20 pb-20">
            <div className="px-4 md:px-12 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Bookmark className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white">My List</h1>
                </div>

                {items.length > 0 ? (
                    <div className="mb-12">
                        <ContentGrid
                            title=""
                            initialItems={items}
                            layout="grid"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Bookmark className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
                        <p className="text-gray-400 max-w-md">
                            Add movies and reviews to your watchlist to keep track of what you want to watch.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
