import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const count = await User.countDocuments();
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Error fetching registration count:", error);
        return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
    }
}
