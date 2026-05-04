import UserDashboard from "@/app/components/dashboard/UserDashboard";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { User } from "@/app/types";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch user specific data
  const teamMembers = user.teamId
    ? await prisma.user.findMany({
        where: {
          teamId: user.teamId,
        },

        select: {
            id: true,
            name: true,
            email: true,
            role: true,
          
        },
      })
    : [];

  return (
    <UserDashboard
      teamMembers={teamMembers as User[]}
      currentUser={user}
    />
  );
};

export default UserPage;
