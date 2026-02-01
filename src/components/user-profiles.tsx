"use client";

import { User, Settings, LogOut, Crown, History, Heart } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    plan: string;
    watchTime: number;
    favorites: number;
}

export function UserProfiles() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [activeProfile, setActiveProfile] = useState<string>("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [imgError, setImgError] = useState(false);

    const loadProfiles = useCallback(() => {
        const stored = localStorage.getItem('userProfiles');
        if (stored) {
            const data = JSON.parse(stored);
            setProfiles(data.profiles);
            setActiveProfile(data.active);
        } else {
            const defaultProfiles: UserProfile[] = [
                {
                    id: "1",
                    name: "User",
                    avatar: "👤",
                    plan: "Standard",
                    watchTime: 0,
                    favorites: 0
                }
            ];
            setProfiles(defaultProfiles);
            setActiveProfile("1");
            localStorage.setItem('userProfiles', JSON.stringify({
                profiles: defaultProfiles,
                active: "1"
            }));
        }
    }, []);

    useEffect(() => {
        const handleUpdate = () => {
            loadProfiles();
        };
        window.addEventListener("profileUpdated", handleUpdate);
        loadProfiles();
        return () => window.removeEventListener("profileUpdated", handleUpdate);
    }, [loadProfiles]);

    const switchProfile = (profileId: string) => {
        setActiveProfile(profileId);
        const data = { profiles, active: profileId };
        localStorage.setItem('userProfiles', JSON.stringify(data));
        setShowProfileMenu(false);
        window.dispatchEvent(new CustomEvent("profileUpdated"));
    };

    const currentProfile = profiles.find(p => p.id === activeProfile);
    const displayName = user?.displayName || currentProfile?.name || "User";
    const userEmail = user?.email || "guest@example.com";

    const getAvatarColor = (email: string) => {
        const colors = [
            "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
            "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
        ];
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            hash = email.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:text-primary transition-colors focus:outline-none"
            >
                <div className={cn(
                    "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-sm border border-white/10 shadow-sm transition-transform hover:scale-105",
                    (!user?.photoURL || imgError) && getAvatarColor(userEmail)
                )}>
                    {user?.photoURL && !imgError ? (
                        <img
                            src={user.photoURL}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        currentProfile?.avatar || userEmail.charAt(0).toUpperCase()
                    )}
                </div>
            </button>

            {showProfileMenu && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-xl w-80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Current Profile Info */}
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 border-b border-border">
                            <div className="flex flex-col items-center text-center mb-4">
                                <div className={cn(
                                    "w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-3xl border-2 border-white/10 shadow-2xl mb-3",
                                    (!user?.photoURL || imgError) && getAvatarColor(userEmail)
                                )}>
                                    {user?.photoURL && !imgError ? (
                                        <img
                                            src={user.photoURL}
                                            alt={displayName}
                                            className="w-full h-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        currentProfile?.avatar || userEmail.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
                                <p className="text-sm text-muted-foreground">{userEmail}</p>
                            </div>

                            <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                                    <Crown className="w-3.5 h-3.5" />
                                    <span>{currentProfile?.plan || "Standard"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-2">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <History className="w-4 h-4" />
                                        <span>Watch Time</span>
                                    </div>
                                    <p className="text-foreground font-semibold">{currentProfile?.watchTime}h</p>
                                </div>
                                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-2">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Heart className="w-4 h-4" />
                                        <span>Favorites</span>
                                    </div>
                                    <p className="text-foreground font-semibold">{currentProfile?.favorites}</p>
                                </div>
                            </div>
                        </div>

                        {/* Switch Profiles */}
                        <div className="p-3 border-b border-border">
                            <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">SWITCH PROFILE</p>
                            <div className="space-y-1">
                                {profiles.map(profile => (
                                    <button
                                        key={profile.id}
                                        onClick={() => switchProfile(profile.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                            profile.id === activeProfile
                                                ? "bg-primary/20 text-primary"
                                                : "hover:bg-background text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                                            profile.id === activeProfile
                                                ? "bg-primary text-white"
                                                : "bg-gradient-to-br from-secondary to-accent text-white"
                                        )}>
                                            {profile.avatar}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-medium text-sm">{profile.name}</p>
                                            <p className="text-xs text-muted-foreground">{profile.plan}</p>
                                        </div>
                                        {profile.id === activeProfile && (
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-2">
                            <Link
                                href="/profile/settings"
                                onClick={() => setShowProfileMenu(false)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background text-foreground transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="text-sm">Account Settings</span>
                            </Link>
                            <button
                                onClick={async () => {
                                    await signOut();
                                    router.push("/login");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background text-destructive transition-colors mt-2"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="text-sm">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
