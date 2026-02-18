'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

interface PresenceState {
    [key: string]: any;
}

interface OrbStyle {
    id: number;
    width: number;
    height: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
}

export default function GraceLights() {
    const [onlineCount, setOnlineCount] = useState(1);
    const [showFlash, setShowFlash] = useState(false);

    // Memoize orb styles to prevent jumping on re-renders
    // We'll generate a pool of potential orbs and slice based on count
    const orbPool = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            width: Math.random() * 6 + 4,
            height: Math.random() * 6 + 4,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
    }, []);

    const activeOrbs = useMemo(() => {
        // Limit to max 30 to avoid clutter, but always show at least one (you)
        const count = Math.min(Math.max(onlineCount, 1), 30);
        return orbPool.slice(0, count);
    }, [onlineCount, orbPool]);

    // Firefly particles for the flash effect
    const fireflies = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            tx: (Math.random() - 0.5) * 100, // Translate X in vw units roughly
            ty: (Math.random() - 0.5) * 100,
            delay: Math.random() * 0.5,
        }));
    }, []);

    useEffect(() => {
        // 1. Presence (User Count)
        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: Math.random().toString(36).substring(7),
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState<PresenceState>();
                const count = Object.keys(newState).length;
                console.log('Presence sync:', count);
                setOnlineCount(count);
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'qt_logs',
            }, () => {
                // 2. Flash Effect on New Post
                console.log('New post detected, flashing lights');
                triggerFlash();
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const triggerFlash = () => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 3000); // Reset after animation
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Ambient Background Glow - subtle pulsing */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-amber-50/20 to-transparent opacity-30 animate-pulse" style={{ animationDuration: '5s' }} /> */}

            {/* Online User Orbs */}
            {activeOrbs.map((orb) => (
                <div
                    key={orb.id}
                    className="absolute bg-amber-400 rounded-full blur-[2px] opacity-60 animate-float-orb"
                    style={{
                        width: `${orb.width}px`,
                        height: `${orb.height}px`,
                        left: `${orb.left}%`,
                        top: `${orb.top}%`,
                        animationDuration: `${orb.duration}s`,
                        animationDelay: `${orb.delay}s`,
                        boxShadow: '0 0 10px 2px rgba(251, 191, 36, 0.4)'
                    }}
                />
            ))}

            {/* Firefly Spread Effect (New Post) */}
            {showFlash && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <div className="w-full h-full absolute animate-flash-overlay bg-amber-100/30" />
                    {fireflies.map((fly) => (
                        <div
                            key={`firefly-${fly.id}`}
                            className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full animate-firefly-spread shadow-[0_0_8px_rgba(252,211,77,0.8)]"
                            style={{
                                left: '50%',
                                top: '50%',
                                '--tx': `${fly.tx}vw`,
                                '--ty': `${fly.ty}vh`,
                                animationDelay: `${fly.delay}s`
                            } as React.CSSProperties}
                        />
                    ))}
                    <div className="absolute text-amber-600 font-bold text-lg animate-fade-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        누군가 은혜를 나누었습니다
                    </div>
                </div>
            )}

            {/* Counter Text */}
            <div className="absolute bottom-4 right-4 text-xs text-amber-800/40 font-serif italic select-none z-10">
                {onlineCount > 1 ? `${onlineCount} lights shining` : '1 light shining'}
            </div>
        </div>
    );
}
