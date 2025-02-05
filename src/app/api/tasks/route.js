import { connectToDB } from "@/lib/mongodb";
import { Task } from "@/lib/models";
import { verifyToken } from "@/lib/authMiddleware";

export async function POST(req) {
    try {
        const authResult = verifyToken(req);
        if (authResult.error) {
            return new Response(JSON.stringify({ message: authResult.error }), { status: 401 });
        }

        await connectToDB();
        const { title, description, dueDate } = await req.json();

        const newTask = await Task.create({
            userId: authResult.userId,
            title,
            description,
            dueDate,
        });

        return new Response(JSON.stringify(newTask), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server error",error }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        const authResult = verifyToken(req);
        if (authResult.error) {
            return new Response(JSON.stringify({ message: authResult.error }), { status: 401 });
        }

        await connectToDB();
        const tasks = await Task.find({ userId: authResult.userId }).sort({ createdAt: -1 });

        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server error",error }), { status: 500 });
    }
}

