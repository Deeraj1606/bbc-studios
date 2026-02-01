"use client";

import { Download, Trash2, PlayCircle, CheckCircle, Loader, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { downloadStore, type DownloadItem } from "@/lib/download-store";

export function DownloadManager() {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [showManager, setShowManager] = useState(false);

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

    const playDownload = (id: string) => {
        console.log("Playing download:", id);
        // In a real app, this would open the video player with local source
    };

    const activeDownloads = downloads.filter(d => d.status === "downloading").length;
    const completedDownloads = downloads.filter(d => d.status === "completed").length;

    if (!showManager && downloads.length === 0) return null;

    return (
        <>
            {/* Floating Download Button */}
            {downloads.length > 0 && !showManager && (
                <button
                    onClick={() => setShowManager(true)}
                    className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 transition-transform hover:scale-105 border border-primary/20"
                >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">
                        Downloads {activeDownloads > 0 && `(${activeDownloads})`}
                    </span>
                    {activeDownloads > 0 && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                </button>
            )}

            {/* Download Manager Modal */}
            {showManager && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground tracking-tight">Downloads</h2>
                                <p className="text-sm text-muted-foreground">
                                    {completedDownloads} completed • {activeDownloads} in progress
                                </p>
                            </div>
                            <button
                                onClick={() => setShowManager(false)}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Downloads List */}
                        <div className="overflow-y-auto flex-1 p-4">
                            {downloads.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Download className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">No downloads yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {downloads.map(download => (
                                        <div
                                            key={download.id}
                                            className="group relative bg-muted/30 border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Thumbnail */}
                                                <div className="w-28 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative group-hover:ring-2 ring-primary/20 transition-all">
                                                    <img
                                                        src={download.thumbnail}
                                                        alt={download.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {download.status === "completed" && (
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <PlayCircle className="w-8 h-8 text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-foreground truncate text-base leading-tight">
                                                        {download.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground uppercase font-medium">
                                                            {download.quality}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {download.size}
                                                        </span>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    {download.status === "downloading" && (
                                                        <div className="mt-3">
                                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary transition-all duration-500 ease-out"
                                                                    style={{ width: `${download.progress}%` }}
                                                                />
                                                            </div>
                                                            <div className="flex justify-between mt-1">
                                                                <span className="text-[10px] text-primary font-medium">
                                                                    Downloading...
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    {download.progress}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Status Badge */}
                                                    {download.status === "completed" && (
                                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-500 font-medium">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Ready to watch
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1">
                                                    {download.status === "completed" && (
                                                        <button
                                                            onClick={() => playDownload(download.id)}
                                                            className="p-2.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                            title="Play"
                                                        >
                                                            <PlayCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeDownload(download.id)}
                                                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                        title="Remove"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        {downloads.length > 0 && (
                            <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                    {downloads.length} items total
                                </span>
                                <button
                                    onClick={() => {
                                        downloads.forEach(d => downloadStore.removeDownload(d.id));
                                    }}
                                    className="text-xs font-medium text-destructive hover:underline transition-all"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
