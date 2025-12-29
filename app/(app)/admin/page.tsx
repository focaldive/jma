"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { ActivityItem } from "@/components/admin/ActivityItem";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  CalendarDays,
  Cross,
  TrendingUp,
  ArrowUpRight,
  Bell,
  Megaphone,
} from "lucide-react";

const recentActivities = [
  {
    name: "Ahmed Mohamed",
    action: "Made a donation of Rs. 5,000",
    time: "2h ago",
    type: "donation" as const,
  },
  {
    name: "Fathima Begum",
    action: "Registered for Community Event",
    time: "3h ago",
    type: "event" as const,
  },
  {
    name: "Admin",
    action: "Published new article: Annual Report",
    time: "5h ago",
    type: "news" as const,
  },
  {
    name: "System",
    action: "Janaza announcement posted",
    time: "6h ago",
    type: "janaza" as const,
  },
  {
    name: "Ibrahim Khan",
    action: "Joined as new member",
    time: "1d ago",
    type: "default" as const,
  },
];

const notifications = [
  {
    title: "New Donation Received",
    description: "Rs. 10,000 from Anonymous",
    time: "1 hour ago",
  },
  {
    title: "Event Registration Full",
    description: "Community Iftar has reached capacity",
    time: "3 hours ago",
  },
  {
    title: "New Message",
    description: "You have 5 unread messages",
    time: "5 hours ago",
  },
  {
    title: "Newsletter Scheduled",
    description: "December newsletter ready",
    time: "1 day ago",
  },
];

export default function AdminDashboard() {
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
          <Button className="mt-6 bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg">
            Explore Now
          </Button>
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
          value="Rs. 1.25M"
          change="+12.5% from last month"
          changeType="increase"
          icon={Heart}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Active Members"
          value="2,847"
          change="+8.2% from last month"
          changeType="increase"
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Upcoming Events"
          value="12"
          change="3 this week"
          changeType="neutral"
          icon={CalendarDays}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Pending Janaza"
          value="2"
          change="Updated today"
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
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              View Report
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Simple Bar Chart Visualization */}
          <div className="flex items-end justify-between h-36 sm:h-48 gap-1 sm:gap-2 px-2 sm:px-4">
            {[
              { month: "Jan", value: 65 },
              { month: "Feb", value: 45 },
              { month: "Mar", value: 80 },
              { month: "Apr", value: 70 },
              { month: "May", value: 90 },
              { month: "Jun", value: 55 },
              { month: "Jul", value: 75 },
              { month: "Aug", value: 85 },
              { month: "Sep", value: 60 },
              { month: "Oct", value: 95 },
              { month: "Nov", value: 88 },
              { month: "Dec", value: 72 },
            ].map((item, i) => (
              <div
                key={item.month}
                className="flex flex-col items-center flex-1"
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
          <Button
            variant="outline"
            className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View More
          </Button>
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
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              View All
            </Button>
          </div>
          <div className="space-y-1">
            {recentActivities.map((activity, i) => (
              <ActivityItem
                key={i}
                name={activity.name}
                action={activity.action}
                time={activity.time}
                type={activity.type}
              />
            ))}
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
              Annual General Meeting 2024
            </h3>
            <p className="text-purple-100 text-sm mb-4">
              Join us for the AGM on December 28th. All members are invited to
              participate.
            </p>
            <Button className="bg-white text-purple-600 hover:bg-purple-50 text-sm">
              Learn More
            </Button>
          </div>

          {/* Other Announcements */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Community Iftar Event
                </p>
                <p className="text-xs text-gray-500">Starting Ramadan 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New Project: Water Well
                </p>
                <p className="text-xs text-gray-500">Goal: Rs. 500,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
