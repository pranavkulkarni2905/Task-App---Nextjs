import { connectToDB } from "@/lib/mongodb";
import { User } from "@/lib/models";
import bcrypt from "bcryptjs";

export async function POST(req) {
   try {
       await connectToDB();
       const { username, email, password } = await req.json();

       // Check if user exists
       const existingUser = await User.findOne({ email });
       if (existingUser) {
           return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
       }

       // Hash password
       const hashedPassword = await bcrypt.hash(password, 10);

       // Create user
       const newUser = await User.create({ username, email, password: hashedPassword });

       return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
   } catch (error) {
       return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
   }
}
