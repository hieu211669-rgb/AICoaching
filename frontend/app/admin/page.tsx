'use client';

import React from 'react';
import { useSettings } from '@/context/SettingsContext';

// Simple Metric Card Component
const SimpleMetricCard: React.FC<{
  title: string;
  value: string;
  color: 'primary' | 'tertiary';
  accentColor: string;
  trend?: string;
  trendValue?: string;
  trendIcon?: string;
}> = ({ title, value, color, accentColor, trend, trendValue, trendIcon = 'trending_up' }) => {
  const textColor = color === 'primary' ? 'text-primary' : 'text-tertiary';
  return (
    <div className={`bg-surface p-6 flex flex-col justify-between border-b-2 rounded-lg shadow-sm border-x border-t border-surface-border transition-colors duration-500`}>
      <div>
        <p className={`${textColor} text-[10px] font-bold tracking-widest uppercase mb-1`}>{title}</p>
        <h2 className="font-display text-4xl font-extrabold tracking-tighter text-foreground">{value}</h2>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center gap-2 ${textColor} text-xs font-bold`}>
          <span className="material-symbols-outlined text-[16px]">{trendIcon}</span>
          <span>{trendValue}</span>
          <span className="text-foreground/40 font-normal">{trend}</span>
        </div>
      )}
    </div>
  );
};

// Circular Progress Component
const CircularProgress: React.FC<{ percentage: number; label: string; value: string; accentColor: string }> = ({ percentage, label, value, accentColor }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-surface p-6 flex flex-col items-center justify-center text-center rounded-lg border border-surface-border shadow-sm transition-colors duration-500">
      <div className="relative h-24 w-24 mb-3 flex items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
          <circle 
            className="text-foreground" 
            cx="48" 
            cy="48" 
            fill="transparent" 
            r={radius} 
            stroke="currentColor" 
            strokeWidth="6"
            opacity="0.05"
          />
          <circle 
            cx="48" 
            cy="48" 
            fill="transparent" 
            r={radius} 
            stroke={accentColor} 
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-display text-foreground">{percentage}%</span>
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
};

// Activity Feed Card Component
const ActivityFeedCard: React.FC<{
  type: 'video' | 'exercise' | 'processing';
  icon: string;
  title: string;
  subtitle: string;
  timestamp: string;
  badge: string;
  accentColor: string;
  thumbnail?: string;
  progress?: number;
  color: 'primary' | 'tertiary' | 'default';
}> = ({ type, icon, title, subtitle, timestamp, badge, accentColor, thumbnail, progress, color }) => {
  const textColor = color === 'primary' ? 'text-primary' : color === 'tertiary' ? 'text-tertiary' : 'text-foreground/40';
  const bgColor = color === 'primary' ? 'bg-primary/5' : color === 'tertiary' ? 'bg-tertiary/5' : 'bg-foreground/5';

  return (
    <div className={`bg-surface group hover:bg-surface-hover transition-all flex items-center overflow-hidden border-l-4 py-3 border-r border-t border-b border-surface-border rounded-r-lg transition-colors duration-500`}>
      <div className="relative w-40 h-24 shrink-0 flex items-center justify-center bg-background border-r border-surface-border">
        {type === 'video' && thumbnail ? (
          <>
            <img 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              src={thumbnail}
              alt={title}
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity bg-black/20">
              <span className="material-symbols-outlined text-white text-3xl">play_circle</span>
            </div>
          </>
        ) : type === 'processing' ? (
          <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin" style={{ borderLeftColor: accentColor, borderRightColor: accentColor, borderBottomColor: accentColor, borderTopColor: 'transparent' }}></div>
        ) : (
          <span className="material-symbols-outlined text-tertiary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
        )}
      </div>
      
      <div className="flex-1 px-6 flex justify-between items-center">
        <div>
          <p className={`text-[10px] ${textColor} font-bold uppercase tracking-widest mb-1 flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[12px]">{icon}</span>
            {type === 'video' ? 'New Video' : type === 'exercise' ? 'Exercise Updated' : 'In Progress'}
          </p>
          <h5 className="text-lg font-bold font-display leading-tight text-foreground uppercase">{title}</h5>
          <p className="text-[10px] text-foreground/40 mt-1 uppercase font-bold tracking-tight">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-tighter rounded border ${bgColor} ${textColor}`}>
            {badge}
          </span>
          {type === 'processing' && progress && (
            <div className="w-24 bg-foreground/5 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progress}%`, backgroundColor: accentColor }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Health Stat Component
const HealthStat: React.FC<{
  icon: string;
  iconColor: string;
  accentColor: string;
  status: string;
  label: string;
  value: string;
}> = ({ icon, iconColor, accentColor, status, label, value }) => {
  const textColor = iconColor === 'primary' ? 'text-primary' : 'text-tertiary';

  return (
    <div className={`p-6 bg-surface border-l-2 rounded-lg border-y border-r border-surface-border transition-colors duration-500`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`material-symbols-outlined ${textColor}`}>{icon}</span>
        <span className={`text-[10px] ${textColor} font-bold`}>{status}</span>
      </div>
      <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest">{label}</p>
      <h6 className="text-2xl font-display font-bold text-foreground">{value}</h6>
    </div>
  );
};

// Mini Chart Component
const MiniChart: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const data = [40, 60, 55, 80, 95, 70, 85];

  return (
    <div className="p-6 bg-surface rounded-lg border border-surface-border transition-colors duration-500">
      <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest mb-6">User Growth (7D)</p>
      <div className="flex items-end justify-between h-16 gap-1">
        {data.map((height, index) => (
          <div 
            key={index}
            className={`w-full ${height === 95 ? 'bg-primary' : 'bg-foreground/5'} hover:opacity-80 transition-colors cursor-pointer rounded-sm`}
            style={{ 
              height: `${height}%`,
              backgroundColor: height === 95 ? accentColor : ''
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const { settings } = useSettings();
  const [stats, setStats] = React.useState({
    total_videos: 0,
    total_users: 0,
    categories_count: 0
  });
  const [cloudStats, setCloudStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, cloudRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`),
          fetch('/api/admin/cloudinary-stats')
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          setCloudStats(cloudData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-background min-h-full transition-colors duration-500">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-primary font-bold tracking-widest text-xs uppercase mb-2">System Overview</p>
          <h2 className="text-5xl font-display font-black tracking-tighter leading-none text-foreground uppercase italic">Dashboard<span className="text-primary"></span></h2>
        </div>
      </div>

      {/* Combined Hero Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SimpleMetricCard 
          title="Video Optimization"
          value={loading ? "..." : (stats.total_videos * 12).toLocaleString()}
          color="primary"
          accentColor={settings.accentColor}
          trend="vs prev month"
          trendValue="+14.2%"
        />
        
        <SimpleMetricCard 
          title="Exercise Entries"
          value={loading ? "..." : stats.total_videos.toString()}
          color="tertiary"
          accentColor={settings.accentColor}
          trend="Active Categories"
          trendValue={stats.categories_count.toString()}
          trendIcon="category"
        />
        
        <CircularProgress 
          percentage={loading || !cloudStats ? 0 : Math.round(cloudStats.storage.used_percent)}
          label="Cloudinary Storage"
          value={loading || !cloudStats ? "..." : `${(cloudStats.storage.usage / 1024 / 1024 / 1024).toFixed(2)} GB / ${(cloudStats.storage.limit / 1024 / 1024 / 1024).toFixed(0)} GB`}
          accentColor={settings.accentColor}
        />
        
        <div className="bg-surface p-6 flex flex-col justify-between rounded-lg border border-surface-border transition-colors duration-500">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Active Users</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-display font-bold text-foreground uppercase">{loading ? "..." : stats.total_users.toString()}</h3>
              <span className="text-primary text-[10px] uppercase font-bold animate-pulse">Live</span>
            </div>
          </div>
          
          <div className="flex -space-x-2 mt-2">
            <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center text-[8px] font-bold border-2 border-surface-border text-foreground">JD</div>
            <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center text-[8px] font-bold border-2 border-surface-border text-foreground">AS</div>
            <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center text-[8px] font-bold border-2 border-surface-border text-foreground">+{Math.max(0, stats.total_users - 2)}</div>
          </div>
        </div>
      </div>
      
      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Unified Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-2xl font-bold italic uppercase tracking-tighter text-foreground">Live Activity: Comprehensive Feed</h4>
            <button className="text-primary text-xs font-bold uppercase border-b border-primary/30 hover:border-primary transition-all">Refresh</button>
          </div>
          
          <div className="space-y-4">
            <ActivityFeedCard
              type="video"
              icon="video_library"
              title="Elite Power Dynamics"
              subtitle="2 mins ago • Optimized & Published"
              timestamp="2 mins ago"
              badge="VIDEO_UPLOAD"
              thumbnail="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400"
              color="primary"
              accentColor={settings.accentColor}
            />
            
            <ActivityFeedCard
              type="exercise"
              icon="edit_note"
              title="Bi-lateral Squat Pattern"
              subtitle="15 mins ago • Updated biomechanic labels"
              timestamp="15 mins ago"
              badge="EXERCISE_MOD"
              color="tertiary"
              accentColor={settings.accentColor}
            />
            
            <ActivityFeedCard
              type="processing"
              icon="schedule"
              title="Volume Stress Analysis"
              subtitle="Processing AI vision tags... 65%"
              timestamp="In progress"
              badge="IN_PROGRESS"
              progress={65}
              color="default"
              accentColor={settings.accentColor}
            />
          </div>
        </div>
        
        {/* System Health Column */}
        <div className="space-y-6">
          <h4 className="font-display text-2xl font-bold italic uppercase tracking-tighter text-foreground">System Health</h4>
          
          <div className="space-y-4">
            <HealthStat 
              icon="speed"
              iconColor="primary"
              accentColor={settings.accentColor}
              status="OPTIMAL"
              label="Network Latency"
              value="24ms"
            />
            
            <MiniChart accentColor={settings.accentColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
