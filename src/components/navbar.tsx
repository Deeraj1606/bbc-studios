"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Film, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search-modal";
import { UserProfiles } from "@/components/user-profiles";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "TV Shows", href: "/tv-shows" },
    { label: "Movies", href: "/movies" },
    { label: "New & Popular", href: "/new-popular" },
    { label: "My List", href: "/my-list" },
    { label: "Downloads", href: "/downloads" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();
    const { isAdmin } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300",
                    isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-gradient-to-b from-background/90 to-transparent"
                )}
            >
                <div className="flex items-center justify-between px-4 py-4 md:px-12 flex-wrap gap-y-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex items-center">
                                <div className="bg-primary px-3 py-2 rounded-sm">
                                    <span className="text-2xl font-bold text-white tracking-tight">BBC</span>
                                </div>
                                <span className="ml-2 text-2xl font-light text-foreground tracking-wide">Studios</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {isAdmin && (
                                <div className="h-6 w-px bg-muted-foreground/20 mx-2" />
                            )}

                            {isAdmin && (
                                <div className="flex items-center gap-6">
                                    <Link
                                        href="/admin/manage"
                                        className={cn(
                                            "text-sm font-bold transition-colors hover:text-primary flex items-center gap-1.5",
                                            pathname.startsWith("/admin/manage") ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <Film className="w-4 h-4" /> Movies
                                    </Link>
                                    <Link
                                        href="/admin/actors"
                                        className={cn(
                                            "text-sm font-bold transition-colors hover:text-primary flex items-center gap-1.5",
                                            pathname.startsWith("/admin/actors") ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <User className="w-4 h-4" /> Actors
                                    </Link>
                                    <Link
                                        href="/admin/analytics"
                                        className={cn(
                                            "text-sm font-bold transition-colors hover:text-primary flex items-center gap-1.5",
                                            pathname.startsWith("/admin/analytics") ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>

                        <UserProfiles />
                    </div>
                </div>
            </nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
