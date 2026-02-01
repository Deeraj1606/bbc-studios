"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit, Plus, Search, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AdminAuth } from "@/components/admin-auth";

export default function ManageContentPage() {
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch("/api/content");
            const data = await response.json();
            setContent(data);
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this content?")) return;

        try {
            const response = await fetch(`/api/content/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setContent(content.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    };

    const filteredContent = content.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.genre.some((g: string) => g.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminAuth>
            <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Manage Content</h1>
                            <p className="text-muted-foreground">Add, edit, or remove movies and shows</p>
                        </div>
                        <Link href="/admin/upload">
                            <Button className="gap-2">
                                <Plus className="w-5 h-5" />
                                Add New Content
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-border bg-card/50">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search content..."
                                    className="pl-10 bg-background border-border"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50 text-muted-foreground text-sm font-medium">
                                        <th className="px-6 py-4">Thumbnail</th>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Year</th>
                                        <th className="px-6 py-4">Rating</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                Loading content...
                                            </td>
                                        </tr>
                                    ) : filteredContent.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                                <Film className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                No content found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredContent.map((item) => (
                                            <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="w-20 aspect-video rounded-md overflow-hidden bg-gray-900 shadow-lg border border-white/5">
                                                        <img
                                                            src={item.thumbnailUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-white">{item.title}</div>
                                                    <div className="text-xs text-muted-foreground line-clamp-1">{item.genre.join(", ")}</div>
                                                </td>
                                                <td className="px-6 py-4 capitalize text-sm">{item.type}</td>
                                                <td className="px-6 py-4 text-sm">{item.year}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded font-bold border border-primary/20">
                                                        {item.rating || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link href={`/admin/edit/${item.id}`}>
                                                        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                                                            <Edit className="w-5 h-5" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuth>
    );
}
