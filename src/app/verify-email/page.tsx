"use client";

import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-8 bg-card p-10 rounded-2xl border border-border shadow-2xl">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white">Check your email</h1>
                <p className="text-gray-400">
                    We've sent a verification link to your email address. Please click the link to verify your account and start streaming.
                </p>

                <div className="space-y-4">
                    <Link href="/login">
                        <Button className="w-full h-12 text-lg gap-2">
                            Go to Login
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                        Didn't receive the email? Check your spam folder or contact support.
                    </p>
                </div>
            </div>
        </div>
    );
}
