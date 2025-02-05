"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchTasks() {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch("/api/tasks", {
                headers: { "Authorization": `Bearer ${token}` },
            });

            const data = await res.json();
            setLoading(false);
            if (res.ok) {
                setTasks(data);
            }
        }

        fetchTasks();
    }, [router]);

    async function handleCreateTask(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, dueDate }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            setTasks([...tasks, data]); // Add new task to list
            setTitle("");
            setDescription("");
            setDueDate("");
        } else {
            setError(data.message);
        }
    }

    async function toggleTaskCompletion(taskId, completed) {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ completed }),
        });

        if (res.ok) {
            setTasks(tasks.map(task => task._id === taskId ? { ...task, completed } : task));
        }
    }

    async function handleDeleteTask(taskId) {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (res.ok) {
            setTasks(tasks.filter(task => task._id !== taskId));
        }
    }

    // async function handleEditTask(taskId, updatedTitle, updatedDescription) {
    //     const token = localStorage.getItem("token");
    //     if (!token) return router.push("/login");
    
    //     const res = await fetch(`/api/tasks/${taskId}`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({
    //             title: updatedTitle,
    //             description: updatedDescription,
    //         }),
    //     });
    
    //     if (res.ok) {
    //         setTasks(tasks.map(task => task._id === taskId ? { ...task, title: updatedTitle, description: updatedDescription } : task));
    //     }
    // }
    

    return (
        <Layout>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Your Tasks</h2>

            {/* Task Creation Form */}
            <form onSubmit={handleCreateTask} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                {error && <p className="text-red-500">{error}</p>}
                <input
                    type="text"
                    placeholder="Task Title"
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="date"
                    className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg">
                    {loading ? "Adding..." : "Add Task"}
                </button>
            </form>

            {/* Task List */}
            {loading ? (
                <p className="text-center text-gray-600">Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p className="text-center text-gray-600">No tasks found.</p>
            ) : (
                <ul className="space-y-4">
                    {tasks.map((task) => (
                        <li key={task._id} className="flex justify-between items-center bg-white p-4 shadow-lg rounded-lg hover:bg-gray-100 transition">
                            <div className="flex flex-col">
                                <h3 className={`text-xl font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>{task.title}</h3>
                                <p className="text-gray-700">{task.description}</p>
                                <p className="text-sm text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => toggleTaskCompletion(task._id, !task.completed)}
                                    className={`p-2 rounded-lg ${task.completed ? "bg-green-500" : "bg-gray-400"} text-white transition`}
                                >
                                    <CheckIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="p-2 bg-red-500 text-white rounded-lg transition hover:bg-red-600"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Layout>
    );
}
