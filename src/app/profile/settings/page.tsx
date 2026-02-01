"use client";

import { useState, useEffect } from "react";
import { User, Settings, Shield, Bell, CreditCard, BarChart3, ChevronRight, Camera, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from "recharts";

const AVATARS = ["👤", "🎭", "🎮", "🎬", "🎨", "🚀", "🎸", "🌟"];

const WATCH_DATA = [
    { name: "Mon", minutes: 120 },
    { name: "Tue", minutes: 80 },
    { name: "Wed", minutes: 150 },
    { name: "Thu", minutes: 200 },
    { name: "Fri", minutes: 110 },
    { name: "Sat", minutes: 300 },
    { name: "Sun", minutes: 250 },
];

const GENRE_DATA = [
    { name: "Action", value: 400 },
    { name: "Drama", value: 300 },
    { name: "Comedy", value: 200 },
    { name: "Sci-Fi", value: 278 },
];

const COLORS = ["#FF0000", "#00C49F", "#FFBB28", "#FF8042"];

export default function ProfileSettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [name, setName] = useState(user?.displayName || "User");
    const [selectedAvatar, setSelectedAvatar] = useState("👤");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('userProfiles');
        if (stored) {
            const data = JSON.parse(stored);
            const active = data.profiles.find((p: any) => p.id === data.active);
            if (active) {
                setName(active.name);
                setSelectedAvatar(active.avatar);
            }
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            const stored = localStorage.getItem('userProfiles');
            if (stored) {
                const data = JSON.parse(stored);
                data.profiles = data.profiles.map((p: any) =>
                    p.id === data.active ? { ...p, name, avatar: selectedAvatar } : p
                );
                localStorage.setItem('userProfiles', JSON.stringify(data));
                window.dispatchEvent(new CustomEvent("profileUpdated"));
            }
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-2">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            activeTab === "profile" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground"
                        )}
                    >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                            activeTab === "stats" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground"
                        )}
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-medium">Watch Stats</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Privacy</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="font-medium">Notifications</span>
                    </button>
                </aside>

                {/* Content */}
                <main className="flex-1 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                    {activeTab === "profile" ? (
                        <div className="space-y-8 relative z-10">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                                <p className="text-muted-foreground">Manage your public profile and account details.</p>
                            </div>

                            {/* Avatar selection */}
                            <div className="flex flex-col items-center md:flex-row gap-8 py-6 border-y border-border">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-4xl shadow-xl">
                                        {selectedAvatar}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold mb-3">Choose an Avatar</label>
                                    <div className="flex flex-wrap gap-3">
                                        {AVATARS.map(a => (
                                            <button
                                                key={a}
                                                onClick={() => setSelectedAvatar(a)}
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all border-2",
                                                    selectedAvatar === a ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                                                )}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Display Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
                                    <input
                                        type="email"
                                        disabled
                                        value={user?.email || "guest@example.com"}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Save Changes</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10 relative z-10">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Watch Statistics</h1>
                                <p className="text-muted-foreground">A detailed look at your viewing habits.</p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Activity Chart */}
                                <div className="bg-card/50 p-6 rounded-2xl border border-border">
                                    <h3 className="font-bold mb-6 text-foreground flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-primary" />
                                        Weekly Activity
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={WATCH_DATA}>
                                                <defs>
                                                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#FF0000" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                                                    itemStyle={{ color: "#fff" }}
                                                />
                                                <Area type="monotone" dataKey="minutes" stroke="#FF0000" fillOpacity={1} fill="url(#colorMinutes)" strokeWidth={3} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Genre Distribution */}
                                <div className="bg-card/50 p-6 rounded-2xl border border-border">
                                    <h3 className="font-bold mb-6 text-foreground">Top Genres</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={GENRE_DATA}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {GENRE_DATA.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                                                    itemStyle={{ color: "#fff" }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Hours", value: "142", trend: "+12%" },
                                    { label: "Completed", value: "48", trend: "+5" },
                                    { label: "Avg/Day", value: "2.5h", trend: "-10%" },
                                    { label: "Streak", value: "12 Days", trend: "🔥" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 bg-muted/20 rounded-xl border border-border/50">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                                        <div className="flex items-end justify-between">
                                            <p className="text-2xl font-bold">{stat.value}</p>
                                            <span className="text-[10px] text-green-500 font-bold">{stat.trend}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
