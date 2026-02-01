import { ContentGrid } from "@/components/content-grid";

export default function TVShowsPage() {
    return (
        <main className="min-h-screen bg-background pt-20 pb-20">
            <div className="px-4 md:px-12 py-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">TV Shows</h1>

                <div className="space-y-8">
                    <ContentGrid title="Popular Series" layout="featured" category="tv-show" />
                    <ContentGrid title="Drama Series" layout="grid" category="Drama" />
                    <ContentGrid title="Comedy Series" layout="magazine" category="Comedy" />
                    <ContentGrid title="Documentaries" layout="grid" category="documentary" />
                </div>
            </div>
        </main>
    );
}
