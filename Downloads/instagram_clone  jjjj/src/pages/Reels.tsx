import { Layout } from "@/components/Layout";
import { ReelsPlayer } from "@/components/ReelsPlayer";
import { mockPosts } from "@/data/index";
import { Post } from "@/lib/index";
import { useMemo } from "react";

/**
 * Reels Page
 * 
 * A dedicated page for immersive, full-screen vertical video content.
 * Leverages the ReelsPlayer component to handle swipe navigation and video playback.
 */
export default function Reels() {
  // Filter mock posts to find video content which represents "Reels" in this context
  const reelsData = useMemo(() => {
    return mockPosts.filter((post: Post) => post.type === "video");
  }, []);

  return (
    <Layout>
      <div className="relative h-[calc(100vh-var(--header-height)-var(--nav-height))] md:h-[calc(100vh-var(--header-height))] lg:h-screen w-full bg-black overflow-hidden">
        {reelsData.length > 0 ? (
          <ReelsPlayer reels={reelsData} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white space-y-4 px-6 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-video-off"
              >
                <path d="M10.66 6H14a2 2 0 0 1 2 2v2.34" />
                <path d="m2 2 20 20" />
                <path d="M21 15.65V7a2 2 0 0 0-2-2h-2.34" />
                <path d="M3 5.35V17a2 2 0 0 0 2 2h12.34" />
                <path d="m16 16 4.14 3.07a.5.5 0 0 0 .86-.4V5.33a.5.5 0 0 0-.86-.4L16 8" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">No Reels Available</h2>
              <p className="text-white/60 mt-1 max-w-xs">
                Check back later for new short-form creative content from the community.
              </p>
            </div>
          </div>
        )}

        {/* Mobile Header Overlay - Specific to Reels Immersive View */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none md:hidden">
          <h1 className="text-white text-xl font-bold tracking-tight pointer-events-auto">Reels</h1>
          <button className="p-2 text-white pointer-events-auto bg-black/20 backdrop-blur-md rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-camera"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
}
