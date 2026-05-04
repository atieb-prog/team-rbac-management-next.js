import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, teamCode } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }
    // Check if user already exists

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 402 },
      );
    }
    // If teamCode is provided, validate it and get the teamId
    let teamId: string | null = null;
    if (teamCode) {
      const team = await prisma.team.findUnique({ where: { code: teamCode } });
      if (!team) {
        return NextResponse.json(
          { error: "Invalid team code" },
          { status: 400 },
        );
      }
      teamId = team.id;
    }
    const hashedPassword = await hashPassword(password);

    // If this is the first user, assign them the ADMIN role, otherwise assign USER role

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        teamId,
        role,
      },
      include: { team: true },
    });

    const token = generateToken(user.id);

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId,
        team: user.team,
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
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
