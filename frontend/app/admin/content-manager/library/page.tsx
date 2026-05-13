'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Loader2, AlertCircle, CheckCircle2, Trash2, X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface VideoAsset {
  id: string | number;
  title: string;
  category: string;
  thumbnail: string;
  duration: string;
  date: string;
  uploader: string;
  status: string;
  fileInfo: string;
}

export default function LibraryPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [selectedFilter, setSelectedFilter] = useState('All Content');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for custom UI
  const [deleteConfirm, setDeleteConfirm] = useState<VideoAsset | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filters = ['All Content', 'Quadriceps', 'Glutes', 'Hamstrings', 'Core', 'Lower Back', 'Chest', 'Traps', 'Shoulders'];

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch videos from MongoDB via backend API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/videos');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        
        const mappedVideos = data.map((video: any) => {
          let formattedDate = 'Recently';
          if (video.date) {
            try {
              formattedDate = new Date(video.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
            } catch (e) {
              formattedDate = 'Recently';
            }
          }

          return {
            id: video.id || video._id,
            title: video.title || 'Untitled Video',
            category: video.intensity || 'Strength',
            thumbnail: video.thumbnail || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
            duration: video.duration || '00:00',
            date: formattedDate,
            uploader: 'Coach Admin',
            status: 'Published',
            fileInfo: `Focus: ${video.focus || 'General'}`
          };
        });
        
        setVideos(mappedVideos);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch videos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/videos/${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setVideos(prev => prev.filter(v => v.id !== deleteConfirm.id));
        setNotification({ message: `Successfully deleted "${deleteConfirm.title}"`, type: 'success' });
      } else {
        const err = await res.json();
        throw new Error(err.detail || 'Delete failed');
      }
    } catch (err: any) {
      console.error(err);
      setNotification({ message: `Error: ${err.message}`, type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // UI for Loading State
  if (loading) {
    return (
      <div className="pt-24 px-12 pb-12 bg-background min-h-screen text-foreground flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-foreground/40 font-bold tracking-widest uppercase text-xs">Accessing Neural Archive...</p>
      </div>
    );
  }

  // UI for Error State
  if (error && videos.length === 0) {
    return (
      <div className="pt-24 px-12 pb-12 bg-background min-h-screen text-foreground flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-[#ff7948] mb-4" />
        <p className="text-foreground font-bold mb-2">Sync Connection Failed</p>
        <p className="text-foreground/40 text-sm mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-surface hover:bg-surface-hover text-primary text-xs font-bold rounded uppercase tracking-widest border border-surface-border"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const filteredVideos = videos.filter(video => {
    const matchesFilter = selectedFilter === 'All Content' || 
      video.category.toLowerCase().includes(selectedFilter.toLowerCase());
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-24 px-12 pb-12 bg-background min-h-screen text-foreground relative transition-colors duration-500">
      {/* Custom Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-12 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' 
            ? 'bg-surface border-primary/20 text-primary' 
            : 'bg-surface border-red-500/20 text-tertiary'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-bold tracking-tight">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity text-foreground">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Custom Deletion Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-surface-border rounded-xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2 uppercase tracking-tight text-foreground">Confirm Deletion</h3>
              <p className="text-foreground/60 text-sm mb-8 leading-relaxed">
                Are you sure you want to permanently remove <span className="text-foreground font-bold">"{deleteConfirm.title}"</span>? This action cannot be reversed within the neural archive.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-background hover:bg-surface-hover text-foreground text-xs font-bold rounded-lg border border-surface-border transition-colors uppercase tracking-widest disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-red-900/20"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {isDeleting ? 'Deleting...' : 'Remove Asset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div className="max-w-2xl">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block flex items-center gap-2">
            <Video size={14} /> CONTENT MANAGER / ASSET LIBRARY
          </span>
          <h2 className="text-5xl font-display font-bold tracking-tighter leading-none mb-4 uppercase text-foreground">
            VIDEO<span className="text-primary">_</span>LIBRARY
          </h2>
          <p className="text-foreground/40 text-base">Precision control over your high-performance training library. Monitor, audit, and deploy elite athletic content.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/content-manager/upload')}
          className="px-6 py-3 bg-primary hover:opacity-90 text-black font-bold rounded-lg flex items-center gap-2 transition-all duration-200 mb-2 shadow-lg shadow-primary/10"
        >
          <span className="material-symbols-outlined">add</span>
          <span>New Upload</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg flex flex-col justify-between hover:bg-surface-hover transition-all border border-surface-border">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-foreground/40 tracking-widest uppercase">Total Assets</span>
            <span className="material-symbols-outlined text-primary text-sm">analytics</span>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-display font-bold leading-none text-foreground">{videos.length}</p>
            <p className="text-[10px] text-primary mt-2 flex items-center gap-1 font-bold uppercase tracking-tight">
              <span className="material-symbols-outlined text-xs">trending_up</span> Ready for deployment
            </p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg flex flex-col justify-between hover:bg-surface-hover transition-all border border-surface-border">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-foreground/40 tracking-widest uppercase">Published</span>
            <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
          </div>
          <div className="mt-4">
            <p className="text-4xl font-display font-bold leading-none text-foreground">
              {videos.filter(v => v.status === 'Published').length}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-surface p-6 rounded-lg border border-surface-border">
          <div className="flex justify-between mb-4">
            <span className="text-xs font-bold text-foreground/40 tracking-widest uppercase">Quick Filters</span>
            <button 
              onClick={() => setSelectedFilter('All Content')}
              className="text-[10px] font-bold text-primary tracking-widest uppercase hover:text-foreground transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all border ${
                  selectedFilter === filter
                    ? 'bg-primary text-black border-primary'
                    : 'bg-background text-foreground/60 border-surface-border hover:border-primary/30'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 text-lg">search</span>
          <input
            type="text"
            placeholder="Search videos by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-lg text-foreground pl-12 pr-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm outline-none placeholder:text-foreground/20"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-surface rounded-lg overflow-hidden hover:bg-surface-hover transition-all group cursor-pointer border border-surface-border hover:border-primary/20"
          >
            {/* Thumbnail */}
            <div className="relative h-40 overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_circle
                </span>
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 px-2 py-1 rounded text-white font-mono border border-white/10">
                {video.duration}
              </span>
              <div className="absolute top-2 right-2">
                <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase border ${
                  video.status === 'Published'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : video.status === 'Draft'
                    ? 'bg-foreground/10 text-foreground border-foreground/20'
                    : 'bg-tertiary/10 text-tertiary border-tertiary/20'
                }`}>
                  {video.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-2 uppercase font-display">{video.title}</h3>
              <p className="text-[10px] text-foreground/40 mb-3 uppercase tracking-tighter">{video.fileInfo}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-foreground/40 font-bold uppercase tracking-widest">Category:</span>
                  <span className="bg-background px-2 py-1 rounded text-primary font-bold uppercase tracking-tighter border border-surface-border">
                    {video.category}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-foreground/40 font-bold uppercase tracking-widest">Uploaded:</span>
                  <span className="text-foreground/60">{video.date}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-foreground/40 font-bold uppercase tracking-widest">By:</span>
                  <span className="text-foreground/60">{video.uploader}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-surface-border">
                <button
                  onClick={() => setNotification({ message: 'Preview not available in this view', type: 'success' })}
                  className="flex-1 py-2 bg-background hover:bg-surface-hover text-primary text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1 border border-surface-border"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Preview
                </button>
                <button
                  onClick={() => setDeleteConfirm(video)}
                  className="flex-1 py-2 bg-background hover:bg-red-500/10 text-tertiary text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1 border border-surface-border hover:border-red-500/20"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-foreground/10 block mb-4">
            video_library
          </span>
          <p className="text-foreground/40 text-lg uppercase font-bold tracking-widest font-display">No videos found</p>
          <button
            onClick={() => {
              setSelectedFilter('All Content');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-surface hover:bg-surface-hover text-primary text-sm font-bold rounded transition-colors border border-surface-border"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
