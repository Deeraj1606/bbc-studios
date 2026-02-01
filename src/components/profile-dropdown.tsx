"use client";

import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";


export function ProfileDropdown() {
    const { user, signOut } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [imgError, setImgError] = useState(false);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const getAvatarColor = (email: string) => {
        const colors = [
            "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
            "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
        ];
        let hash = 0;
        const e = email || "guest@example.com";
        for (let i = 0; i < e.length; i++) {
            hash = e.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const userEmail = user?.email || "guest@example.com";

    return (
        <div ref={dropdownRef} className="group relative flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 cursor-pointer"
            >
                <div className={cn(
                    "w-8 h-8 rounded-md overflow-hidden flex items-center justify-center transition-all border border-white/10 shadow-sm",
                    (!user?.photoURL || imgError) && getAvatarColor(userEmail)
                )}>
                    {user?.photoURL && !imgError ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <span className="text-white text-sm font-bold">{userEmail.charAt(0).toUpperCase()}</span>
                    )}
                </div>
            </button>


            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-border bg-gradient-to-br from-white/5 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center border border-white/10 shadow-lg",
                                (!user?.photoURL || imgError) && getAvatarColor(userEmail)
                            )}>
                                {user?.photoURL && !imgError ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || "User"}
                                        className="w-full h-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <span className="text-white text-xl font-bold">{userEmail.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white font-bold truncate">{user?.displayName || userEmail.split('@')[0]}</p>
                                <p className="text-gray-400 text-xs truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>


                    <div className="py-2">
                        <Link
                            href="/account"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Account Settings</span>
                        </Link>
                        <Link
                            href="/help"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span>Help Center</span>
                        </Link>
                    </div>

                    <div className="border-t border-border py-2">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
