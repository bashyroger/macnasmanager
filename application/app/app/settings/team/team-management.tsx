"use client";

import { useState, useTransition } from "react";
import { updateUserRole, inviteUser, UserRole } from "./actions";
import {
  Shield,
  UserCog,
  Mail,
  Clock,
  CheckCircle2,
  Loader2,
  UserPlus,
  Lock,
  ChevronDown,
} from "lucide-react";

type User = {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  created_at: string;
  invited_at: string | null;
};

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  owner_admin: {
    label: "Owner / Admin",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: Shield,
  },
  editor: {
    label: "Editor",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: UserCog,
  },
};

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] ?? { label: role, color: "text-gray-600", bg: "bg-gray-100 border-gray-200", icon: UserCog };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function UserAvatar({ email, name }: { email: string; name?: string | null }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email[0].toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#be7b3b] to-[#a86330] flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-white text-sm font-bold">{initials}</span>
    </div>
  );
}

function RoleDropdown({
  currentRole,
  userId,
  isSelf,
  onUpdated,
}: {
  currentRole: string;
  userId: string;
  isSelf: boolean;
  onUpdated: (userId: string, newRole: UserRole) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  if (isSelf) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
        <Lock className="w-3.5 h-3.5" />
        Locked (you)
      </div>
    );
  }

  const handleSelect = (newRole: UserRole) => {
    setOpen(false);
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (!result.error) {
        onUpdated(userId, newRole);
      }
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e5e0d8] bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-60 shadow-sm"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
        Change Role
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-[#e5e0d8] shadow-xl z-20 overflow-hidden">
            {(Object.entries(ROLE_CONFIG) as [UserRole, (typeof ROLE_CONFIG)[string]][]).map(([role, config]) => {
              const Icon = config.icon;
              const isActive = role === currentRole;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelect(role)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                    isActive ? "bg-[#faf9f7] font-semibold text-[#1a1714]" : "text-gray-600 hover:bg-[#faf9f7]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <div>
                    <p className="font-medium">{config.label}</p>
                    <p className="text-xs text-gray-400">
                      {role === "owner_admin" ? "Full access, can manage team" : "Can edit and view content"}
                    </p>
                  </div>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-[#be7b3b] ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function InviteForm({ onInvited }: { onInvited: (email: string, role: UserRole) => void }) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("editor");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    startTransition(async () => {
      const result = await inviteUser(email.trim(), role);
      if (result.error) {
        setStatus({ type: "error", message: result.error });
      } else {
        setStatus({ type: "success", message: `Invitation sent to ${email}!` });
        onInvited(email, role);
        setEmail("");
        setRole("editor");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#e5e0d8] bg-gray-50/50">
        <h2 className="font-bold text-[#1a1714] flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#be7b3b] rounded-full" />
          Invite New Member
        </h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          They will receive a sign-up link via email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#1a1714] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="colleague@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-white text-sm transition-all outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] hover:border-gray-300"
            />
          </div>
          <div className="sm:w-52">
            <label className="block text-xs font-semibold text-[#1a1714] mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e5e0d8] bg-white text-sm transition-all outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] hover:border-gray-300 appearance-none cursor-pointer"
            >
              <option value="editor">Editor</option>
              <option value="owner_admin">Owner / Admin</option>
            </select>
          </div>
          <div className="sm:self-end">
            <button
              type="submit"
              disabled={isPending || !email}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-bold hover:bg-[#a86330] disabled:opacity-60 transition-all shadow-lg shadow-[#be7b3b]/20"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Send Invite</>
              )}
            </button>
          </div>
        </div>

        {status && (
          <div
            className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
              status.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <span className="w-4 h-4 flex-shrink-0 rounded-full bg-red-400 text-white text-xs flex items-center justify-center font-bold">!</span>
            )}
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}

export function TeamManagement({
  currentUserId,
  initialUsers,
}: {
  currentUserId: string;
  initialUsers: User[];
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleRoleUpdated = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleInvited = (email: string, role: UserRole) => {
    // Optimistically add as a pending user
    const pendingUser: User = {
      id: `pending-${email}`,
      email,
      role,
      full_name: null,
      created_at: new Date().toISOString(),
      invited_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, pendingUser]);
  };

  const activeUsers = users.filter((u) => !u.invited_at || u.id.startsWith("pending-") === false);
  const pendingUsers = users.filter((u) => u.invited_at && !u.id.startsWith("pending-"));

  return (
    <div className="space-y-8">
      {/* Active Members */}
      <div className="bg-white rounded-2xl border border-[#e5e0d8] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#e5e0d8] bg-gray-50/50">
          <h2 className="font-bold text-[#1a1714] flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#be7b3b] rounded-full" />
            Team Members
            <span className="ml-auto text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {users.length} total
            </span>
          </h2>
        </div>

        <div className="divide-y divide-[#f5f0eb]">
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const isPending = !!user.invited_at && new Date(user.invited_at) > new Date(user.created_at);

            return (
              <div
                key={user.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#faf9f7] transition-colors"
              >
                <UserAvatar email={user.email} name={user.full_name} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#1a1714] truncate">
                      {user.full_name || user.email}
                    </p>
                    {isSelf && (
                      <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                        you
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        Invite Pending
                      </span>
                    )}
                  </div>
                  {user.full_name && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                  )}
                </div>

                <RoleBadge role={user.role} />

                <RoleDropdown
                  currentRole={user.role}
                  userId={user.id}
                  isSelf={isSelf}
                  onUpdated={handleRoleUpdated}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Form */}
      <InviteForm onInvited={handleInvited} />

      {/* Role Guide */}
      <div className="bg-[#faf9f7] rounded-2xl border border-[#e5e0d8] p-6">
        <h3 className="text-sm font-bold text-[#1a1714] mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(ROLE_CONFIG).map(([role, config]) => {
            const Icon = config.icon;
            return (
              <div key={role} className={`rounded-xl border p-4 ${config.bg}`}>
                <div className={`flex items-center gap-2 font-semibold text-sm mb-2 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                  {config.label}
                </div>
                <ul className="space-y-1 text-xs text-gray-600">
                  {role === "owner_admin" ? (
                    <>
                      <li>✓ Full access to all data</li>
                      <li>✓ Manage team members &amp; roles</li>
                      <li>✓ Edit website content</li>
                      <li>✓ Manage settings &amp; integrations</li>
                    </>
                  ) : (
                    <>
                      <li>✓ View and edit projects, clients, time</li>
                      <li>✓ Upload and manage media</li>
                      <li>✗ Cannot manage team or roles</li>
                      <li>✗ Limited settings access</li>
                    </>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
