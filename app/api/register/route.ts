import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Team from "../../../models/Team";
import QRCode from "qrcode";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();

    // Validate required fields
    const { teamName, idea, leaderName, leaderEmail, members } = body;
    
    if (!teamName || !idea || !leaderName || !leaderEmail || !members) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leaderEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate members array
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: "At least one team member is required" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingTeam = await Team.findOne({ leaderEmail: leaderEmail.toLowerCase() });
    if (existingTeam) {
      return NextResponse.json(
        { error: "A team with this email is already registered" },
        { status: 409 }
      );
    }

    // Generate unique ticket ID
    const ticketId = "EVT-" + nanoid(8);

    // Create team in database
    await Team.create({
      ticketId,
      teamName: teamName.trim(),
      idea: idea.trim(),
      leaderName: leaderName.trim(),
      leaderEmail: leaderEmail.toLowerCase().trim(),
      members: members.map((m: string) => m.trim()).filter(Boolean)
    });

    // Generate QR code with error correction
    const qr = await QRCode.toDataURL(ticketId, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return NextResponse.json({ 
      ticketId, 
      qr,
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}