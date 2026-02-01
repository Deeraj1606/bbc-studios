import { ContentGrid } from "@/components/content-grid";

export default function MoviesPage() {
    return (
        <main className="min-h-screen bg-background pt-20 pb-20">
            <div className="px-4 md:px-12 py-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Movies</h1>

                <div className="space-y-8">
                    <ContentGrid title="Popular Movies" layout="featured" category="movie" />
                    <ContentGrid title="Action Movies" layout="grid" category="Action" />
                    <ContentGrid title="Comedy Movies" layout="magazine" category="Comedy" />
                    <ContentGrid title="Drama Movies" layout="grid" category="Drama" />
                    <ContentGrid title="Sci-Fi Movies" layout="grid" category="Sci-Fi" />
                </div>
            </div>
        </main>
    );
}
