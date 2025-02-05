import { connectToDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
   try {
       await connectToDB();
       const { email, password } = await req.json();

       // Find user
       const user = await User.findOne({ email });
       if (!user) {
           return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
       }

       // Compare password
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
           return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
       }

       // Generate JWT token
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

       return new Response(JSON.stringify({ token }), { status: 200 });
   } catch (error) {
       return new Response(JSON.stringify({ message: "Server error",error }), { status: 500 });
   }
}
