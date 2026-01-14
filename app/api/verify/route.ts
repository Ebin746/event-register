import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Team from "../../../models/Team";

export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const team = await Team.findOne({ ticketId: ticketId.trim() });

    if (!team) {
      return NextResponse.json(
        { error: "Invalid ticket ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ team });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}