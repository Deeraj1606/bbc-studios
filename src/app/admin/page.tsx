"use client";

import { useState, useEffect } from "react";
import { AdminAuth } from "@/components/admin-auth";
import Link from "next/link";
import { Upload, BarChart3, Settings, Film, TrendingUp, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CHART_DATA = [
    { name: 'Jan', views: 4000, users: 2400 },
    { name: 'Feb', views: 3000, users: 1398 },
    { name: 'Mar', views: 2000, users: 9800 },
    { name: 'Apr', views: 2780, users: 3908 },
    { name: 'May', views: 1890, users: 4800 },
    { name: 'Jun', views: 2390, users: 3800 },
    { name: 'Jul', views: 3490, users: 4300 },
];

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState({ videos: 0, views: 0, users: 1240 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                const totalViews = data.reduce((acc: number, item: any) => acc + (item.views || 0), 0);
                setCounts({
                    videos: data.length,
                    views: totalViews,
                    users: 1240 + Math.floor(Math.random() * 100)
                });
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: "Total Videos", value: counts.videos.toString(), icon: Film, color: "text-blue-500" },
        { label: "Total Views", value: counts.views.toLocaleString(), icon: TrendingUp, color: "text-green-500" },
        { label: "Active Users", value: counts.users.toLocaleString(), icon: Users, color: "text-purple-500" },
        { label: "Upload Storage", value: "1.2 GB", icon: BarChart3, color: "text-orange-500" },
    ];

    const quickActions = [
        {
            title: "Upload Content",
            description: "Add new movies and TV shows",
            icon: Upload,
            href: "/admin/upload",
            color: "bg-primary hover:bg-primary/90",
        },
        {
            title: "Manage Content",
            description: "Edit or remove existing content",
            icon: Settings,
            href: "/admin/manage",
            color: "bg-blue-600 hover:bg-blue-700",
        },
        {
            title: "Analytics",
            description: "View platform statistics",
            icon: BarChart3,
            href: "/admin/analytics",
            color: "bg-green-600 hover:bg-green-700",
        },
    ];

    return (
        <AdminAuth>
            <div className="min-h-screen bg-background pt-20 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage your BBC Studios OTT platform</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-card border border-border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className={`${action.color} rounded-lg p-6 transition-all transform hover:scale-105`}
                                >
                                    <action.icon className="w-10 h-10 text-white mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                                    <p className="text-white/80 text-sm">{action.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-white mb-6">Viewership Trends</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#666" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="views" stroke="#ef4444" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-white mb-6">User Growth</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={CHART_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#666" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Live Activity</h2>
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="divide-y divide-border">
                                {[
                                    { user: "User 1", action: "watched", item: "Planet Earth II", time: "2 min ago" },
                                    { user: "User 2", action: "added", item: "The Tourist", time: "5 min ago" },
                                    { user: "User 3", action: "downloaded", item: "Sherlock", time: "12 min ago" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                                {item.user.charAt(item.user.length - 1)}
                                            </div>
                                            <div>
                                                <p className="text-sm text-white">
                                                    <span className="font-bold">{item.user}</span> {item.action} <span className="font-bold">{item.item}</span>
                                                </p>
                                                <p className="text-xs text-gray-500">{item.time}</p>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuth>
    );
}
