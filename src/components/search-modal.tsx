"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [results, setResults] = useState<any[]>([]);
    const [allContent, setAllContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    useEffect(() => {
        const history = localStorage.getItem("search-history");
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    const addToHistory = (query: string) => {
        if (!query.trim()) return;
        const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem("search-history", JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem("search-history");
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                setAllContent(data);
            } catch (error) {
                console.error("Failed to fetch search content", error);
            }
        };

        if (isOpen && allContent.length === 0) {
            fetchContent();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = allContent.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.genre.some((g: string) => g.toLowerCase().includes(query)) ||
            (item.cast && item.cast.some((c: string) => c.toLowerCase().includes(query))) ||
            (item.director && item.director.toLowerCase().includes(query))
        );
        setResults(filtered);
    }, [searchQuery, allContent]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto pt-20 px-4">
                {/* Search Input */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search movies, TV shows, actors, genres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background/50 border-2 border-gray-700 rounded-lg pl-14 pr-12 py-4 text-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Results */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {searchQuery && results.length > 0 && (
                        <>
                            <h2 className="text-xl font-semibold text-white mb-4">Results for "{searchQuery}"</h2>
                            {results.map((result) => (
                                <a
                                    key={result.id}
                                    href={`/content/${result.id}`}
                                    onClick={() => {
                                        addToHistory(searchQuery);
                                        onClose();
                                    }}
                                    className="flex items-center gap-4 p-4 bg-background/50 rounded-lg hover:bg-background/70 cursor-pointer transition-colors border border-transparent hover:border-primary/50 group"
                                >
                                    <div className="w-32 h-20 bg-gray-800 rounded-md overflow-hidden relative flex-shrink-0">
                                        {result.thumbnailUrl ? (
                                            <img src={result.thumbnailUrl} alt={result.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                                <span className="text-xs text-gray-400">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold group-hover:text-primary transition-colors">{result.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                            <span className="capitalize">{result.type}</span>
                                            <span>•</span>
                                            <span>{result.year}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </>
                    )}

                    {searchQuery && results.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
                        </div>
                    )}

                    {!searchQuery && (
                        <div className="space-y-6">
                            {searchHistory.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Searches</h3>
                                        <button
                                            onClick={clearHistory}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {searchHistory.map((query, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSearchQuery(query)}
                                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full text-sm transition-colors border border-gray-700"
                                            >
                                                {query}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recommended for You</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {allContent.slice(0, 4).map(item => (
                                        <a
                                            key={item.id}
                                            href={`/content/${item.id}`}
                                            onClick={onClose}
                                            className="group relative aspect-video rounded-lg overflow-hidden bg-gray-800"
                                        >
                                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black to-transparent">
                                                <p className="text-xs font-medium text-white line-clamp-1">{item.title}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
