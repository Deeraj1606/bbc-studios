"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Users, Play, Clock, TrendingUp, Eye, UserPlus } from "lucide-react";
import { AdminAuth } from "@/components/admin-auth";

const data = [
    { name: "Mon", views: 0, users: 0 },
    { name: "Tue", views: 0, users: 0 },
    { name: "Wed", views: 0, users: 0 },
    { name: "Thu", views: 0, users: 0 },
    { name: "Fri", views: 0, users: 0 },
    { name: "Sat", views: 0, users: 0 },
    { name: "Sun", views: 0, users: 0 },
];

export default function AnalyticsPage() {
    const stats = [
        { label: "Real-time Views", value: "--", change: "+0%", icon: Eye, color: "text-blue-500" },
        { label: "New Subscribers", value: "--", change: "+0%", icon: UserPlus, color: "text-green-500" },
        { label: "Watch Time (Hrs)", value: "--", change: "+0%", icon: Clock, color: "text-purple-500" },
        { label: "Engagement Rate", value: "--", change: "+0%", icon: TrendingUp, color: "text-orange-500" },
    ];

    return (
        <AdminAuth>
            <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Original Analytics</h1>
                        <p className="text-muted-foreground">Monitor platform performance and user engagement in real-time</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-card border border-border rounded-xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-green-500 text-sm font-bold bg-green-500/10 px-2 py-1 rounded">
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{stat.value}</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Views Chart */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6">Views Overview</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#E50914" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#E50914" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="views" stroke="#E50914" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* User Growth */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6">User Growth</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                            cursor={{ fill: '#222' }}
                                        />
                                        <Bar dataKey="users" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Top Content Table */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-xl font-bold text-white">Top Performing Content</h3>
                        </div>
                        <div className="p-12 text-center text-gray-500">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-lg font-medium">Real-time engagement metrics starting soon...</p>
                            <p className="text-sm">Total views and retention data will appear here as content is streamed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuth>
    );
}
