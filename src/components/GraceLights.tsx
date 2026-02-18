'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

interface PresenceState {
    [key: string]: any;
}

export default function GraceLights() {
    const [onlineCount, setOnlineCount] = useState(1);
    const [showFlash, setShowFlash] = useState(false);

    // 1. ORB LOGIC (Restored)
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
        const count = Math.min(Math.max(onlineCount, 1), 30);
        return orbPool.slice(0, count);
    }, [onlineCount, orbPool]);

    // 2. CANDLE LOGIC
    const candlePositions = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: (i * 7) % 95 + Math.random() * 5,
            scale: 0.8 + Math.random() * 0.4,
            delay: Math.random() * 2,
        }));
    }, []);

    const activeCandles = useMemo(() => {
        const count = Math.min(Math.max(onlineCount, 1), 20);
        return candlePositions.slice(0, count);
    }, [onlineCount, candlePositions]);

    // 3. FIREFLY LOGIC
    const fireflies = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            tx: (Math.random() - 0.5) * 100,
            ty: (Math.random() - 0.5) * 100 - 20,
            delay: Math.random() * 0.5,
        }));
    }, []);

    useEffect(() => {
        const channel = supabase.channel('online-users', {
            config: { presence: { key: Math.random().toString(36).substring(7) } },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState<PresenceState>();
                const count = Object.keys(newState).length;
                console.log('Presence sync:', count);
                setOnlineCount(count);
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'qt_logs' }, () => {
                triggerFlash();
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ online_at: new Date().toISOString() });
                }
            });

        return () => { supabase.removeChannel(channel); };
    }, []);

    const triggerFlash = () => {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 3000);
    };

    return (
        // Changed z-0 to z-50 to bring to front, keeping pointer-events-none to click through
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">

            {/* 1. ORBS (Floating Lights) */}
            {activeOrbs.map((orb) => (
                <div
                    key={`orb-${orb.id}`}
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

            {/* 2. CANDLES (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-32 flex items-end px-4 overflow-hidden mask-image-gradient">
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent pointer-events-none" />

                {activeCandles.map((candle) => (
                    <div
                        key={`candle-${candle.id}`}
                        className="absolute bottom-0 transition-all duration-1000 ease-out"
                        style={{
                            left: `${candle.left}%`,
                            transform: `scale(${candle.scale})`,
                            zIndex: Math.floor(candle.scale * 10),
                        }}
                    >
                        <div className="relative flex flex-col items-center">
                            {/* Flame */}
                            <div
                                className="w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-300 to-white rounded-[50%] blur-[1px] animate-flicker origin-bottom"
                                style={{ animationDelay: `${candle.delay}s` }}
                            >
                                <div className="absolute inset-0 bg-yellow-400 opacity-50 blur-[6px] rounded-full animate-pulse" />
                            </div>
                            {/* Wick */}
                            <div className="w-[2px] h-2 bg-black/60 -mt-1" />
                            {/* Wax Body */}
                            <div className="w-8 h-12 bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg shadow-inner border border-amber-200/50" />
                            {/* Reflection on floor */}
                            <div className="w-20 h-4 bg-amber-500/20 blur-md rounded-full -mt-2" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. FIREFLIES (Celebration) */}
            {showFlash && (
                <div className="absolute inset-0 flex items-center justify-center z-[60]">
                    <div className="w-full h-full absolute animate-flash-overlay bg-amber-100/20" />
                    {fireflies.map((fly) => (
                        <div
                            key={`firefly-${fly.id}`}
                            className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full animate-firefly-spread shadow-[0_0_10px_rgba(252,211,77,0.9)]"
                            style={{
                                left: '50%',
                                top: '60%',
                                '--tx': `${fly.tx}vw`,
                                '--ty': `${fly.ty}vh`,
                                animationDelay: `${fly.delay}s`
                            } as React.CSSProperties}
                        />
                    ))}
                    <div className="absolute top-1/3 w-full text-center text-amber-600/90 font-serif font-bold text-xl animate-fade-up opacity-0 drop-shadow-sm" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        누군가 기도의 불을 밝혔습니다
                    </div>
                </div>
            )}

            {/* Counter Text */}
            <div className="absolute bottom-2 right-4 text-[10px] text-amber-900/50 font-serif italic select-none z-50">
                {onlineCount > 1 ? `${onlineCount} lights shining` : '1 light shining'}
            </div>
        </div>
    );
}
