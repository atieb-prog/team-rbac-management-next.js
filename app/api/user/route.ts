import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "you are not authorized to access user information" },
        { status: 401 },
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");

    const where: Prisma.UserWhereInput = {};
    if (user.role === Role.ADMIN) {
        // admin can see all users
    } else if (user.role === Role.MANAGER) {
        // manager can see users in their team or cross team users but not cross team managers
        where.OR = [
            { teamId: user.teamId },
            {
                role: Role.USER,
            },
        ];
    } else {
        // regular users can only see users in their team
        where.teamId = user.teamId;
        where.role = {not: Role.ADMIN};
    }

    if (teamId) {
      where.teamId = teamId;
    }
    if (role) {
      where.role = role as Role;
    }

    const users = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            team: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdAt: true,
        },
            orderBy: {createdAt: "desc",
        },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
