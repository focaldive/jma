import Prisma from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";
import { ActivityItem } from "@/components/admin/ActivityItem";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  CalendarDays,
  Cross,
  ArrowUpRight,
  Bell,
  Megaphone,
  Briefcase,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link"; // Added for navigation if needed

export default async function AdminDashboard() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // Fetch all necessary data in parallel
  const [
    totalDonationResult,
    userCount,
    teamMemberCount,
    upcomingEventCount,
    pendingJanazaCount,
    recentDonations,
    recentEvents,
    recentUsers,
    recentJanaza,
    recentArticles,
    monthlyDonationsRaw,
    unreadMessagesCount,
    latestJanazaNotice,
  ] = await Promise.all([
    Prisma.donation.aggregate({ _sum: { amount: true } }),
    Prisma.user.count(),
    Prisma.teamMember.count({ where: { isActive: true } }),
    Prisma.event.count({ where: { date: { gte: today } } }),
    Prisma.janazaNotice.count({ where: { status: "UPCOMING" } }),
    Prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    Prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    Prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    Prisma.janazaNotice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    Prisma.newsArticle.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    Prisma.donation.findMany({
      where: { createdAt: { gte: startOfYear } },
      select: { amount: true, createdAt: true },
    }),
    Prisma.contactSubmission.count({ where: { status: "NEW" } }),
    Prisma.janazaNotice.findFirst({
      orderBy: { createdAt: "desc" },
      take: 1,
    }),
  ]);

  // Process Stats
  const totalDonations = totalDonationResult._sum.amount
    ? Number(totalDonationResult._sum.amount)
    : 0;

  // Combine and sort recent activities
  const activities = [
    ...recentDonations.map((d) => ({
      name: d.isAnonymous
        ? "Anonymous"
        : `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Donor",
      action: `Donated ${d.currency} ${d.amount}`,
      time: d.createdAt,
      type: "donation" as const,
      avatar: undefined,
    })),
    ...recentEvents.map((e) => ({
      name: "Event System",
      action: `New Event: ${e.title}`,
      time: e.createdAt,
      type: "event" as const,
      avatar: undefined,
    })),
    ...recentUsers.map((u) => ({
      name: u.name || "New User",
      action: "Joined the platform",
      time: u.createdAt,
      type: "default" as const,
      avatar: u.image || undefined,
    })),
    ...recentJanaza.map((j) => ({
      name: "Janaza System",
      action: `Notice: ${j.deceasedName}`,
      time: j.createdAt,
      type: "janaza" as const,
      avatar: undefined,
    })),
    ...recentArticles.map((a) => ({
      name: "Content System",
      action: `Published: ${a.title}`,
      time: a.createdAt,
      type: "news" as const,
      avatar: undefined,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5);

  // Process Monthly Chart Data
  const monthlyData = Array(12).fill(0);
  monthlyDonationsRaw.forEach((d) => {
    monthlyData[d.createdAt.getMonth()] += Number(d.amount);
  });

  const maxMonthlyValue = Math.max(...monthlyData, 1);
  const chartData = monthlyData.map((val, idx) => {
    const month = new Date(0, idx).toLocaleString("default", {
      month: "short",
    });
    return {
      month,
      value: Math.min(Math.round((val / maxMonthlyValue) * 100), 100), // Height percentage
      rawAmount: val,
    };
  });

  // Construct Notifications
  const notifications = [];
  if (unreadMessagesCount > 0) {
    notifications.push({
      title: "New Messages",
      description: `You have ${unreadMessagesCount} unread message(s)`,
      time: "Just now",
    });
  }
  if (pendingJanazaCount > 0) {
    notifications.push({
      title: "Pending Janaza Notices",
      description: `${pendingJanazaCount} notice(s) require attention`,
      time: "Just now",
    });
  }
  if (upcomingEventCount > 0) {
    notifications.push({
      title: "Upcoming Events",
      description: `${upcomingEventCount} event(s) coming up`,
      time: "Check calendar",
    });
  }
  if (notifications.length === 0) {
    notifications.push({
      title: "All caught up!",
      description: "No new notifications",
      time: "",
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            Welcome Back, Admin!
          </h1>
          <p className="text-blue-100 max-w-md text-sm sm:text-base">
            Manage your organization efficiently. Track donations, events, and
            stay connected with your community.
          </p>
          <Link href="/admin/projects">
            <Button className="mt-6 bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg">
              Manage Projects
            </Button>
          </Link>
        </div>
        {/* Decorative elements - hidden on mobile */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
          <div className="w-48 h-48 bg-white rounded-3xl rotate-12"></div>
        </div>
        <div className="absolute right-24 top-1/2 -translate-y-1/2 opacity-10 hidden md:block">
          <div className="w-32 h-32 bg-white rounded-2xl -rotate-12"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Donations"
          value={`Rs. ${totalDonations.toLocaleString()}`}
          //   change="+12.5% from last month"
          //   changeType="increase"
          icon={Heart}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        
        <StatsCard
          title="Team Members"
          value={teamMemberCount.toLocaleString()}
          change="Active members"
          changeType="neutral"
          icon={Briefcase}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatsCard
          title="Upcoming Events"
          value={upcomingEventCount.toString()}
          change={`${upcomingEventCount} scheduled`}
          changeType="neutral"
          icon={CalendarDays}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Upcoming Janaza"
          value={pendingJanazaCount.toString()}
          change={
            latestJanazaNotice
              ? formatDistanceToNow(latestJanazaNotice.updatedAt, {
                  addSuffix: true,
                })
              : "No active notices"
          }
          changeType="neutral"
          icon={Cross}
          iconBgColor="bg-gray-100"
          iconColor="text-gray-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Monthly Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Donations
              </h2>
              <p className="text-sm text-gray-500">
                Overview of donations this year
              </p>
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              View Report
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button> */}
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="flex items-end justify-between h-36 sm:h-48 gap-1 sm:gap-2 px-2 sm:px-4">
            {chartData.map((item, i) => (
              <div
                key={item.month}
                className="flex flex-col items-center flex-1"
                title={`Rs. ${item.rawAmount.toLocaleString()}`}
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${item.value}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {notifications.map((notification, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* <Button
            variant="outline"
            className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View More
          </Button> */}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h2>
            {/* <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              View All
            </Button> */}
          </div>
          <div className="space-y-1">
            {activities.length > 0 ? (
              activities.map((activity, i) => (
                <ActivityItem
                  key={i}
                  name={activity.name}
                  action={activity.action}
                  time={formatDistanceToNow(activity.time, { addSuffix: true })}
                  type={activity.type}
                  avatar={activity.avatar}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity.
              </p>
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Announcements
            </h2>
            <Megaphone className="w-5 h-5 text-gray-400" />
          </div>

          {/* Featured Announcement */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white mb-4">
            <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">
              Featured
            </span>
            <h3 className="font-semibold text-lg mb-2">
              Annual General Meeting 2026
            </h3>
            <p className="text-purple-100 text-sm mb-4">
              Join us for the AGM. All members are invited to participate.
            </p>
            <Button className="bg-white text-purple-600 hover:bg-purple-50 text-sm">
              Learn More
            </Button>
          </div>

          {/* Other Announcements - Hardcoded or fetched if we have an announcement model */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Community Iftar Event
                </p>
                <p className="text-xs text-gray-500">Starting Ramadan 2026</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New Project: Water Well
                </p>
                <p className="text-xs text-gray-500">Goal: Rs. 500,000</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
