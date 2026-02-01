"use client";

import { useState, useEffect } from "react";
import { AdminAuth } from "@/components/admin-auth";
import { Plus, Trash2, Edit, X, Upload, User, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Actor {
    id: string;
    name: string;
    bio: string;
    imageUrl: string;
}

export default function AdminActorsPage() {
    const [actors, setActors] = useState<Actor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentActor, setCurrentActor] = useState<Partial<Actor> | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        try {
            const response = await fetch("/api/actors");
            const data = await response.json();
            setActors(data);
        } catch (error) {
            console.error("Error fetching actors:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        const formData = new FormData();
        if (currentActor?.id) formData.append("id", currentActor.id);
        formData.append("name", currentActor?.name || "");
        formData.append("bio", currentActor?.bio || "");
        if (imageFile) {
            formData.append("image", imageFile);
        } else if (currentActor?.imageUrl) {
            formData.append("imageUrl", currentActor.imageUrl);
        }

        try {
            const response = await fetch("/api/actors", {
                method: currentActor?.id ? "PUT" : "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage({ type: "success", text: `Actor ${currentActor?.id ? "updated" : "added"} successfully!` });
                setIsEditing(false);
                setCurrentActor(null);
                setImageFile(null);
                setImagePreview("");
                fetchActors();
            } else {
                throw new Error("Failed to save actor");
            }
        } catch (error) {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (actor: Actor) => {
        setCurrentActor(actor);
        setImagePreview(actor.imageUrl);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this actor?")) return;

        try {
            const response = await fetch(`/api/actors?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setActors(actors.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error("Error deleting actor:", error);
        }
    };

    return (
        <AdminAuth>
            <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Manage Actors</h1>
                            <p className="text-muted-foreground">Add or edit actors for your movies and shows</p>
                        </div>
                        <Button className="gap-2" onClick={() => {
                            setIsEditing(true);
                            setCurrentActor({ name: "", bio: "" });
                            setImagePreview("");
                            setImageFile(null);
                        }}>
                            <Plus className="w-5 h-5" />
                            Add New Actor
                        </Button>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success" ? "bg-green-500/20 border border-green-500 text-green-500" : "bg-destructive/20 border border-destructive text-destructive"
                            }`}>
                            {message.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                            <p className="font-medium">{message.text}</p>
                        </div>
                    )}

                    {isEditing && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <div className="bg-card border border-border rounded-xl w-full max-w-xl shadow-2xl overflow-hidden">
                                <div className="p-6 border-b border-border flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">{currentActor?.id ? "Edit Actor" : "Add Actor"}</h2>
                                    <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                                            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border group">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                        <User className="w-12 h-12 mb-2" />
                                                        <span className="text-xs">No image</span>
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                                    <Upload className="w-6 h-6 text-white" />
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                                                <Input
                                                    required
                                                    value={currentActor?.name || ""}
                                                    onChange={e => setCurrentActor({ ...currentActor!, name: e.target.value })}
                                                    placeholder="Actor name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                                                <textarea
                                                    className="w-full bg-background border border-border rounded-md px-4 py-2 text-white h-32 resize-none"
                                                    value={currentActor?.bio || ""}
                                                    onChange={e => setCurrentActor({ ...currentActor!, bio: e.target.value })}
                                                    placeholder="Actor biography..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                            {isSubmitting ? "Saving..." : "Save Actor"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-card/50 rounded-xl animate-pulse" />
                            ))
                        ) : actors.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                                <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No actors found. Start by adding one!</p>
                            </div>
                        ) : (
                            actors.map(actor => (
                                <div key={actor.id} className="bg-card border border-border rounded-xl overflow-hidden group shadow-lg hover:shadow-primary/5 transition-all">
                                    <div className="aspect-square relative overflow-hidden">
                                        {actor.imageUrl ? (
                                            <img src={actor.imageUrl} alt={actor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center text-gray-500">
                                                <User className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Link href={`/actors/${encodeURIComponent(actor.name)}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="bg-white/10 text-white hover:bg-white/20">
                                                    <ExternalLink className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="bg-white/10 text-white hover:bg-white/20" onClick={() => handleEdit(actor)}>
                                                <Edit className="w-5 h-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="bg-destructive/20 text-destructive hover:bg-destructive/40" onClick={() => handleDelete(actor.id)}>
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-bold text-white truncate">{actor.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{actor.bio || "No bio available"}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminAuth>
    );
}
