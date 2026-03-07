import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Leaf,
  Flame,
  Calendar,
  ChevronRight,
  Lock,
  BarChart2,
  TreePine,
  Sun,
  Wrench,
  Sprout,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getCurrentProfile, getMyApplications } from "../utils/matchService";
import type { Profile, ConnectionWithDetails, Project } from "../types/database";

// Level configuration based on points
const LEVELS = [
  { name: "Seedling", min: 0, max: 100 },
  { name: "Sprout", min: 100, max: 250 },
  { name: "Sapling", min: 250, max: 500 },
  { name: "Tree", min: 500, max: 1000 },
  { name: "Grove", min: 1000, max: 2000 },
  { name: "Forest", min: 2000, max: Infinity },
];

function getLevel(points: number): { level: number; name: string; nextLevel: typeof LEVELS[0] | null; progress: number } {
  for (let i = 0; i < LEVELS.length; i++) {
    if (points < LEVELS[i].max) {
      const current = LEVELS[i];
      const next = LEVELS[i + 1] || null;
      const progress = ((points - current.min) / (current.max - current.min)) * 100;
      return { level: i + 1, name: current.name, nextLevel: next, progress };
    }
  }
  return { level: LEVELS.length, name: LEVELS[LEVELS.length - 1].name, nextLevel: null, progress: 100 };
}

// Helper to calculate activity streak from connections
function calculateStreak(connections: ConnectionWithDetails[]): { current: number; longest: number } {
  if (connections.length === 0) return { current: 0, longest: 0 };
  
  // Get all unique activity dates (created_at and updated_at from connections)
  const activityDates = connections
    .flatMap(c => [c.created_at, c.updated_at])
    .filter(Boolean)
    .map(d => new Date(d!).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (activityDates.length === 0) return { current: 0, longest: 0 };

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  let current = 0;
  let longest = 0;
  let streak = 0;
  
  // Check if there's activity today or yesterday
  const hasRecentActivity = activityDates[0] === today || activityDates[0] === yesterday;
  
  for (let i = 0; i < activityDates.length; i++) {
    const currentDate = new Date(activityDates[i]);
    const nextDate = activityDates[i + 1] ? new Date(activityDates[i + 1]) : null;
    
    streak++;
    
    if (nextDate) {
      const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / 86400000);
      if (diffDays > 1) {
        longest = Math.max(longest, streak);
        if (hasRecentActivity && current === 0) current = streak;
        streak = 0;
      }
    } else {
      longest = Math.max(longest, streak);
      if (hasRecentActivity && current === 0) current = streak;
    }
  }

  return { current: hasRecentActivity ? Math.max(current, streak) : 0, longest: Math.max(longest, streak) };
}

// Map connection status to display status
function getDisplayStatus(connection: ConnectionWithDetails): string {
  const project = connection.project as Project | undefined;
  
  if (project?.status === "completed" && connection.status === "accepted") {
    return "Completed";
  }
  if (connection.status === "accepted" && project?.status === "in-progress") {
    return "In Progress";
  }
  if (connection.status === "accepted") {
    return "Accepted";
  }
  if (connection.status === "pending") {
    return "Pending Review";
  }
  if (connection.status === "declined") {
    return "Declined";
  }
  return "Unknown";
}

// Get project image based on focus area
function getProjectImage(focusArea: string[] | undefined): string {
  const area = focusArea?.[0]?.toLowerCase() || '';
  
  if (area.includes('solar') || area.includes('energy') || area.includes('renewable')) {
    return 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&fit=crop';
  }
  if (area.includes('forest') || area.includes('conservation') || area.includes('reforestation')) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&fit=crop';
  }
  if (area.includes('education') || area.includes('technology') || area.includes('literacy')) {
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&fit=crop';
  }
  if (area.includes('water') || area.includes('ocean') || area.includes('marine')) {
    return 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&fit=crop';
  }
  if (area.includes('urban') || area.includes('infrastructure') || area.includes('city')) {
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&fit=crop';
  }
  if (area.includes('disaster') || area.includes('emergency')) {
    return 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&fit=crop';
}

// Static badges configuration
const BADGES_CONFIG = [
  { name: "First Seed", icon: <Sprout className="w-6 h-6" />, desc: "Completed first mission", color: "bg-emerald-100 text-emerald-700", requirement: "first_mission" },
  { name: "Composter", icon: <Leaf className="w-6 h-6" />, desc: "Completed composting mission", color: "bg-lime-100 text-lime-700", requirement: "composting" },
  { name: "Repairer", icon: <Wrench className="w-6 h-6" />, desc: "Completed repair skills mission", color: "bg-blue-100 text-blue-700", requirement: "repair" },
  { name: "Solar Starter", icon: <Sun className="w-6 h-6" />, desc: "Energy saving mission", color: "bg-amber-100 text-amber-700", requirement: "energy" },
  { name: "Forest Guardian", icon: <TreePine className="w-6 h-6" />, desc: "Complete a reforestation mission", color: "bg-green-100 text-green-700", requirement: "reforestation" },
  { name: "Team Leader", icon: <Users className="w-6 h-6" />, desc: "Lead a community challenge", color: "bg-purple-100 text-purple-700", requirement: "team_lead" },
];

// Static impact stats (as requested - don't change for now)
const impactStats = [
  { label: "CO₂ Offset", value: "124 kg", icon: <Leaf className="w-5 h-5" />, color: "text-[#2F8F6B]" },
  { label: "Trees Planted", value: "42", icon: <TreePine className="w-5 h-5" />, color: "text-green-600" },
  { label: "Items Repaired", value: "18", icon: <Wrench className="w-5 h-5" />, color: "text-blue-600" },
  { label: "People Reached", value: "380", icon: <Users className="w-5 h-5" />, color: "text-teal-600" },
];

// Calculate profile completion percentage
function calculateProfileCompletion(profile: Profile | null): number {
  if (!profile) return 0;
  
  let score = 0;
  const fields = [
    { field: profile.name, weight: 20 },
    { field: profile.bio, weight: 15 },
    { field: profile.location, weight: 15 },
    { field: profile.skills?.length > 0, weight: 20 },
    { field: profile.availability, weight: 10 },
    { field: profile.avatar_url, weight: 10 },
    { field: profile.credentials_url, weight: 10 },
  ];
  
  fields.forEach(({ field, weight }) => {
    if (field) score += weight;
  });
  
  return score;
}

// Get earned badges based on completed missions
function getEarnedBadges(connections: ConnectionWithDetails[]) {
  const completedConnections = connections.filter(c => {
    const project = c.project as Project | undefined;
    return c.status === "accepted" && project?.status === "completed";
  });

  return BADGES_CONFIG.map(badge => {
    let earned = false;
    let date: string | null = null;

    if (badge.requirement === "first_mission" && completedConnections.length > 0) {
      earned = true;
      date = new Date(completedConnections[completedConnections.length - 1].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    // Check for specific focus areas
    const focusAreas = completedConnections.map(c => (c.project as Project)?.focus_area || []).flat();
    const focusAreaLower = focusAreas.map(f => f.toLowerCase());

    if (badge.requirement === "composting" && focusAreaLower.some(f => f.includes("composting") || f.includes("waste"))) {
      earned = true;
      const c = completedConnections.find(c => (c.project as Project)?.focus_area?.some(f => f.toLowerCase().includes("composting") || f.toLowerCase().includes("waste")));
      if (c) date = new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    if (badge.requirement === "repair" && focusAreaLower.some(f => f.includes("repair"))) {
      earned = true;
      const c = completedConnections.find(c => (c.project as Project)?.focus_area?.some(f => f.toLowerCase().includes("repair")));
      if (c) date = new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    if (badge.requirement === "energy" && focusAreaLower.some(f => f.includes("energy") || f.includes("solar"))) {
      earned = true;
      const c = completedConnections.find(c => (c.project as Project)?.focus_area?.some(f => f.toLowerCase().includes("energy") || f.toLowerCase().includes("solar")));
      if (c) date = new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    if (badge.requirement === "reforestation" && focusAreaLower.some(f => f.includes("forest") || f.includes("reforestation") || f.includes("conservation"))) {
      earned = true;
      const c = completedConnections.find(c => (c.project as Project)?.focus_area?.some(f => f.toLowerCase().includes("forest") || f.toLowerCase().includes("reforestation")));
      if (c) date = new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    return { ...badge, earned, date };
  });
}

export function ProgressTracker() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "badges">("overview");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<ConnectionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        console.log("ProgressTracker: No user, skipping fetch");
        setLoading(false);
        return;
      }

      console.log("ProgressTracker: Fetching data for user", user.id);
      setLoading(true);
      try {
        const [profileData, applicationsData] = await Promise.all([
          getCurrentProfile(),
          getMyApplications(),
        ]);

        console.log("ProgressTracker: Fetched profile", profileData);
        console.log("ProgressTracker: Fetched applications", applicationsData?.length || 0, applicationsData);
        
        setProfile(profileData);
        setApplications(applicationsData);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  // Calculate totals from real data
  const completedMissions = applications.filter(c => {
    const project = c.project as Project | undefined;
    return c.status === "accepted" && project?.status === "completed";
  });

  const totalPoints = completedMissions.reduce((sum, c) => {
    const project = c.project as Project | undefined;
    return sum + (project?.points || 0);
  }, 0);

  const levelInfo = getLevel(totalPoints);
  const profileCompletion = calculateProfileCompletion(profile);
  const streak = calculateStreak(applications);
  const badges = getEarnedBadges(applications);

  // Get user initials
  const userInitials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  // Format member since date
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9FDFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F8F6B]" />
          <p className="text-gray-500">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9FDFB] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#0F3D2E] mb-2">Please sign in</h2>
          <p className="text-gray-500 mb-4">You need to be logged in to view your progress.</p>
          <Link to="/auth" className="text-[#2F8F6B] font-semibold hover:underline">
            Sign in →
          </Link>
        </div>
      </div>
    );
  }

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
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.name} 
                className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-[#2F8F6B] rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-[Manrope] flex-shrink-0">
                {userInitials}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-white font-[Manrope] font-bold text-2xl">{profile?.name || user?.email}</h1>
                <span className="bg-[#2F8F6B]/30 text-[#6DD4A8] text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                  {profile?.role_type || 'Climate Volunteer'}
                </span>
                {profile?.location && (
                  <span className="bg-white/10 text-white/80 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {profile.location}
                  </span>
                )}
              </div>
              <p className="text-[#A8D5BF] text-sm">
                {memberSince && `Member since ${memberSince} · `}{completedMissions.length} mission{completedMissions.length !== 1 ? 's' : ''} completed
              </p>
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
                <p className="text-xs text-[#A8D5BF] mt-1">
                  {profileCompletion < 100 ? 'Add more details to complete your profile' : 'Profile complete!'}
                </p>
              </div>
            </div>
            {/* Total points */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center min-w-[120px]">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-[#A8D5BF] text-xs font-medium">Total Points</span>
              </div>
              <div className="text-3xl font-[Manrope] font-bold text-white">{totalPoints}</div>
              <p className="text-[#6DD4A8] text-xs mt-0.5">Level {levelInfo.level} · {levelInfo.name}</p>
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
                <div className="text-4xl font-[Manrope] font-bold text-[#0F3D2E] mb-1">{streak.current} day{streak.current !== 1 ? 's' : ''}</div>
                <p className="text-sm text-gray-500">Your longest streak: <span className="font-semibold text-[#2F8F6B]">{streak.longest} days</span></p>
                <div className="flex gap-1.5 mt-4">
                  {Array.from({ length: Math.min(streak.current, 21) }).map((_, i) => (
                    <div key={i} className="h-5 flex-1 rounded-sm bg-[#2F8F6B]" />
                  ))}
                  {Array.from({ length: Math.max(0, 21 - streak.current) }).map((_, i) => (
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
                    <p className="text-xs text-gray-500">
                      Level {levelInfo.level} {levelInfo.nextLevel ? `→ Level ${levelInfo.level + 1}: ${levelInfo.nextLevel.name}` : '(Max Level!)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <div>
                    <p className="text-3xl font-[Manrope] font-bold text-[#0F3D2E]">{totalPoints}</p>
                    <p className="text-xs text-gray-500">current points</p>
                  </div>
                  {levelInfo.nextLevel && (
                    <>
                      <div className="text-gray-300 text-2xl mb-1">/</div>
                      <div>
                        <p className="text-2xl font-[Manrope] font-bold text-gray-400">{levelInfo.nextLevel.min}</p>
                        <p className="text-xs text-gray-500">to level {levelInfo.level + 1}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#2F8F6B] to-[#6DD4A8] rounded-full" style={{ width: `${levelInfo.progress}%` }} />
                </div>
                {levelInfo.nextLevel && (
                  <p className="text-xs text-gray-500 mt-2">
                    {levelInfo.nextLevel.min - totalPoints} more points to reach <span className="font-semibold text-[#2F8F6B]">{levelInfo.nextLevel.name} level</span>
                  </p>
                )}
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
              {applications.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                  <p className="text-gray-500">No missions yet. Start exploring and apply to missions!</p>
                  <Link to="/missions" className="inline-block mt-4 text-[#2F8F6B] font-semibold hover:underline">
                    Browse missions →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {applications.slice(0, 4).map((app) => {
                    const project = app.project as Project;
                    const displayStatus = getDisplayStatus(app);
                    return (
                      <div key={app.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                        <img 
                          src={getProjectImage(project?.focus_area)} 
                          alt={project?.title || 'Mission'} 
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-[#0F3D2E] text-sm leading-tight truncate">{project?.title || 'Unknown Mission'}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{project?.location || 'Remote'}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[displayStatus] || "bg-gray-100 text-gray-600"}`}>
                              {displayStatus}
                            </span>
                            <span className="text-xs text-[#2F8F6B] font-semibold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              +{project?.points || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="space-y-4">
            <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl mb-2">My Applications</h2>
            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-gray-500">No applications yet. Start exploring and apply to missions!</p>
                <Link to="/missions" className="inline-block mt-4 text-[#2F8F6B] font-semibold hover:underline">
                  Browse missions →
                </Link>
              </div>
            ) : (
              applications.map((app) => {
                const project = app.project as Project;
                const displayStatus = getDisplayStatus(app);
                const appliedDate = new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const startDate = project?.start_date 
                  ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'TBD';

                return (
                  <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <img 
                        src={getProjectImage(project?.focus_area)} 
                        alt={project?.title || 'Mission'} 
                        className="w-full sm:w-20 h-20 sm:h-20 rounded-xl object-cover flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">{project?.title || 'Unknown Mission'}</h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[displayStatus] || "bg-gray-100 text-gray-600"}`}>
                            {displayStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{project?.region || 'Global'}</p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project?.location || 'Remote'}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Applied {appliedDate}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Starts {startDate}</span>
                          <span className="font-medium text-[#0F3D2E] bg-[#E6F4EE] px-1.5 rounded capitalize">{app.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-xl font-[Manrope] font-bold text-[#2F8F6B] flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            +{project?.points || 0}
                          </div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>
                        {displayStatus !== "Completed" && project?.id && (
                          <Link
                            to={`/missions/${project.id}`}
                            className="text-sm font-semibold text-[#2F8F6B] border border-[#2F8F6B]/30 px-3 py-1.5 rounded-lg hover:bg-[#E6F4EE] transition-colors whitespace-nowrap"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
