import { Hero } from "@/components/hero";
import { ContentGrid } from "@/components/content-grid";
import { ContinueWatching } from "@/components/continue-watching";

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <Hero />

      <div className="relative -mt-32 space-y-8 z-30">
        <ContinueWatching />

        <ContentGrid
          title="Trending Now"
          subtitle="What everyone's watching"
          layout="featured"
          category="trending"
        />

        <ContentGrid
          title="New Releases"
          subtitle="Fresh content just added"
          layout="magazine"
          category="new"
        />

        <ContentGrid
          title="Action Movies"
          layout="grid"
          category="Action"
        />

        <ContentGrid
          title="Comedy Hits"
          layout="grid"
          category="Comedy"
        />

      </div>
    </main>

  );
}
