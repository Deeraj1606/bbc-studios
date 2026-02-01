"use client";

import { Share2, Facebook, Twitter, Link as LinkIcon, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SocialShareProps {
    title: string;
    url?: string;
}

export function SocialShare({ title, url = window.location.href }: SocialShareProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareOptions = [
        {
            name: "Facebook",
            icon: Facebook,
            color: "hover:bg-blue-600",
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "hover:bg-sky-500",
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
        },
        {
            name: "WhatsApp",
            icon: MessageCircle,
            color: "hover:bg-green-600",
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')
        },
        {
            name: "Email",
            icon: Mail,
            color: "hover:bg-gray-600",
            action: () => window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
        },
        {
            name: "Copy Link",
            icon: LinkIcon,
            color: "hover:bg-primary",
            action: () => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-xl p-3 min-w-[200px] z-50">
                        <p className="text-sm font-semibold text-foreground mb-3">Share via</p>
                        <div className="space-y-1">
                            {shareOptions.map(option => (
                                <button
                                    key={option.name}
                                    onClick={() => {
                                        option.action();
                                        if (option.name !== "Copy Link") {
                                            setShowMenu(false);
                                        }
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-foreground",
                                        option.color
                                    )}
                                >
                                    <option.icon className="w-5 h-5" />
                                    <span className="text-sm">
                                        {option.name === "Copy Link" && copied ? "Copied!" : option.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
