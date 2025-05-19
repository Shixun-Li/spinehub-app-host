"use client";

export function getRandomAvatar(name: string) {
    const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name ?? "")}`;

    return avatarUrl;
}
