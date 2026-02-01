"use client";

import { X, Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, RotateCcw, Subtitles, Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EnhancedVideoPlayerProps {
    isOpen: boolean;
    onClose: () => void;
    contentId?: string;
    title?: string;
    thumbnailUrl?: string;
    videoUrl?: string; // Add this
}

export function EnhancedVideoPlayer({ isOpen, onClose, contentId = "", title = "", thumbnailUrl = "", videoUrl }: EnhancedVideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1); // 0 to 1 for video element
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [quality, setQuality] = useState("1080p");
    const [showSettings, setShowSettings] = useState(false);
    const [showSubtitles, setShowSubtitles] = useState(false);
    const [selectedSubtitle, setSelectedSubtitle] = useState("English");
    const [isLoading, setIsLoading] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setIsPlaying(false);
            setCurrentTime(0);
            return;
        }
        setIsLoading(true);
    }, [isOpen]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => console.error("Play failed:", e));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
            // Auto play when loaded
            setIsPlaying(true);
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
        saveProgress(contentId, duration, duration);
    };

    // Save progress periodically
    useEffect(() => {
        if (!isOpen || !isPlaying) return;
        const interval = setInterval(() => {
            saveProgress(contentId, currentTime, duration);
        }, 5000); // Save every 5 seconds
        return () => clearInterval(interval);
    }, [isOpen, isPlaying, currentTime, duration, contentId]);


    const saveProgress = (id: string, time: number, total: number) => {
        if (!id || total === 0) return;

        const progress = {
            contentId: id,
            currentTime: time,
            duration: total,
            percentage: (time / total) * 100,
            timestamp: Date.now(),
            title: title,
            thumbnailUrl: thumbnailUrl
        };

        const continueWatching = JSON.parse(localStorage.getItem('continueWatching') || '[]');
        const existingIndex = continueWatching.findIndex((item: any) => item.contentId === id);

        if (existingIndex >= 0) {
            continueWatching[existingIndex] = progress;
        } else {
            continueWatching.unshift(progress);
        }

        localStorage.setItem('continueWatching', JSON.stringify(continueWatching.slice(0, 20)));
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePlayPause = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    const skipForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
        }
    };

    const skipBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current || !videoRef.current) return;
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = duration * percent;
        setCurrentTime(duration * percent);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) / 100;
        setVolume(val);
        setIsMuted(false);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const [isChangingQuality, setIsChangingQuality] = useState(false);

    // ...

    const handleQualityChange = (newQuality: string) => {
        if (quality === newQuality) return;

        setShowSettings(false);
        setIsChangingQuality(true);
        if (videoRef.current) {
            videoRef.current.pause();
        }

        // Simulate network buffering for quality switch
        setTimeout(() => {
            setQuality(newQuality);
            setIsChangingQuality(false);
            if (videoRef.current) {
                videoRef.current.play();
            }
        }, 1500);
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            videoRef.current.parentElement?.requestFullscreen();
        }
    };

    const toggleSettings = () => {
        if (!showSettings) setShowSubtitles(false);
        setShowSettings(!showSettings);
    };

    const toggleSubtitles = () => {
        if (!showSubtitles) setShowSettings(false);
        setShowSubtitles(!showSubtitles);
    };

    // Keyboard Shortcuts
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent scrolling for space and arrow keys
            if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    togglePlayPause();
                    break;
                case "arrowright":
                case "l":
                    skipForward();
                    break;
                case "arrowleft":
                case "j":
                    skipBackward();
                    break;
                case "arrowup":
                    setVolume(prev => Math.min(prev + 0.1, 1));
                    setIsMuted(false);
                    break;
                case "arrowdown":
                    setVolume(prev => Math.max(prev - 0.1, 0));
                    setIsMuted(false);
                    break;
                case "f":
                    toggleFullscreen();
                    break;
                case "m":
                    toggleMute();
                    break;
                case "escape":
                    onClose();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isPlaying, isMuted, volume, duration]); // Depend on state used in handlers if necessary, though refs are better for values

    // ... (rest of the functions)

    const handleDownload = () => {
        if (!videoUrl) return;

        // Trigger browser download
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = title || 'video';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Add to Download Manager
        const downloads = JSON.parse(localStorage.getItem('downloads') || '[]');

        // Check if already downloading
        if (!downloads.find((d: any) => d.id === contentId)) {
            const newDownload = {
                id: contentId,
                title: title,
                quality: quality,
                size: "Unknown",
                progress: 0,
                status: "downloading",
                thumbnail: thumbnailUrl
            };
            downloads.push(newDownload);
            localStorage.setItem('downloads', JSON.stringify(downloads));

            // Simulate download progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                newDownload.progress = progress;
                if (progress >= 100) {
                    newDownload.status = "completed";
                    clearInterval(interval);
                }
                // Update storage
                const currentDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
                const index = currentDownloads.findIndex((d: any) => d.id === contentId);
                if (index !== -1) {
                    currentDownloads[index] = newDownload;
                    localStorage.setItem('downloads', JSON.stringify(currentDownloads));
                }
            }, 500);
        }
    };

    if (!isOpen) return null;

    const qualities = ["4K", "1080p", "720p", "480p", "Auto"];
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const subtitleOptions = ["Off", "English", "Spanish", "French", "German", "Japanese"];

    return (
        <div className="fixed inset-0 z-50 bg-background">
            {/* Video Area */}
            <div
                className="relative w-full h-full bg-black flex items-center justify-center cursor-default"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowControls(false)}
            >
                {videoUrl ? (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleVideoEnded}
                        onClick={togglePlayPause}
                        poster={thumbnailUrl}
                    />
                ) : (
                    /* Fallback for when no video URL is present */
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <p className="text-white text-xl mb-2">{title}</p>
                            <p className="text-destructive">Video content unavailable</p>
                        </div>
                    </div>
                )}

                {(isLoading || isChangingQuality) && videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            {isChangingQuality && <p className="text-white font-medium">Changing Quality...</p>}
                        </div>
                    </div>
                )}


                {/* Close Button */}
                <button
                    onClick={() => {
                        setIsPlaying(false);
                        onClose();
                    }}
                    className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-black/80 backdrop-blur-sm p-3 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Controls Overlay */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 transition-opacity duration-300 z-30",
                    showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    {/* ... Progress Bar ... */}
                    <div className="mb-4">
                        <div
                            ref={progressRef}
                            className="w-full h-2 bg-gray-700 rounded-full cursor-pointer hover:h-3 transition-all group"
                            onClick={handleProgressClick}
                        >
                            <div
                                className="h-full bg-primary rounded-full relative group-hover:bg-primary/90 transition-colors"
                                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Left Controls */}
                        <div className="flex items-center gap-4">
                            <button onClick={togglePlayPause} className="text-white hover:text-primary transition-colors">
                                {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white" />}
                            </button>

                            <button onClick={skipBackward} className="text-white hover:text-primary transition-colors">
                                <RotateCcw className="w-6 h-6" />
                            </button>

                            <button onClick={skipForward} className="text-white hover:text-primary transition-colors">
                                <SkipForward className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-2">
                                <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume * 100}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={toggleSettings}
                                    className={cn("text-white hover:text-primary transition-colors", showSettings && "text-primary")}
                                >
                                    <Settings className="w-6 h-6" />
                                </button>

                                {showSettings && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg p-4 w-64 shadow-xl">
                                        <div className="mb-4">
                                            <p className="text-white text-sm font-semibold mb-2">Quality</p>
                                            <div className="space-y-1">
                                                {qualities.map(q => (
                                                    <button
                                                        key={q}
                                                        onClick={() => handleQualityChange(q)}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                                                            quality === q ? "bg-primary text-white" : "text-gray-300 hover:bg-secondary/20"
                                                        )}
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-white text-sm font-semibold mb-2">Playback Speed</p>
                                            <div className="space-y-1">
                                                {speeds.map(speed => (
                                                    <button
                                                        key={speed}
                                                        onClick={() => setPlaybackSpeed(speed)}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                                                            playbackSpeed === speed ? "bg-primary text-white" : "text-gray-300 hover:bg-secondary/20"
                                                        )}
                                                    >
                                                        {speed}x
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={toggleSubtitles}
                                    className={cn(
                                        "text-white hover:text-primary transition-colors",
                                        (showSubtitles || (selectedSubtitle !== "Off" && selectedSubtitle !== "None")) && "text-primary"
                                    )}
                                >
                                    <Subtitles className="w-6 h-6" />
                                </button>

                                {showSubtitles && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg p-3 w-48 shadow-xl">
                                        <p className="text-white text-sm font-semibold mb-2">Subtitles</p>
                                        <div className="space-y-1">
                                            {subtitleOptions.map(sub => (
                                                <button
                                                    key={sub}
                                                    onClick={() => {
                                                        setSelectedSubtitle(sub);
                                                        setShowSubtitles(false);
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                                                        selectedSubtitle === sub ? "bg-primary text-white" : "text-gray-300 hover:bg-secondary/20"
                                                    )}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleDownload}
                                className="text-white hover:text-primary transition-colors"
                            >
                                <Download className="w-6 h-6" />
                            </button>

                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-primary transition-colors"
                            >
                                <Maximize className="w-6 h-6" />
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

