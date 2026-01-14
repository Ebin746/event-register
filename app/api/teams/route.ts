import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Team from "../../../models/Team";

export async function GET() {
  try {
    await connectDB();
    
    const teams = await Team.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ teams });

  } catch (error) {
    console.error("Fetch teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}