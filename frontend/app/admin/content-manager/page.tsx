'use client';

import React, { useState, useEffect } from 'react';

export default function ContentManager() {
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/admin/muscle-groups`);
        if (response.ok) {
          const data = await response.json();
          // Extract names from muscle group objects
          const names = data.map((group: any) => group.name);
          setMuscleGroups(names);
        }
      } catch (error) {
        console.error('Error fetching muscle groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMuscleGroups();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Content Manager</h1>
      
      <div className="bg-surface p-6 rounded-lg border border-surface-border">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-tighter italic">Detected Muscle Groups</h2>
        {loading ? (
          <p className="text-foreground/40 italic">Loading system assets...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {muscleGroups.length > 0 ? muscleGroups.map((muscle) => (
              <span 
                key={muscle} 
                className="px-3 py-1.5 bg-background border border-surface-border rounded text-[10px] font-bold uppercase tracking-widest text-primary"
              >
                {muscle}
              </span>
            )) : (
              <p className="text-foreground/40 italic text-xs">No muscle groups found in database.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
