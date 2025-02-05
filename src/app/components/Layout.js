"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <nav className="flex justify-between bg-blue-600 text-white p-4 rounded">
                <h1 className="text-xl font-bold">Task Manager</h1>
                <button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }} className="bg-red-500 px-3 py-2 rounded">
                    Logout
                </button>
            </nav>
            <div className="mt-5">{children}</div>
        </div>
    );
}
