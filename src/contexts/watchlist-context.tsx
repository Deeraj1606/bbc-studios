"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WatchlistItem {
    contentId: string;
    title: string;
    type: string;
    thumbnailUrl: string;
    year: number;
    rating: string;
    duration: string;
    genre: string[];
    addedAt: number;
}

interface WatchlistContextType {
    watchlist: WatchlistItem[];
    addToWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => void;
    removeFromWatchlist: (contentId: string) => void;
    isInWatchlist: (contentId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('watchlist');
        if (stored) {
            setWatchlist(JSON.parse(stored));
        }
    }, []);

    const addToWatchlist = (item: Omit<WatchlistItem, 'addedAt'>) => {
        const newItem = { ...item, addedAt: Date.now() };
        const updated = [newItem, ...watchlist.filter(i => i.contentId !== item.contentId)];
        setWatchlist(updated);
        localStorage.setItem('watchlist', JSON.stringify(updated));
    };

    const removeFromWatchlist = (contentId: string) => {
        const updated = watchlist.filter(item => item.contentId !== contentId);
        setWatchlist(updated);
        localStorage.setItem('watchlist', JSON.stringify(updated));
    };

    const isInWatchlist = (contentId: string) => {
        return watchlist.some(item => item.contentId === contentId);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within WatchlistProvider');
    }
    return context;
}
