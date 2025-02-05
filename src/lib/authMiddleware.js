import jwt from "jsonwebtoken";

export function verifyToken(req) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { error: "Unauthorized. No token provided." };
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { userId: decoded.id };
    } catch (error) {
        return { error: "Invalid or expired token.",error };
    }
}
