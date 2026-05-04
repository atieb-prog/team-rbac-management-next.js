import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();


// database helper function

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`; // Simple query to check connection
    return true;
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    return false;
  } 
}