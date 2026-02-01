import { ContentGrid } from "@/components/content-grid";

export default function NewPopularPage() {
    return (
        <main className="min-h-screen bg-background pt-20 pb-20">
            <div className="px-4 md:px-12 py-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">New & Popular</h1>

                <div className="space-y-8">
                    <ContentGrid
                        title="New Arrivals"
                        subtitle="Fresh content just uploaded"
                        layout="featured"
                        category="new"
                    />
                    <ContentGrid
                        title="Trending Now"
                        subtitle="Most watched content"
                        layout="magazine"
                        category="trending"
                    />
                    <ContentGrid
                        title="Popular Movies"
                        layout="grid"
                        category="movie"
                    />
                    <ContentGrid
                        title="Popular TV Shows"
                        layout="grid"
                        category="tv-show"
                    />
                </div>
            </div>
        </main>
    );
}
