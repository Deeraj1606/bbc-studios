"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, PlayCircle, CheckCircle, ArrowLeft, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadStore, type DownloadItem } from "@/lib/download-store";
import Link from "next/link";

export default function DownloadsPage() {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);

    useEffect(() => {
        const updateDownloads = () => {
            setDownloads(downloadStore.getDownloads());
        };

        updateDownloads();
        window.addEventListener("downloadsUpdated", updateDownloads);
        return () => window.removeEventListener("downloadsUpdated", updateDownloads);
    }, []);

    const removeDownload = (id: string) => {
        downloadStore.removeDownload(id);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">My Downloads</h1>
                            <p className="text-muted-foreground mt-1">
                                {downloads.length} items • Available offline
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {downloads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-card/50 border border-dashed border-border rounded-3xl">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                            <Download className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">No downloads yet</h2>
                        <p className="text-muted-foreground text-center max-w-sm mb-8">
                            Any movies or TV shows you download will appear here for you to watch later.
                        </p>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-transform active:scale-95"
                        >
                            Browse Content
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {downloads.map((download) => (
                            <div
                                key={download.id}
                                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl"
                            >
                                {/* Thumbnail Container */}
                                <div className="relative aspect-video bg-muted overflow-hidden">
                                    <img
                                        src={download.thumbnail}
                                        alt={download.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        {download.status === "completed" && (
                                            <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-transform">
                                                <PlayCircle className="w-6 h-6" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => removeDownload(download.id)}
                                            className="p-2 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* Quality Badge */}
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white rounded uppercase tracking-wider">
                                        {download.quality}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-foreground mb-1 truncate">
                                        {download.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                        <span>{download.size}</span>
                                        <span>{new Date(download.addedAt).toLocaleDateString()}</span>
                                    </div>

                                    {/* Progress / Status */}
                                    {download.status === "downloading" ? (
                                        <div className="space-y-2">
                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500"
                                                    style={{ width: `${download.progress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-primary animate-pulse tracking-wide">Downloading...</span>
                                                <span className="text-muted-foreground">{download.progress}%</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-500 text-sm font-semibold">
                                            <CheckCircle className="w-4 h-4" />
                                            Available Offline
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
