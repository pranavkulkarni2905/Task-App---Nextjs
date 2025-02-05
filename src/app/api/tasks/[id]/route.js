import { connectToDB } from "@/lib/mongodb";
import { Task } from "@/lib/models";
import { verifyToken } from "@/lib/authMiddleware";

export async function PUT(req, { params }) {
    try {
        const authResult = verifyToken(req);
        if (authResult.error) {
            return new Response(JSON.stringify({ message: authResult.error }), { status: 401 });
        }

        await connectToDB();
        const { title, description, dueDate, completed } = await req.json();
        
        const updatedTask = await Task.findOneAndUpdate(
            { _id: params.id, userId: authResult.userId },
            { title, description, dueDate, completed },
            { new: true }
        );

        if (!updatedTask) {
            return new Response(JSON.stringify({ message: "Task not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedTask), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const authResult = verifyToken(req);
        if (authResult.error) {
            return new Response(JSON.stringify({ message: authResult.error }), { status: 401 });
        }

        await connectToDB();
        const deletedTask = await Task.findOneAndDelete({ _id: params.id, userId: authResult.userId });

        if (!deletedTask) {
            return new Response(JSON.stringify({ message: "Task not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Task deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

