"use client";

import { Filter, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
    genres: string[];
    years: [number, number];
    ratings: string[];
    types: string[];
    sortBy: string;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [yearRange, setYearRange] = useState<[number, number]>([1980, 2024]);
    const [sortBy, setSortBy] = useState("popular");

    const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Documentary", "Animation", "Fantasy"];
    const ratings = ["G", "PG", "PG-13", "R", "NC-17", "TV-Y", "TV-PG", "TV-14", "TV-MA"];
    const types = ["Movie", "TV Show", "Documentary", "Mini-Series"];
    const sortOptions = [
        { value: "popular", label: "Most Popular" },
        { value: "recent", label: "Recently Added" },
        { value: "rating", label: "Highest Rated" },
        { value: "az", label: "A-Z" },
        { value: "za", label: "Z-A" },
        { value: "year-new", label: "Newest First" },
        { value: "year-old", label: "Oldest First" }
    ];

    const toggleGenre = (genre: string) => {
        const updated = selectedGenres.includes(genre)
            ? selectedGenres.filter(g => g !== genre)
            : [...selectedGenres, genre];
        setSelectedGenres(updated);
        applyFilters({ genres: updated });
    };

    const toggleRating = (rating: string) => {
        const updated = selectedRatings.includes(rating)
            ? selectedRatings.filter(r => r !== rating)
            : [...selectedRatings, rating];
        setSelectedRatings(updated);
        applyFilters({ ratings: updated });
    };

    const toggleType = (type: string) => {
        const updated = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type];
        setSelectedTypes(updated);
        applyFilters({ types: updated });
    };

    const applyFilters = (updates: Partial<FilterOptions> = {}) => {
        onFilterChange({
            genres: updates.genres ?? selectedGenres,
            years: updates.years ?? yearRange,
            ratings: updates.ratings ?? selectedRatings,
            types: updates.types ?? selectedTypes,
            sortBy: updates.sortBy ?? sortBy
        });
    };

    const clearAll = () => {
        setSelectedGenres([]);
        setSelectedRatings([]);
        setSelectedTypes([]);
        setYearRange([1980, 2024]);
        setSortBy("popular");
        onFilterChange({
            genres: [],
            years: [1980, 2024],
            ratings: [],
            types: [],
            sortBy: "popular"
        });
    };

    const activeFilterCount = selectedGenres.length + selectedRatings.length + selectedTypes.length;

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-4 top-24 z-40 bg-card border border-border hover:bg-card/80 p-3 rounded-lg shadow-lg transition-colors flex items-center gap-2"
            >
                <SlidersHorizontal className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium text-foreground">Filters</span>
                {activeFilterCount > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {/* Sidebar */}
            <div className={cn(
                "fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 overflow-y-auto",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Filter className="w-6 h-6 text-primary" />
                            <h2 className="text-xl font-bold text-foreground">Filters</h2>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Clear All */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="w-full mb-4 text-sm text-primary hover:text-primary/80 transition-colors text-left"
                        >
                            Clear all filters ({activeFilterCount})
                        </button>
                    )}

                    {/* Sort By */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Sort By</h3>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                applyFilters({ sortBy: e.target.value });
                            }}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Content Type */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Content Type</h3>
                        <div className="flex flex-wrap gap-2">
                            {types.map(type => (
                                <button
                                    key={type}
                                    onClick={() => toggleType(type)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                        selectedTypes.includes(type)
                                            ? "bg-primary text-white"
                                            : "bg-background border border-border text-muted-foreground hover:border-primary"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => toggleGenre(genre)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                        selectedGenres.includes(genre)
                                            ? "bg-primary text-white"
                                            : "bg-background border border-border text-muted-foreground hover:border-primary"
                                    )}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Range */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Year Range</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={yearRange[0]}
                                    onChange={(e) => {
                                        const newRange: [number, number] = [parseInt(e.target.value), yearRange[1]];
                                        setYearRange(newRange);
                                        applyFilters({ years: newRange });
                                    }}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                                    min="1900"
                                    max="2024"
                                />
                                <span className="text-muted-foreground">to</span>
                                <input
                                    type="number"
                                    value={yearRange[1]}
                                    onChange={(e) => {
                                        const newRange: [number, number] = [yearRange[0], parseInt(e.target.value)];
                                        setYearRange(newRange);
                                        applyFilters({ years: newRange });
                                    }}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                                    min="1900"
                                    max="2024"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ratings */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Age Rating</h3>
                        <div className="flex flex-wrap gap-2">
                            {ratings.map(rating => (
                                <button
                                    key={rating}
                                    onClick={() => toggleRating(rating)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                                        selectedRatings.includes(rating)
                                            ? "bg-primary text-white"
                                            : "bg-background border border-border text-muted-foreground hover:border-primary"
                                    )}
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
