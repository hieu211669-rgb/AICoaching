'use client';

import React, { useState, useEffect } from 'react';
import TopAppBar from '@/components/TopAppBar';

// We can't use 'fs' in a client component. 
// In a real app, this would be an API call or a Server Action.
// For now, let's mock the data or keep it simple.

type ApiVideo = {
  id?: string;
  _id?: string;
  title?: string;
  focus?: string;
  focus_muscle_ids?: string[];
  views?: number | string;
  duration?: string;
  intensity?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  url?: string;
  video_url?: string;
  created_at?: string;
  date?: string;
  timeStamp?: string;
};

type TutorialVideo = {
  id: string;
  title: string;
  coach: string;
  focus_muscle_ids: string[];
  viewCount: number;
  views: string;
  duration: string;
  intensity: string;
  thumbnail: string;
  videoSrc: string;
  createdAt: number;
};

type StoredUser = {
  id?: string;
  _id?: string;
  email?: string;
};

const parseViews = (views: unknown) => {
  if (typeof views === 'number') {
    return views;
  }
  if (typeof views === 'string') {
    const normalizedViews = Number(views.replace(/[^\d]/g, ''));
    return Number.isFinite(normalizedViews) ? normalizedViews : 0;
  }
  return 0;
};

const formatViews = (views: number) => {
  return `${views.toLocaleString()} views`;
};

const parseCreatedAt = (video: ApiVideo) => {
  const rawDate = video.created_at || video.date || video.timeStamp;
  if (rawDate) {
    const parsedDate = Date.parse(rawDate);
    if (Number.isFinite(parsedDate)) {
      return parsedDate;
    }
  }

  const id = video.id || video._id;
  if (id && /^[a-f\d]{24}$/i.test(id)) {
    return parseInt(id.slice(0, 8), 16) * 1000;
  }

  return 0;
};

export default function Home() {
  const [tutorialVideos, setTutorialVideos] = useState<TutorialVideo[]>([]);
  const [userStats, setUserStats] = useState({
    weekly_volume: 0,
    daily_volumes: [0, 0, 0, 0, 0, 0, 0],
    streak: 0
  });
  const [rotateIndex, setRotateIndex] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const userJson = localStorage.getItem('user');
        let userId = null;
        
        if (userJson) {
          const user = JSON.parse(userJson) as StoredUser;
          userId = user.id || user._id || user.email;
        }

        // Fetch videos and user stats in parallel
        const [videoRes, statsRes] = await Promise.all([
          fetch(`${apiUrl}/api/videos`),
          userId ? fetch(`${apiUrl}/api/user/stats/${encodeURIComponent(userId)}`) : Promise.resolve(null)
        ]);
        
        // Handle video data
        if (videoRes.ok) {
          const data = await videoRes.json() as ApiVideo[];
          const mappedVideos = data
            .map((v): TutorialVideo | null => {
              const viewCount = parseViews(v.views);
              const thumbnail = v.thumbnail || v.thumbnail_url;
              const videoSrc = v.url || v.video_url;
              const id = v.id || v._id;

              if (!v.title || !thumbnail || !videoSrc || !id) {
                return null;
              }

              return {
                id,
                title: v.title,
                coach: v.focus || 'Coach AI',
                focus_muscle_ids: v.focus_muscle_ids || [],
                viewCount,
                views: formatViews(viewCount),
                duration: v.duration || 'HD',
                intensity: v.intensity || 'Featured',
                thumbnail,
                videoSrc,
                createdAt: parseCreatedAt(v)
              };
            })
            .filter((video): video is TutorialVideo => video !== null)
            .sort((a, b) => (b.createdAt - a.createdAt) || b.id.localeCompare(a.id));
          setTutorialVideos(mappedVideos);
        }

        // Handle user stats data
        if (statsRes && statsRes.ok) {
          const statsData = await statsRes.json();
          setUserStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  // Interval for rotating videos (within top 4, showing 3)
  useEffect(() => {
    if (tutorialVideos.length > 3) {
      const interval = setInterval(() => {
        setRotateIndex((prev) => (prev + 1) % 4);
      }, 5000); // Rotate every 5 seconds
      return () => clearInterval(interval);
    }
  }, [tutorialVideos.length]);

  // Calculate max volume for chart scaling
  const maxVolume = Math.max(...userStats.daily_volumes, 1);
  const featuredVideo = tutorialVideos[0];
  
  // Logic to get 3 rotating videos from the top 4
  const latestFour = tutorialVideos.slice(0, 4);
  const visibleTutorialVideos = latestFour.length > 3
    ? [0, 1, 2].map(i => latestFour[(rotateIndex + i) % 4])
    : latestFour;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <TopAppBar />

      <main className="mx-auto max-w-5xl space-y-10 px-4 pb-28 pt-20 sm:px-6 md:pb-12">
        {/* Welcome Section */}
        <section className="relative">
          <div className="absolute -left-12 top-0 opacity-10 pointer-events-none select-none">
            <span className="font-display text-[72px] font-black leading-none uppercase tracking-tighter text-foreground sm:text-[120px]">
              ELITE
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-primary uppercase tracking-widest text-xs font-bold mb-2">
              Ready for impact
            </p>
            <h2 className="font-display text-4xl font-extrabold leading-[0.9] tracking-tight text-foreground sm:text-5xl">
              HELLO,<br />CHAMPION.
            </h2>
          </div>
        </section>

        {/* Weekly Progress Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-surface p-6 flex flex-col justify-between h-48 relative overflow-hidden group rounded-xl border border-surface-border">
            <div className="relative z-10">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Weekly Volume</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold text-foreground">
                  {userStats.weekly_volume.toLocaleString()}
                </span>
                <span className="text-primary font-bold text-sm uppercase">KG</span>
              </div>
            </div>
            <div className="relative z-10 flex gap-1 items-end h-16">
              {userStats.daily_volumes.map((vol, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all duration-500 ${i === 6 ? 'bg-primary' : 'bg-surface-border'}`} 
                  style={{ height: `${Math.max((vol / maxVolume) * 100, 5)}%` }}
                ></div>
              ))}
            </div>
            <div className="absolute -right-4 top-0 h-full w-32 skew-x-12 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
          </div>
          <div className="bg-primary p-6 flex flex-col justify-between h-48 rounded-xl shadow-lg shadow-primary/20">
            <div>
              <p className="text-black/60 text-xs uppercase tracking-widest font-bold">Streak</p>
              <h3 className="font-display text-5xl font-black text-black">{userStats.streak}</h3>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-black/60 text-xs font-bold uppercase">Days Active</span>
              <span
                className="material-symbols-outlined text-black"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
          </div>
        </section>

        {/* Featured Workouts */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-surface-border pb-4">
            <h3 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground">Nổi bật hôm nay</h3>
            <button className="text-primary text-xs font-bold uppercase tracking-wider hover:underline">
              View All
            </button>
          </div>
          <div className="flex flex-col gap-8">
            {featuredVideo ? (
              <a
                href={`/train?title=${encodeURIComponent(featuredVideo.title)}&videoSrc=${encodeURIComponent(featuredVideo.videoSrc)}&thumbnail=${encodeURIComponent(featuredVideo.thumbnail)}&focus=${encodeURIComponent(featuredVideo.coach)}&focus_muscle_ids=${encodeURIComponent(JSON.stringify(featuredVideo.focus_muscle_ids))}`}
                className="group flex min-h-52 cursor-pointer flex-col overflow-hidden rounded-xl border border-surface-border bg-surface transition-all hover:border-primary/30 active:scale-[0.98] sm:flex-row"
              >
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="inline-block px-2 py-0.5 bg-tertiary text-[10px] text-white font-bold uppercase mb-3 rounded-sm">
                      {featuredVideo.intensity}
                    </div>
                    <h4 className="font-display text-2xl font-bold leading-none mb-2 group-hover:text-primary transition-colors text-foreground uppercase line-clamp-2">
                      {featuredVideo.title}
                    </h4>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {featuredVideo.coach}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-primary">timer</span>
                      <span className="text-xs font-bold text-foreground">{featuredVideo.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground">
                      <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                      <span className="text-xs font-bold">{featuredVideo.views}</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-48 overflow-hidden sm:h-auto sm:w-2/5">
                  <img
                    alt={featuredVideo.title}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    src={featuredVideo.thumbnail}
                  />
                </div>
              </a>
            ) : (
              <p className="text-gray-500 italic">Chưa có video nổi bật.</p>
            )}
          </div>
        </section>

        {/* Tutorials Section */}
        <section className="space-y-6">
          <h3 className="font-display text-2xl font-bold uppercase tracking-tighter text-foreground border-b border-surface-border pb-4">Video hướng dẫn mới</h3>
          <div className="-mx-4 flex gap-5 overflow-x-auto px-4 sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {visibleTutorialVideos.length > 0 ? visibleTutorialVideos.map((video) => (
              <a
                key={video.id}
                href={`/train?title=${encodeURIComponent(video.title)}&videoSrc=${encodeURIComponent(video.videoSrc)}&thumbnail=${encodeURIComponent(video.thumbnail)}&focus=${encodeURIComponent(video.coach)}&focus_muscle_ids=${encodeURIComponent(JSON.stringify(video.focus_muscle_ids))}`}
                className="block min-w-[260px] space-y-3 group cursor-pointer sm:min-w-[280px] lg:min-w-0"
              >
                <div className="aspect-video relative overflow-hidden rounded-lg border border-surface-border">
                  <img
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    src={video.thumbnail}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span
                      className="material-symbols-outlined text-primary text-5xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_circle
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white rounded">
                    {video.duration}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1 text-foreground font-display uppercase">
                    {video.title}
                  </h5>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">
                    {video.coach} • {video.views}
                  </p>
                </div>
              </a>
            )) : (
              <p className="text-gray-500 italic">Chưa có video hướng dẫn nào.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
