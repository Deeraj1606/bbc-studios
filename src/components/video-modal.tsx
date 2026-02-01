"use client";

import { X, Play, Plus, ThumbsUp, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function VideoModal({ isOpen, onClose, title = "Content Title", description = "Content description goes here..." }: VideoModalProps) {
    const [isMuted, setIsMuted] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl bg-background rounded-lg overflow-hidden shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {/* Video Player Area */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
                    {/* Placeholder for video */}
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <Play className="w-20 h-20 text-white/50 mx-auto mb-4" />
                            <p className="text-white/70">Video Player Placeholder</p>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-background/70 transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                    </button>
                </div>

                {/* Content Info */}
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <span className="text-green-500 font-semibold">98% Match</span>
                                <span>2024</span>
                                <span className="px-2 py-0.5 border border-gray-500 rounded">HD</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <Button size="lg" className="bg-white text-black hover:bg-white/90">
                            <Play className="w-5 h-5 mr-2 fill-black" /> Play
                        </Button>
                        <Button size="lg" variant="secondary" className="bg-gray-700 hover:bg-gray-600">
                            <Plus className="w-5 h-5 mr-2" /> My List
                        </Button>
                        <Button size="lg" variant="secondary" className="bg-gray-700 hover:bg-gray-600">
                            <ThumbsUp className="w-5 h-5" />
                        </Button>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                        {description}
                    </p>

                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-gray-400 mb-1">Cast:</p>
                            <p className="text-white">John Doe, Jane Smith, Alex Johnson</p>
                        </div>
                        <div>
                            <p className="text-gray-400 mb-1">Genres:</p>
                            <p className="text-white">Action, Sci-Fi, Thriller</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
