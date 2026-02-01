"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted/20", className)}
        />
    );
}

export function ContentCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function ContentGridSkeleton() {
    return (
        <div className="my-12 px-4 md:px-12 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                    <ContentCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="relative h-[85vh] w-full bg-background overflow-hidden">
            <Skeleton className="absolute inset-0 rounded-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-12 space-y-6">
                <Skeleton className="h-16 w-1/2" />
                <Skeleton className="h-6 w-2/3" />
                <div className="flex gap-4">
                    <Skeleton className="h-14 w-40 rounded-full" />
                    <Skeleton className="h-14 w-40 rounded-full" />
                </div>
            </div>
        </div>
    );
}
