import { generateToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const userFromDb = await prisma.user.findUnique({
      where: { email },
      include: { team: true },
    });

    if (!userFromDb) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await verifyPassword(password, userFromDb.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = generateToken(userFromDb.id);

    const response = NextResponse.json({
      user: {
        id: userFromDb.id,
        name: userFromDb.name,
        email: userFromDb.email,
        role: userFromDb.role,
        teamId: userFromDb.teamId,
        team: userFromDb.team,
        token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("login failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
