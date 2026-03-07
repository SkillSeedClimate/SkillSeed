import { useState } from "react";
import { Link } from "react-router";
import {
  Star,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin,
  Leaf,
  Flame,
  Target,
  Calendar,
  ChevronRight,
  Lock,
  BarChart2,
  Zap,
  TreePine,
  Sun,
  Wrench,
  Sprout,
  Users,
  BookOpen,
} from "lucide-react";

const applications = [
  {
    project: "Coastal Reforestation Drive",
    org: "Forest Foundation PH",
    location: "Surigao del Norte",
    status: "Accepted",
    appliedDate: "Feb 20, 2026",
    startDate: "April 5, 2026",
    role: "Volunteer",
    points: 300,
    image: "https://images.unsplash.com/photo-1752169580565-c2515f8973f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Reforestation",
  },
  {
    project: "Urban Rooftop Garden Setup",
    org: "GreenCity Initiative",
    location: "Manila, NCR",
    status: "In Progress",
    appliedDate: "Jan 15, 2026",
    startDate: "Mar 15, 2026",
    role: "Volunteer",
    points: 150,
    image: "https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Urban Farming",
  },
  {
    project: "Repair Café & Reuse Workshop",
    org: "Zero Waste Collective",
    location: "Davao City",
    status: "Completed",
    appliedDate: "Dec 1, 2025",
    startDate: "Jan 10, 2026",
    role: "Volunteer",
    points: 100,
    image: "https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Repair Skills",
  },
  {
    project: "Neighborhood Composting Hub",
    org: "EcoBarangay Network",
    location: "Quezon City",
    status: "Completed",
    appliedDate: "Oct 5, 2025",
    startDate: "Nov 1, 2025",
    role: "Volunteer",
    points: 120,
    image: "https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Composting",
  },
  {
    project: "Community Solar Panel Installation",
    org: "SolarPH Foundation",
    location: "Cebu City",
    status: "Pending Review",
    appliedDate: "Mar 1, 2026",
    startDate: "Mar 22, 2026",
    role: "Professional",
    points: 250,
    image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Energy Saving",
  },
];

const badges = [
  { name: "First Seed", icon: <Sprout className="w-6 h-6" />, desc: "Completed first mission", earned: true, date: "Nov 2025", color: "bg-emerald-100 text-emerald-700" },
  { name: "Composter", icon: <Leaf className="w-6 h-6" />, desc: "Completed composting mission", earned: true, date: "Nov 2025", color: "bg-lime-100 text-lime-700" },
  { name: "Repairer", icon: <Wrench className="w-6 h-6" />, desc: "Completed repair skills mission", earned: true, date: "Jan 2026", color: "bg-blue-100 text-blue-700" },
  { name: "Solar Starter", icon: <Sun className="w-6 h-6" />, desc: "Energy saving mission", earned: false, date: null, color: "bg-amber-100 text-amber-700" },
  { name: "Forest Guardian", icon: <TreePine className="w-6 h-6" />, desc: "Complete a reforestation mission", earned: false, date: null, color: "bg-green-100 text-green-700" },
  { name: "Team Leader", icon: <Users className="w-6 h-6" />, desc: "Lead a community challenge", earned: false, date: null, color: "bg-purple-100 text-purple-700" },
];

const impactStats = [
  { label: "CO₂ Offset", value: "124 kg", icon: <Leaf className="w-5 h-5" />, color: "text-[#2F8F6B]" },
  { label: "Trees Planted", value: "42", icon: <TreePine className="w-5 h-5" />, color: "text-green-600" },
  { label: "Items Repaired", value: "18", icon: <Wrench className="w-5 h-5" />, color: "text-blue-600" },
  { label: "People Reached", value: "380", icon: <Users className="w-5 h-5" />, color: "text-teal-600" },
];

const completedMissions = applications.filter(a => a.status === "Completed");
const totalPoints = completedMissions.reduce((sum, a) => sum + a.points, 0);
const profileCompletion = 72;

export function ProgressTracker() {
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "badges">("overview");

  const statusColor: Record<string, string> = {
    "Accepted": "bg-green-100 text-green-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Completed": "bg-[#E6F4EE] text-[#0F3D2E]",
    "Pending Review": "bg-amber-100 text-amber-700",
    "Rejected": "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#F9FDFB]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D2E] to-[#1A5C43] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-[#2F8F6B] rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-[Manrope] flex-shrink-0">
              AL
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-white font-[Manrope] font-bold text-2xl">Ana Lim</h1>
                <span className="bg-[#2F8F6B]/30 text-[#6DD4A8] text-xs font-semibold px-2.5 py-1 rounded-full">
                  Climate Volunteer
                </span>
                <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Manila, NCR
                </span>
              </div>
              <p className="text-[#A8D5BF] text-sm">Member since October 2025 · {completedMissions.length} missions completed</p>
              {/* Profile completion bar */}
              <div className="mt-4 max-w-sm">
                <div className="flex justify-between text-xs text-[#A8D5BF] mb-1.5">
                  <span>Profile Completion</span>
                  <span className="font-semibold text-white">{profileCompletion}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6DD4A8] rounded-full transition-all duration-700"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="text-xs text-[#A8D5BF] mt-1">Add credentials to complete your profile</p>
              </div>
            </div>
            {/* Total points */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center min-w-[120px]">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-[#A8D5BF] text-xs font-medium">Total Points</span>
              </div>
              <div className="text-3xl font-[Manrope] font-bold text-white">{totalPoints}</div>
              <p className="text-[#6DD4A8] text-xs mt-0.5">Level 4 · Sapling</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-8 w-fit">
          {(["overview", "applications", "badges"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "bg-[#0F3D2E] text-white" : "text-gray-600 hover:bg-[#E6F4EE] hover:text-[#0F3D2E]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Impact stats */}
            <div>
              <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl mb-4">My Climate Impact</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                    <div className={`${stat.color} flex justify-center mb-2`}>{stat.icon}</div>
                    <div className="text-2xl font-[Manrope] font-bold text-[#0F3D2E]">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Streak */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">Activity Streak</h3>
                    <p className="text-xs text-gray-500">Keep the momentum going!</p>
                  </div>
                </div>
                <div className="text-4xl font-[Manrope] font-bold text-[#0F3D2E] mb-1">14 days</div>
                <p className="text-sm text-gray-500">Your longest streak: <span className="font-semibold text-[#2F8F6B]">21 days</span></p>
                <div className="flex gap-1.5 mt-4">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className={`h-5 flex-1 rounded-sm ${i < 14 ? "bg-[#2F8F6B]" : "bg-gray-100"}`} />
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={`e-${i}`} className="h-5 flex-1 rounded-sm bg-gray-100" />
                  ))}
                </div>
              </div>

              {/* Level up */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#E6F4EE] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#2F8F6B]" />
                  </div>
                  <div>
                    <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">Level Progress</h3>
                    <p className="text-xs text-gray-500">Level 4 → Level 5: Tree</p>
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <div>
                    <p className="text-3xl font-[Manrope] font-bold text-[#0F3D2E]">{totalPoints}</p>
                    <p className="text-xs text-gray-500">current points</p>
                  </div>
                  <div className="text-gray-300 text-2xl mb-1">/</div>
                  <div>
                    <p className="text-2xl font-[Manrope] font-bold text-gray-400">600</p>
                    <p className="text-xs text-gray-500">to level 5</p>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#2F8F6B] to-[#6DD4A8] rounded-full" style={{ width: `${(totalPoints / 600) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {600 - totalPoints} more points to reach <span className="font-semibold text-[#2F8F6B]">Tree level</span>
                </p>
              </div>
            </div>

            {/* Recent missions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl">Recent Missions</h2>
                <button onClick={() => setActiveTab("applications")} className="text-sm font-medium text-[#2F8F6B] hover:text-[#0F3D2E] flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.project} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <img src={app.image} alt={app.project} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-[#0F3D2E] text-sm leading-tight truncate">{app.project}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{app.org}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[app.status] || "bg-gray-100 text-gray-600"}`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-[#2F8F6B] font-semibold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          +{app.points}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Climate Tracker", desc: "Track your personal carbon footprint reduction over time", icon: <BarChart2 className="w-6 h-6" /> },
                { title: "Academy Missions", desc: "Structured learning paths with expert-led video courses", icon: <BookOpen className="w-6 h-6" /> },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/60 z-10 rounded-2xl">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">Coming Soon</span>
                    </div>
                  </div>
                  <div className="opacity-30">
                    <div className="w-10 h-10 bg-[#E6F4EE] rounded-xl flex items-center justify-center mb-3 text-[#2F8F6B]">
                      {item.icon}
                    </div>
                    <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="space-y-4">
            <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl mb-2">My Applications</h2>
            {applications.map((app) => (
              <div key={app.project} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <img src={app.image} alt={app.project} className="w-full sm:w-20 h-20 sm:h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">{app.project}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[app.status] || "bg-gray-100 text-gray-600"}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{app.org}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Applied {app.appliedDate}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Starts {app.startDate}</span>
                      <span className="font-medium text-[#0F3D2E] bg-[#E6F4EE] px-1.5 rounded">{app.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-xl font-[Manrope] font-bold text-[#2F8F6B] flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        +{app.points}
                      </div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                    {app.status !== "Completed" && (
                      <Link
                        to={`/missions/${app.project.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm font-semibold text-[#2F8F6B] border border-[#2F8F6B]/30 px-3 py-1.5 rounded-lg hover:bg-[#E6F4EE] transition-colors whitespace-nowrap"
                      >
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "badges" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl">My Badges</h2>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#0F3D2E]">{badges.filter(b => b.earned).length}</span> / {badges.length} earned
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    badge.earned
                      ? "bg-white border-gray-100 shadow-sm hover:shadow-md"
                      : "bg-gray-50 border-gray-100 opacity-50"
                  }`}
                >
                  <div className={`w-12 h-12 ${badge.color} rounded-2xl flex items-center justify-center mx-auto mb-3 ${!badge.earned ? "grayscale" : ""}`}>
                    {badge.icon}
                  </div>
                  <p className="font-[Manrope] font-bold text-[#0F3D2E] text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">{badge.desc}</p>
                  {badge.earned ? (
                    <p className="text-xs text-[#2F8F6B] font-medium mt-2">{badge.date}</p>
                  ) : (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Locked</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
