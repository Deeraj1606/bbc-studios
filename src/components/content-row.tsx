"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentRowProps {
    title: string;
    items?: number[]; // just dummy IDs for now
}

export function ContentRow({ title, items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }: ContentRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -800 : 800;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-4 my-8 px-4 md:px-12 group">
            <h2 className="text-2xl font-semibold text-white transition-colors duration-200 hover:text-primary cursor-pointer">
                {title}
            </h2>

            <div className="relative group/row">
                {/* Arrow Left */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-r-md"
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x"
                >
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="flex-none w-[200px] aspect-[2/3] md:w-[240px] md:aspect-video relative rounded-md overflow-hidden bg-gray-800 transition-transform duration-300 hover:scale-105 hover:z-20 cursor-pointer snap-start"
                        >
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src={`https://picsum.photos/seed/${item + title}/400/225`}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <h3 className="text-white font-medium text-sm truncate">Movie Title {item}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Arrow Right */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 rounded-l-md"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </button>
            </div>
        </div>
    );
}
