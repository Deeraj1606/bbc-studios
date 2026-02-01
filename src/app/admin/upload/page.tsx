"use client";

import { useState, useRef, useEffect } from "react";
import { AdminAuth } from "@/components/admin-auth";
import { Upload, Film, Image as ImageIcon, X, Check, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GENRES = [
    "Action", "Adventure", "Animation", "Comedy", "Crime",
    "Documentary", "Drama", "Family", "Fantasy", "History",
    "Horror", "Music", "Mystery", "Romance", "Sci-Fi",
    "Thriller", "War", "Western"
];

const RATINGS = ["G", "PG", "PG-13", "R", "NC-17", "U", "UA", "A"];

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    preview?: string;
}

export default function AdminUploadPage() {
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [videoFile, setVideoFile] = useState<UploadedFile | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<UploadedFile | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        year: new Date().getFullYear().toString(),
        duration: "",
        rating: "PG",
        type: "movie",
        director: "",
        musicDirector: "",
        cast: ""
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [actualVideoFile, setActualVideoFile] = useState<File | null>(null);
    const [actualThumbnailFile, setActualThumbnailFile] = useState<File | null>(null);

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setActualVideoFile(file);
            setVideoFile({
                name: file.name,
                size: file.size,
                type: file.type,
            });

            // Auto-detect duration
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;
                const hrs = Math.floor(duration / 3600);
                const mins = Math.floor((duration % 3600) / 60);
                const secs = Math.floor(duration % 60);

                let timeStr = "";
                if (hrs > 0) timeStr += `${hrs}h `;
                if (mins > 0) timeStr += `${mins}m `;
                if (secs > 0 && hrs === 0) timeStr += `${secs}s`;

                setFormData(prev => ({ ...prev, duration: timeStr.trim() }));
            };
            video.src = URL.createObjectURL(file);
        }
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setActualThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailFile({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: reader.result as string,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setUploadError("");

        try {
            if (!actualVideoFile || !actualThumbnailFile) {
                throw new Error("Please select both video and thumbnail files");
            }
            if (selectedGenres.length === 0) {
                throw new Error("Please select at least one genre");
            }

            const uploadFormData = new FormData();
            uploadFormData.append('video', actualVideoFile);
            uploadFormData.append('thumbnail', actualThumbnailFile);
            uploadFormData.append('title', formData.title);
            uploadFormData.append('description', formData.description);
            uploadFormData.append('genre', selectedGenres.join(', '));
            uploadFormData.append('year', formData.year);
            uploadFormData.append('duration', formData.duration);
            uploadFormData.append('rating', formData.rating);
            uploadFormData.append('type', formData.type);
            uploadFormData.append('director', formData.director);
            uploadFormData.append('cast', formData.cast);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            setIsUploading(false);
            setUploadSuccess(true);

            setTimeout(() => {
                setUploadSuccess(false);
                setVideoFile(null);
                setThumbnailFile(null);
                setActualVideoFile(null);
                setActualThumbnailFile(null);
                setSelectedGenres([]);
                setFormData({
                    title: "",
                    description: "",
                    year: new Date().getFullYear().toString(),
                    duration: "",
                    rating: "PG",
                    type: "movie",
                    director: "",
                    musicDirector: "",
                    cast: ""
                });
            }, 3000);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed');
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    return (
        <AdminAuth>
            <div className="min-h-screen bg-background pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Upload Content</h1>
                            <p className="text-gray-400">Add new premium content to the BBC Studios catalog</p>
                        </div>
                    </div>

                    {uploadSuccess && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-500" />
                            <p className="text-green-500 font-medium">Content uploaded successfully!</p>
                        </div>
                    )}

                    {uploadError && (
                        <div className="mb-6 p-4 bg-destructive/20 border border-destructive rounded-lg flex items-center gap-3">
                            <X className="w-5 h-5 text-destructive" />
                            <p className="text-destructive font-medium">{uploadError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Media Upload */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Video */}
                            <div className="bg-card border border-border rounded-xl p-5">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Film className="w-5 h-5 text-primary" />
                                    Video File
                                </h2>
                                {!videoFile ? (
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/50 transition-colors bg-muted/30">
                                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                            <p className="text-white text-sm font-medium mb-1">Upload Video</p>
                                            <p className="text-xs text-gray-500">MP4, MOV (Max 5GB)</p>
                                        </div>
                                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="p-4 bg-background border border-border rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Film className="w-6 h-6 text-primary flex-shrink-0" />
                                            <div className="overflow-hidden">
                                                <p className="text-white text-sm font-medium truncate">{videoFile.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(videoFile.size)}</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setVideoFile(null)} className="text-gray-500 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail */}
                            <div className="bg-card border border-border rounded-xl p-5">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    Thumbnail
                                </h2>
                                {!thumbnailFile ? (
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/50 transition-colors bg-muted/30">
                                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                            <p className="text-white text-sm font-medium mb-1">Upload Poster</p>
                                            <p className="text-xs text-gray-500">1920x1080 Recommended</p>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                                    </label>
                                ) : (
                                    <div className="space-y-3">
                                        <img src={thumbnailFile.preview} alt="Preview" className="w-full aspect-video object-cover rounded-lg" />
                                        <div className="p-3 bg-background border border-border rounded-lg flex items-center justify-between">
                                            <p className="text-white text-xs truncate max-w-[150px]">{thumbnailFile.name}</p>
                                            <button type="button" onClick={() => setThumbnailFile(null)} className="text-gray-500 hover:text-white">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-6 border-b border-border pb-4">Metadata Details</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Content Type</label>
                                            <select
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="movie">Movie</option>
                                                <option value="tv-show">TV Show</option>
                                                <option value="documentary">Documentary</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="e.g., Inception"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                        <textarea
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white h-24 resize-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="Write a compelling synopsis..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Release Year</label>
                                            <input
                                                type="number"
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                value={formData.year}
                                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> Duration
                                            </label>
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="Auto-detected"
                                                value={formData.duration}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Maturity Rating</label>
                                            <select
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                value={formData.rating}
                                                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                            >
                                                {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                                            <Tag className="w-4 h-4" /> Genres
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {GENRES.map(genre => (
                                                <button
                                                    key={genre}
                                                    type="button"
                                                    onClick={() => toggleGenre(genre)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                                                        selectedGenres.includes(genre)
                                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                            : "bg-muted/50 border-border text-gray-400 hover:border-gray-500"
                                                    )}
                                                >
                                                    {genre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Director</label>
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="Full name"
                                                value={formData.director}
                                                onChange={e => setFormData({ ...formData, director: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Cast (comma separated)</label>
                                            <input
                                                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="Actor 1, Actor 2..."
                                                value={formData.cast}
                                                onChange={e => setFormData({ ...formData, cast: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20"
                                disabled={isUploading || !videoFile || !thumbnailFile}
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 mr-3" />
                                        Publish Content
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminAuth>
    );
}
