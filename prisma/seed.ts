import { hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
async function main() {
    console.log("Seeding database...");

    const teams = await Promise.all([
        prisma.team.create({
            data: {
                name: "Team Alpha",
                description: "The first team",
                code: "ALPHA-001",
            },
        }),
        prisma.team.create({
            data: {
                name: "Team Beta",
                description: "The second team",
                code: "BETA-002",
            },
        }),
        prisma.team.create({
            data: {
                name: "Team Gamma",
                description: "The third team",
                code: "GAMMA-003",
            },
        }),
    ]);
    
    const sampleUsers = [
        {
            name: "Alice",
            email: "alice@example.com",
            teams: teams [0],
            role: Role.MANAGER,
        },
        {
            name: "Bob",
            email: "bob@example.com",
            teams: teams [1],
            role: Role.USER,
        },
        {
            name: "Charlie",
            email: "charlie@example.com",
            teams: teams [2],
            role: Role.MANAGER,
        }
    ];

    for (const userData of sampleUsers) {
        await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: await hashPassword("123456"),
                role: userData.role,
                teamId: userData.teams.id,
            },
        });
    }
    console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });