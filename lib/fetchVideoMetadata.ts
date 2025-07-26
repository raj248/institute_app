// ~/lib/fetchVideoMetadata.ts
import { VideoNote } from "~/types/entities"

export async function fetchVideoMetadata(video: VideoNote): Promise<VideoNote & { title: string, thumbnail: string }> {
  if (!video.url.includes("youtube.com") && !video.url.includes("youtu.be")) {
    return {
      ...video,
      title: "Invalid YouTube URL",
      thumbnail: "https://via.placeholder.com/320x180?text=Invalid+URL",
    };
  }

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(video.url)}&format=json`
    );
    if (!response.ok) throw new Error("Failed to fetch video data");

    const data = await response.json();
    return {
      ...video,
      title: data.title,
      thumbnail: data.thumbnail_url,
    };
  } catch {
    return {
      ...video,
      title: "Failed to fetch title",
      thumbnail: "https://via.placeholder.com/320x180?text=Error",
    };
  }
}
