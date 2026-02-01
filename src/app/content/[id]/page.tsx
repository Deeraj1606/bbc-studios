"use client";

import { useState, useEffect } from "react";
import { Play, Plus, Check, Share2, Info, Star, Clock, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { EnhancedVideoPlayer } from "@/components/enhanced-video-player";
import { RatingsReviews } from "@/components/ratings-reviews";
import { SocialShare } from "@/components/social-share";
import { ContentGrid } from "@/components/content-grid";
import { useWatchlist } from "@/contexts/watchlist-context";
import { cn } from "@/lib/utils";
import { downloadStore } from "@/lib/download-store";

interface ContentItem {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    year: number;
    rating: string;
    director: string;
    musicDirector?: string;
    cast: string[];
    genre: string[];
    duration: string;
    type: string;
    maturityRating?: number;
    awards?: string[];
    language?: string;
    subtitles?: string[];
    views: number;
    uploadedAt: string;
}

export default function ContentDetailPage() {
    const params = useParams() as { id: string };
    const [content, setContent] = useState<ContentItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showPlayer, setShowPlayer] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

    useEffect(() => {
        const fetchRecommendations = async (currentContent: ContentItem) => {
            try {
                const response = await fetch('/api/content');
                const allContent: ContentItem[] = await response.json();

                // Score similarity
                const scored = allContent
                    .filter(item => item.id !== currentContent.id)
                    .map(item => {
                        let score = 0;
                        // Genre overlap (+3 per genre)
                        const genreOverlap = item.genre.filter(g => currentContent.genre.includes(g));
                        score += genreOverlap.length * 3;

                        // Director overlap (+2)
                        if (item.director === currentContent.director) score += 2;

                        // Cast overlap (+1 per member)
                        const castOverlap = item.cast.filter(c => currentContent.cast.includes(c));
                        score += castOverlap.length * 1;

                        return { ...item, similarityScore: score };
                    })
                    .filter(item => item.similarityScore > 0)
                    .sort((a, b) => (b as any).similarityScore - (a as any).similarityScore)
                    .slice(0, 10);

                setRecommendations(scored);
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
            }
        };

        const fetchContent = async () => {
            try {
                const response = await fetch(`/api/content/${params.id}`);
                if (!response.ok) throw new Error("Content not found");
                const data = await response.json();
                setContent(data);
                fetchRecommendations(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load content.");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchContent();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
                <p className="text-gray-400 mb-6">{error || "The content you are looking for does not exist."}</p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
        );
    }

    const contentInWatchlist = isInWatchlist(content.id);

    const toggleWatchlist = () => {
        if (contentInWatchlist) {
            removeFromWatchlist(content.id);
        } else {
            addToWatchlist({
                contentId: content.id,
                title: content.title,
                type: content.type,
                thumbnailUrl: content.thumbnailUrl,
                year: content.year,
                rating: content.rating,
                duration: content.duration,
                genre: content.genre
            });
        }
    };

    const handleDownload = () => {
        if (!content) return;
        downloadStore.addDownload({
            id: content.id,
            title: content.title,
            thumbnail: content.thumbnailUrl,
            size: "1.2 GB",
            quality: "1080p",
        });
    };

    return (
        <>
            <main className="min-h-screen bg-background">
                {/* Hero Section with Backdrop */}
                <div className="relative h-[70vh] w-full overflow-hidden">
                    <img
                        src={content.thumbnailUrl}
                        alt={content.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />

                    {/* Content Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                                {content.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-primary fill-primary" />
                                    <span className="text-white font-semibold">{content.maturityRating || "7.5"}/10</span>
                                </div>
                                <span>{content.year}</span>
                                <span className="bg-secondary/80 px-2 py-1 rounded text-white">{content.rating}</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {content.duration}
                                </span>
                                <span>{content.genre.join(", ")}</span>
                            </div>

                            {showInfo && (
                                <p className="text-gray-300 text-lg mb-6 leading-relaxed line-clamp-3">
                                    {content.description}
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => setShowPlayer(true)}
                                    className="h-14 px-8 text-lg gap-3 bg-primary hover:bg-primary/90"
                                >
                                    <Play className="w-6 h-6 fill-white" />
                                    Watch Now
                                </Button>

                                <Button
                                    size="lg"
                                    variant="secondary"
                                    onClick={toggleWatchlist}
                                    className="h-14 px-8 gap-3"
                                >
                                    {contentInWatchlist ? (
                                        <>
                                            <Check className="w-6 h-6" />
                                            In My List
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-6 h-6" />
                                            Add to List
                                        </>
                                    )}
                                </Button>

                                <SocialShare title={content.title} />

                                <Button
                                    size="lg"
                                    variant="secondary"
                                    onClick={handleDownload}
                                    className="h-14 px-8 gap-3"
                                >
                                    <Download className="w-6 h-6" />
                                    Download
                                </Button>

                                <Button
                                    size="lg"
                                    variant="ghost"
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="h-14 w-14 p-0 rounded-full border-2 border-gray-500 hover:border-primary"
                                >
                                    <Info className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="px-4 md:px-12 py-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Full Description */}
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {content.description}
                                </p>
                            </div>

                            {/* Cast & Crew */}
                            {content.cast && content.cast.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-3">Cast</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {content.cast.map((actor, i) => (
                                            <a
                                                key={i}
                                                href={`/actors/${encodeURIComponent(actor)}`}
                                                className="bg-card border border-border px-4 py-2 rounded-lg text-sm text-foreground hover:border-primary transition-colors cursor-pointer"
                                            >
                                                {actor}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Awards */}
                            {content.awards && content.awards.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-3">Awards & Recognition</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {content.awards.map((award, i) => (
                                            <div
                                                key={i}
                                                className="bg-primary/10 border border-primary px-4 py-2 rounded-lg flex items-center gap-2"
                                            >
                                                <Star className="w-4 h-4 text-primary fill-primary" />
                                                <span className="text-sm text-foreground">{award}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ratings & Reviews */}
                            <RatingsReviews contentId={content.id} />
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Director</p>
                                    <p className="text-foreground font-medium">{content.director}</p>
                                </div>
                                {content.musicDirector && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Music Director</p>
                                        <p className="text-foreground font-medium">{content.musicDirector}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Genre</p>
                                    <p className="text-foreground font-medium">{content.genre.join(", ")}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Language</p>
                                    <p className="text-foreground font-medium">{content.language || "English"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Subtitles</p>
                                    <p className="text-foreground font-medium text-sm">
                                        {content.subtitles ? content.subtitles.join(", ") : "English"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Release Year</p>
                                    <p className="text-foreground font-medium">{content.year}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Maturity Rating</p>
                                    <p className="text-foreground font-medium">{content.rating}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16">
                        <ContentGrid
                            title="More Like This"
                            layout="grid"
                            initialItems={recommendations}
                        />
                    </div>
                </div>
            </main>

            {/* Video Player Modal */}
            <EnhancedVideoPlayer
                isOpen={showPlayer}
                onClose={() => setShowPlayer(false)}
                contentId={content.id}
                title={content.title}
                thumbnailUrl={content.thumbnailUrl}
                videoUrl={content.videoUrl}
            />
        </>
    );
}
