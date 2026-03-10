export type UserRow = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: 'Admin' | 'Ops' | 'Treasury' | 'Compliance';
  status: 'Active' | 'Invited' | 'Suspended';
  lastSeen: string;
};

const BASE: readonly UserRow[] = [
  {
    id: 'u1',
    initials: 'AS',
    name: 'Amit Singh',
    email: 'amit.singh@example.com',
    role: 'Admin',
    status: 'Active',
    lastSeen: 'Today, 09:44',
  },
  {
    id: 'u2',
    initials: 'MR',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    role: 'Ops',
    status: 'Active',
    lastSeen: 'Yesterday, 10:42',
  },
  {
    id: 'u3',
    initials: 'JM',
    name: 'Jorge Medina',
    email: 'jorge.medina@example.com',
    role: 'Compliance',
    status: 'Invited',
    lastSeen: 'Feb 10, 11:30',
  },
] as const;

function makeMore(): UserRow[] {
  const out: UserRow[] = [];
  for (let i = 0; i < 25; i++) {
    const pick = BASE[i % BASE.length]!;
    out.push({
      ...pick,
      id: `u${i + 4}`,
      name: `${pick.name} ${i + 1}`,
      email: pick.email.replace('@', `+${i + 1}@`),
      status: (i % 10 === 0 ? 'Suspended' : i % 4 === 0 ? 'Invited' : 'Active') as UserRow['status'],
      role: (i % 5 === 0 ? 'Treasury' : i % 3 === 0 ? 'Ops' : pick.role) as UserRow['role'],
      lastSeen: i % 2 === 0 ? 'Feb 8, 14:15' : 'Feb 7, 16:22',
    });
  }
  return out;
}

export const USERS: readonly UserRow[] = [...BASE, ...makeMore()];

