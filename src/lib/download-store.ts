"use client";

export interface DownloadItem {
    id: string;
    title: string;
    thumbnail: string;
    status: "downloading" | "completed" | "error" | "paused";
    progress: number;
    size: string;
    quality: string;
    addedAt: number;
}

const STORAGE_KEY = "bbc-studios-downloads";

export const downloadStore = {
    getDownloads: (): DownloadItem[] => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    addDownload: (item: Omit<DownloadItem, "status" | "progress" | "addedAt">) => {
        const downloads = downloadStore.getDownloads();
        if (downloads.find((d) => d.id === item.id)) return;

        const newItem: DownloadItem = {
            ...item,
            status: "downloading",
            progress: 0,
            addedAt: Date.now(),
        };

        const updated = [newItem, ...downloads];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Simulation logic
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress >= 100) {
                progress = 100;
                downloadStore.updateStatus(item.id, "completed", 100);
                clearInterval(interval);
            } else {
                downloadStore.updateStatus(item.id, "downloading", progress);
            }
        }, 1500);
    },

    removeDownload: (id: string) => {
        const downloads = downloadStore.getDownloads();
        const updated = downloads.filter((d) => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("downloadsUpdated"));
    },

    updateStatus: (id: string, status: DownloadItem["status"], progress: number) => {
        const downloads = downloadStore.getDownloads();
        const updated = downloads.map((d) =>
            d.id === id ? { ...d, status, progress } : d
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("downloadsUpdated"));
    },
};
