"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Lock, Loader2 } from "lucide-react";

interface AdminAuthProps {
    children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/admin");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-destructive" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                        <p className="text-gray-400 mb-6">
                            You do not have administrative privileges to access this page. Please sign in with an official BBC Studios admin account.
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold transition-all"
                        >
                            Switch Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
