import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json(
                { error: "Unauthorized. Please sign in." },
                { status: 401 }
            );
        }

        await connectDB();

        // Find user by Clerk ID
        const user = await User.findOne({ clerkId: clerkUser.id });

        // Get total registration count
        const totalRegistrations = await User.countDocuments();
        const registrationLimit = parseInt(process.env.NEXT_PUBLIC_REGISTRATION_LIMIT || "88");

        if (!user) {
            return NextResponse.json(
                {
                    error: "Not registered",
                    registered: false,
                    totalRegistrations,
                    registrationLimit
                },
                { status: 404 }
            );
        }

        // Generate QR code
        const qr = await QRCode.toDataURL(user.ticketId, {
            width: 400,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
        });

        return NextResponse.json({
            registered: true,
            ticketId: user.ticketId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            department: user.department,
            campus: user.campus,
            year: user.year,
            qr,
            createdAt: user.createdAt,
            totalRegistrations,
            registrationLimit
        });
    } catch (error) {
        console.error("Ticket fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch ticket" },
            { status: 500 }
        );
    }
}
