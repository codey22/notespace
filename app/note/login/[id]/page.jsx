"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function NoteLoginPage({ params }) {
    const [noteId, setNoteId] = useState(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            const p = await params;
            setNoteId(p.id);
        })();
    }, [params]);

    const handleLogin = async () => {
        setError("");
        if (!password) {
            setError("Password is required");
            return;
        }
        try {
            const res = await fetch(`/api/note/${noteId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.success) {
                try {
                    localStorage.setItem(`note_unlocked_${noteId}`, '1');
                } catch {}
                window.location.href = `/note/${noteId}`;
            } else {
                setError(data.error || "Login failed");
            }
        } catch {
            setError("Login failed");
        }
    };

    const handleOpenNewNote = () => {
        window.open('/', '_blank');
    };

    return (
        <main className="min-h-screen bg-bg flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 w-full max-w-sm flex flex-col items-center gap-4">
                <div className="text-2xl text-fg">Password</div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-fg text-sm"
                    autoFocus
                />
                {error && <div className="text-red-500 text-xs">{error}</div>}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogin}
                    className="w-full px-8 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all shadow-md"
                >
                    Log In
                </motion.button>
                <button
                    onClick={handleOpenNewNote}
                    className="text-sm text-accent hover:underline"
                >
                    Open a New Note
                </button>
            </div>
        </main>
    );
}
