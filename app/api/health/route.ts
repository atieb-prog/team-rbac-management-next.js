import { checkDatabaseConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const dbConnected = await checkDatabaseConnection();
  if (!dbConnected) {
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { status: "ok", message: "Database connection successfuly" },
    { status: 200 },
  );
}
