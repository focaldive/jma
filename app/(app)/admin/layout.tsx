import Prisma from "@/lib/prisma";
import {
  AdminClientLayout,
  NotificationItem,
} from "@/components/admin/AdminClientLayout";
import { formatDistanceToNow } from "date-fns";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the "current" user (Workaround: First active admin)
  // In a real app with sessions, you'd decode the JWT here.
  const adminUser = await Prisma.adminUser.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" }, // consistent default
  });

  // 2. Fetch Notifications
  const [unreadMessages, upcomingJanaza] = await Promise.all([
    Prisma.contactSubmission.findMany({
      where: { status: "NEW" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    Prisma.janazaNotice.findMany({
      where: { status: "UPCOMING" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Transform to NotificationItems
  const notifications: NotificationItem[] = [
    ...unreadMessages.map((m) => ({
      id: m.id,
      title: "New Message",
      description: `From: ${m.name} - ${m.subject || "No subject"}`,
      time: formatDistanceToNow(m.createdAt, { addSuffix: true }),
      type: "message" as const,
      link: "/admin/messages",
    })),
    ...upcomingJanaza.map((j) => ({
      id: j.id,
      title: "Upcoming Janaza",
      description: `${j.deceasedName} at ${j.prayerLocation || "TBD"}`,
      time: formatDistanceToNow(j.createdAt, { addSuffix: true }),
      type: "janaza" as const,
      link: "/admin/janaza",
    })),
  ].sort((a, b) => (a.time > b.time ? 1 : -1)); // Simple sort (imperfect with relative time strings, but sufficient for now)

  return (
    <AdminClientLayout user={adminUser} notifications={notifications}>
      {children}
    </AdminClientLayout>
  );
}
