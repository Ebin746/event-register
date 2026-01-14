// File: app/api/checkin/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Team from "../../../models/Team";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { ticketId } = body;

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const team = await Team.findOne({ ticketId: ticketId.trim() });

    if (!team) {
      return NextResponse.json(
        { error: "Invalid ticket ID - Team not found" },
        { status: 404 }
      );
    }

    // Check if already checked in
    if (team.checkedIn) {
      return NextResponse.json(
        { 
          error: "Team already checked in",
          team: {
            teamName: team.teamName,
            ticketId: team.ticketId,
            checkedInAt: team.checkedInAt
          }
        },
        { status: 409 }
      );
    }

    // Update team - mark as checked in
    team.checkedIn = true;
    team.checkedInAt = new Date();
    await team.save();

    return NextResponse.json({ 
      message: "Check-in successful",
      team: {
        teamName: team.teamName,
        ticketId: team.ticketId,
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        members: team.members,
        checkedIn: team.checkedIn,
        checkedInAt: team.checkedInAt
      }
    });

  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Check-in failed. Please try again." },
      { status: 500 }
    );
  }
}