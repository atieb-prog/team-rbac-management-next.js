"use client";

import { apiClient } from "@/app/lib/apiClient";
import { Role, Team, User } from "@/app/types";
import { useTransition } from "react";

interface AdminDashboardProps {
  users: User[];
  teams: Team[];
  currentUser: User;
}

const AdminDashboard = ({ users, teams, currentUser }: AdminDashboardProps) => {
  const [isPending, startTransition] = useTransition();

  const handleTeamAssignment = async (
    userId: string,
    teamId: string | null,
  ) => {
    startTransition(async () => {
      try {
        await apiClient.assignUserToTeam(userId, teamId);
        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to assign user to team",
        );
      }
    });
  };
  const handleRoleAssignment = async (userId: string, newRole: Role) => {
    if (currentUser.id === userId) {
      alert("You cannot change your own role.");
      return;
    }
    startTransition(async () => {
      try {
        await apiClient.updateUserRole(userId, newRole);
        window.location.reload();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to update user role",
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-300">User and team management</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* User Management Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Users ({users.length})</h3>
            <p className="text-slate-400 text-sm">
              Manage roles and team assignments
            </p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-2 text-slate-300 font-medium">
                    {" "}
                    Name{" "}
                  </th>
                  <th className="text-left py-2 px-2 text-slate-300 font-medium">
                    {" "}
                    Role{" "}
                  </th>
                  <th className="text-left py-2 px-2 text-slate-300 font-medium">
                    {" "}
                    Team{" "}
                  </th>
                  <th className="text-left py-2 px-2 text-slate-300 font-medium whitespace-nowrap">
                    {" "}
                    Actions{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-700 last:border-b-0 align-top"
                  >
                    <td className="py-3 px-2 text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-xs text-slate-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleAssignment(user.id, e.target.value as Role)
                        }
                        disabled={currentUser.id === user.id || isPending}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm"
                      >
                        <option value={Role.USER}>User</option>
                        <option value={Role.MANAGER}>Manager</option>
                        <option value={Role.ADMIN}>Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex flex-col gap-1.5">
                        <select
                          value={user.teamId || ""}
                          onChange={(e) =>
                            handleTeamAssignment(
                              user.id,
                              e.target.value || null,
                            )
                          }
                          disabled={isPending}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm"
                        >
                          <option value="">No Team</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                        {user.team && (
                          <span className="text-xs text-slate-500">
                            {user.team.code}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      {user.teamId && (
                        <button
                          onClick={() => handleTeamAssignment(user.id, null)}
                          disabled={isPending}
                          className="inline-flex items-center rounded-md border border-red-400/40 px-2.5 py-1 text-xs font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Management Section */}

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">Teams ({teams.length})</h3>
            <p className="text-slate-400 text-sm">Team Overview</p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-300"> Name </th>
                  <th className="text-left py-2 text-slate-300"> Code </th>
                  <th className="text-left py-2 text-slate-300"> Members </th>
                  <th className="text-left py-2 text-slate-300"> Managers </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const teamMembers = users.filter(
                    (user) => user.teamId === team.id,
                  );
                  const teamManagers = teamMembers.filter(
                    (user) => user.role === Role.MANAGER,
                  );

                  return (
                    <tr
                      key={team.id}
                      className="border-b border-slate-700 last:border-b-0"
                    >
                      <td className="py-2 text-slate-300 font-medium">
                        {team.name}
                      </td>
                      <td className="py-2">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                          {team.code}
                        </span>
                      </td>
                      <td className="py-2 text-slate-300">
                        {teamMembers.length} Users
                      </td>
                      <td className="py-2 text-slate-300">
                        {teamManagers.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teamManagers.map((manager) => (
                              <span
                                key={manager.id}
                                title={manager.name}
                                className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs"
                              >
                                {manager.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-xs">
                            No managers
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{users.length}</div>
          <div className="text-sm text-slate-400">Total Users</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {users.filter((user) => user.role === Role.ADMIN).length}
          </div>
          <div className="text-sm text-slate-400">Admins</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {users.filter((user) => user.role === Role.MANAGER).length}
          </div>
          <div className="text-sm text-slate-400">Managers</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {users.filter((user) => user.role === Role.USER).length}
          </div>
          <div className="text-sm text-slate-400">Users</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{teams.length}</div>
          <div className="text-sm text-slate-400">Teams</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
