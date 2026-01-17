import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone, department, campus, year } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!department?.trim()) {
      return NextResponse.json(
        { error: "Department is required" },
        { status: 400 }
      );
    }

    if (!campus?.trim()) {
      return NextResponse.json(
        { error: "Campus is required" },
        { status: 400 }
      );
    }

    if (!year?.trim()) {
      return NextResponse.json(
        { error: "Year is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check registration limit
    const limit = parseInt(process.env.NEXT_PUBLIC_REGISTRATION_LIMIT || "70", 10);
    const totalCount = await User.countDocuments();
    if (totalCount >= limit) {
      return NextResponse.json(
        { error: "Registration closed: limit reached" },
        { status: 403 }
      );
    }

    // Check if user already registered
    const existingUser = await User.findOne({ clerkId: clerkUser.id });
    if (existingUser) {
      return NextResponse.json(
        { error: "You have already registered for this event" },
        { status: 409 }
      );
    }

    // Check if email already used
    const emailExists = await User.findOne({
      email: clerkUser.emailAddresses[0]?.emailAddress
    });
    if (emailExists) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      );
    }

    // Generate unique ticket ID
    const ticketId = `GDG_SOE-${nanoid(8).toUpperCase()}`;

    // Create user record
    const user = await User.create({
      clerkId: clerkUser.id,
      ticketId,
      name: name.trim(),
      email: clerkUser.emailAddresses[0]?.emailAddress,
      phone: phone.trim(),
      department: department.trim(),
      campus: campus.trim(),
      year: year.trim(),
    });

    // Generate QR code
    const qr = await QRCode.toDataURL(ticketId, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      success: true,
      ticketId: user.ticketId,
      qr,
      message: "Registration successful!",
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This email or ticket ID already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}