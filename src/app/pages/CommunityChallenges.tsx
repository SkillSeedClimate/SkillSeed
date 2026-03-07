import { useState } from "react";
import { Link } from "react-router";
import {
  Trophy,
  Users,
  Clock,
  Star,
  Flame,
  TrendingUp,
  MapPin,
  ChevronRight,
  Plus,
  Share2,
  CheckCircle,
  Leaf,
  TreePine,
  Sun,
  Wrench,
  Recycle,
  Target,
  Award,
  ArrowUp,
  Zap,
} from "lucide-react";

const challenges = [
  {
    id: 1,
    title: "30-Day Zero Waste Challenge",
    category: "Waste Reduction",
    image: "https://images.unsplash.com/photo-1759503407810-f0402fd9f237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    participants: 2840,
    daysLeft: 12,
    points: 500,
    joined: true,
    progress: 65,
    description: "Reduce household waste to near-zero for 30 days. Document your journey, share tips, and inspire your neighborhood.",
    icon: <Recycle className="w-5 h-5" />,
    color: "bg-lime-100 text-lime-700",
    difficulty: "Intermediate",
    featured: true,
  },
  {
    id: 2,
    title: "Plant 100 Trees This Month",
    category: "Reforestation",
    image: "https://images.unsplash.com/photo-1752169580565-c2515f8973f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    participants: 1230,
    daysLeft: 18,
    points: 400,
    joined: false,
    progress: 0,
    description: "Join thousands of planters worldwide to hit our collective goal of 100,000 trees. Every seedling counts!",
    icon: <TreePine className="w-5 h-5" />,
    color: "bg-green-100 text-green-700",
    difficulty: "All Levels",
    featured: false,
  },
  {
    id: 3,
    title: "Energy-Free Weekends",
    category: "Energy Saving",
    image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    participants: 945,
    daysLeft: 5,
    points: 300,
    joined: true,
    progress: 80,
    description: "Cut your electricity usage by 50% every weekend for a month. Log your energy savings and see your collective impact.",
    icon: <Sun className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-700",
    difficulty: "Beginner",
    featured: false,
  },
  {
    id: 4,
    title: "Community Repair Marathon",
    category: "Repair Skills",
    image: "https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    participants: 620,
    daysLeft: 22,
    points: 350,
    joined: false,
    progress: 0,
    description: "Host or attend a local repair event. Repair items, document them, and together we'll save thousands from the landfill.",
    icon: <Wrench className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-700",
    difficulty: "Beginner",
    featured: false,
  },
  {
    id: 5,
    title: "Urban Garden Network",
    category: "Urban Farming",
    image: "https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    participants: 1780,
    daysLeft: 30,
    points: 450,
    joined: false,
    progress: 0,
    description: "Start or contribute to an urban garden in your area. Connect rooftop gardens, balcony farms, and community plots into a city-wide food network.",
    icon: <Leaf className="w-5 h-5" />,
    color: "bg-emerald-100 text-emerald-700",
    difficulty: "Beginner",
    featured: false,
  },
  {
    id: 6,
    title: "Climate Action Sprint",
    category: "Mixed",
    image: "https://images.unsplash.com/photo-1759503407810-f0402fd9f237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    participants: 3200,
    daysLeft: 7,
    points: 600,
    joined: false,
    progress: 0,
    description: "A week-long intensive challenge: complete 5 mini-missions across different climate skills areas in 7 days.",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700",
    difficulty: "Advanced",
    featured: true,
  },
];

const leaderboard = [
  { rank: 1, name: "Maria Santos", location: "Manila", points: 2840, avatar: "MS", missions: 18, badge: "Forest Guardian" },
  { rank: 2, name: "James Reyes", location: "Cebu", points: 2610, avatar: "JR", missions: 15, badge: "Solar Expert" },
  { rank: 3, name: "Ana Lim", location: "Manila", points: 2220, avatar: "AL", missions: 12, badge: "Sapling", isYou: true },
  { rank: 4, name: "Carlo Mendoza", location: "Davao", points: 1980, avatar: "CM", missions: 11, badge: "Composter" },
  { rank: 5, name: "Sofia Garcia", location: "Iloilo", points: 1740, avatar: "SG", missions: 9, badge: "Repairer" },
  { rank: 6, name: "Renz Bautista", location: "Quezon City", points: 1620, avatar: "RB", missions: 8, badge: "First Seed" },
  { rank: 7, name: "Lia Torres", location: "Cagayan de Oro", points: 1450, avatar: "LT", missions: 7, badge: "First Seed" },
  { rank: 8, name: "Mark Villanueva", location: "Baguio", points: 1290, avatar: "MV", missions: 6, badge: "First Seed" },
];

const communityStats = [
  { label: "Active Challengers", value: "12,480", icon: <Users className="w-5 h-5" />, color: "text-[#2F8F6B]" },
  { label: "Challenges Running", value: "24", icon: <Target className="w-5 h-5" />, color: "text-teal-600" },
  { label: "Impact Actions", value: "89,240", icon: <Leaf className="w-5 h-5" />, color: "text-emerald-600" },
  { label: "Cities Participating", value: "63", icon: <MapPin className="w-5 h-5" />, color: "text-blue-600" },
];

export function CommunityChallenges() {
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([1, 3]);
  const [activeTab, setActiveTab] = useState<"all" | "joined" | "featured">("all");

  const handleJoin = (id: number) => {
    setJoinedChallenges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const filteredChallenges = challenges.filter(c => {
    if (activeTab === "joined") return joinedChallenges.includes(c.id);
    if (activeTab === "featured") return c.featured;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9FDFB]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D2E] to-[#1A5C43] py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#2F8F6B]/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <span className="text-[#6DD4A8] font-semibold text-sm uppercase tracking-wider">Community Challenges</span>
              </div>
              <h1 className="text-white font-[Manrope] font-bold text-3xl md:text-4xl mb-2">
                Compete. Collaborate. Impact.
              </h1>
              <p className="text-[#A8D5BF] max-w-lg">
                Join collective challenges that multiply your impact. Every action counts toward a shared climate goal.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-[#2F8F6B] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#257A5B] transition-colors">
                <Plus className="w-4 h-4" />
                Create Challenge
              </button>
              <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                <Share2 className="w-4 h-4" />
                Invite Friends
              </button>
            </div>
          </div>

          {/* Community stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {communityStats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="flex justify-center mb-1 text-[#6DD4A8]">{stat.icon}</div>
                <div className="text-2xl font-[Manrope] font-bold text-white">{stat.value}</div>
                <div className="text-[#A8D5BF] text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main challenges */}
          <div className="lg:col-span-2">
            {/* Tab filter */}
            <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-6 w-fit">
              {(["all", "featured", "joined"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    activeTab === tab ? "bg-[#0F3D2E] text-white" : "text-gray-600 hover:bg-[#E6F4EE]"
                  }`}
                >
                  {tab === "all" ? "All Challenges" : tab === "featured" ? "🔥 Featured" : `Joined (${joinedChallenges.length})`}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {filteredChallenges.map((challenge) => {
                const isJoined = joinedChallenges.includes(challenge.id);
                return (
                  <div
                    key={challenge.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                      challenge.featured ? "border-[#2F8F6B]/30" : "border-gray-100"
                    }`}
                  >
                    {challenge.featured && (
                      <div className="bg-gradient-to-r from-[#2F8F6B] to-[#0F3D2E] px-4 py-1.5 flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-white text-xs font-bold">FEATURED CHALLENGE</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-48 h-40 sm:h-auto flex-shrink-0">
                        <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover" />
                        {challenge.daysLeft <= 7 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {challenge.daysLeft}d left
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${challenge.color}`}>
                                {challenge.category}
                              </span>
                              <span className="text-xs text-gray-400">{challenge.difficulty}</span>
                            </div>
                            <h3 className="font-[Manrope] font-bold text-[#0F3D2E] text-lg">{challenge.title}</h3>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-sm font-bold text-[#2F8F6B] flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              +{challenge.points} pts
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-3">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {challenge.participants.toLocaleString()} participants
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {challenge.daysLeft} days remaining
                          </span>
                        </div>
                        {isJoined && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Your progress</span>
                              <span className="font-semibold text-[#2F8F6B]">{challenge.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#2F8F6B] rounded-full transition-all duration-700"
                                style={{ width: `${challenge.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleJoin(challenge.id)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                              isJoined
                                ? "bg-[#E6F4EE] text-[#0F3D2E] hover:bg-[#d1ecdf]"
                                : "bg-[#0F3D2E] text-white hover:bg-[#2F8F6B]"
                            }`}
                          >
                            {isJoined ? (
                              <span className="flex items-center justify-center gap-1.5">
                                <CheckCircle className="w-4 h-4" /> Joined
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-1.5">
                                <Plus className="w-4 h-4" /> Join Challenge
                              </span>
                            )}
                          </button>
                          <button className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-[#2F8F6B]/50 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar — leaderboard */}
          <div className="space-y-5">
            {/* Leaderboard */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">Global Leaderboard</h3>
              </div>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                      user.isYou ? "bg-[#E6F4EE] border border-[#2F8F6B]/20" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-6 text-center text-sm font-bold flex-shrink-0 ${
                        user.rank === 1 ? "text-amber-500" : user.rank === 2 ? "text-gray-400" : user.rank === 3 ? "text-amber-700" : "text-gray-400"
                      }`}
                    >
                      {user.rank <= 3 ? ["🥇", "🥈", "🥉"][user.rank - 1] : user.rank}
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      user.isYou ? "bg-[#2F8F6B] text-white" : "bg-[#E6F4EE] text-[#0F3D2E]"
                    }`}>
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-semibold text-[#0F3D2E] truncate">{user.name}</p>
                        {user.isYou && <span className="text-xs text-[#2F8F6B] font-medium">(You)</span>}
                      </div>
                      <p className="text-xs text-gray-400">{user.location} · {user.missions} missions</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#0F3D2E]">{user.points.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">pts</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 text-sm font-medium text-[#2F8F6B] hover:text-[#0F3D2E] py-2 transition-colors flex items-center justify-center gap-1">
                Full Leaderboard <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* My challenge summary */}
            <div className="bg-[#0F3D2E] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#6DD4A8]" />
                <span className="font-semibold">My Challenge Stats</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-[Manrope] font-bold text-white">{joinedChallenges.length}</div>
                  <div className="text-[#A8D5BF] text-xs mt-0.5">Active</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-[Manrope] font-bold text-white">4</div>
                  <div className="text-[#A8D5BF] text-xs mt-0.5">Completed</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-[Manrope] font-bold text-[#6DD4A8]">1,200</div>
                  <div className="text-[#A8D5BF] text-xs mt-0.5">Challenge pts</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-[Manrope] font-bold text-white">#3</div>
                  <div className="text-[#A8D5BF] text-xs mt-0.5">Global rank</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl p-3">
                <ArrowUp className="w-4 h-4 text-[#6DD4A8]" />
                <p className="text-[#A8D5BF] text-xs">
                  You're <span className="text-white font-semibold">390 points</span> away from rank #2!
                </p>
              </div>
            </div>

            {/* Trending skills */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#2F8F6B]" />
                <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">Trending Skills</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { skill: "Urban Farming", count: 4200, delta: "+12%" },
                  { skill: "Solar Installation", count: 3100, delta: "+8%" },
                  { skill: "GIS Mapping", count: 2800, delta: "+24%" },
                  { skill: "Composting", count: 2400, delta: "+5%" },
                  { skill: "Community Organising", count: 1900, delta: "+18%" },
                ].map((item) => (
                  <div key={item.skill} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm text-gray-700 truncate">{item.skill}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2F8F6B] rounded-full"
                          style={{ width: `${(item.count / 4200) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#2F8F6B] w-10 text-right">{item.delta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
