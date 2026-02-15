'use client';
import { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string) => void;
    title?: string;
    loading?: boolean;
}

export default function PasswordModal({ isOpen, onClose, onSubmit, title = "비밀번호 입력", loading = false }: PasswordModalProps) {
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length === 4) {
            onSubmit(password);
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 relative animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-3">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">4자리 비밀번호를 입력해주세요</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        maxLength={4}
                        value={password}
                        onChange={(e) => setPassword(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full text-center text-3xl tracking-[0.5em] font-bold p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none mb-4 transition-colors"
                        placeholder="••••"
                        autoFocus
                        inputMode="numeric"
                    />
                    <button
                        type="submit"
                        disabled={password.length !== 4 || loading}
                        className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-[0.98]"
                    >
                        {loading ? '확인 중...' : '확인'}
                    </button>
                </form>
            </div>
        </div>
    );
}
