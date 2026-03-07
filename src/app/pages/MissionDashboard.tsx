import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Filter,
  MapPin,
  Users,
  Clock,
  Zap,
  Star,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Sprout,
  Sun,
  Wrench,
  TreePine,
  Recycle,
  Droplets,
  SlidersHorizontal,
  Grid,
  List,
  BookOpen,
  Target,
} from "lucide-react";

const allMissions = [
  {
    id: "urban-garden",
    title: "Urban Rooftop Garden Setup",
    org: "GreenCity Initiative",
    location: "Manila, NCR",
    category: "Urban Farming",
    difficulty: "Beginner",
    duration: "4 weeks",
    points: 150,
    volunteers: 12,
    volunteersNeeded: 20,
    professionals: 2,
    professionalsNeeded: 3,
    urgent: false,
    description: "Learn to transform unused rooftop spaces into productive urban gardens. You'll study companion planting, soil health, and rainwater collection techniques.",
    image: "https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["Composting", "Soil Science", "Urban Farming"],
    icon: <Sprout className="w-4 h-4" />,
    color: "bg-emerald-100 text-emerald-700",
    verified: true,
  },
  {
    id: "solar-install",
    title: "Community Solar Panel Installation",
    org: "SolarPH Foundation",
    location: "Cebu City, Cebu",
    category: "Energy Saving",
    difficulty: "Intermediate",
    duration: "6 weeks",
    points: 250,
    volunteers: 8,
    volunteersNeeded: 15,
    professionals: 4,
    professionalsNeeded: 5,
    urgent: true,
    description: "Participate in installing solar panels for low-income households. Learn photovoltaic system basics, safety protocols, and electrical wiring fundamentals.",
    image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["Solar Installation", "Electrical", "Energy Audit"],
    icon: <Sun className="w-4 h-4" />,
    color: "bg-amber-100 text-amber-700",
    verified: true,
  },
  {
    id: "repair-skills",
    title: "Repair Café & Reuse Workshop",
    org: "Zero Waste Collective",
    location: "Davao City, Mindanao",
    category: "Repair Skills",
    difficulty: "Beginner",
    duration: "2 weeks",
    points: 100,
    volunteers: 18,
    volunteersNeeded: 25,
    professionals: 1,
    professionalsNeeded: 2,
    urgent: false,
    description: "Run a community repair café teaching basic appliance repair, sewing, and bicycle maintenance to extend the life of everyday items and reduce waste.",
    image: "https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["Repair", "Waste Reduction", "Teaching", "Construction"],
    icon: <Wrench className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-700",
    verified: false,
  },
  {
    id: "reforestation",
    title: "Coastal Reforestation Drive",
    org: "Forest Foundation PH",
    location: "Surigao del Norte, Caraga",
    category: "Reforestation",
    difficulty: "All Levels",
    duration: "8 weeks",
    points: 300,
    volunteers: 45,
    volunteersNeeded: 60,
    professionals: 3,
    professionalsNeeded: 5,
    urgent: true,
    description: "Join a large-scale mangrove and coastal forest restoration project. Learn species identification, planting techniques, and long-term ecosystem monitoring.",
    image: "https://images.unsplash.com/photo-1752169580565-c2515f8973f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["Forestry", "GIS Mapping", "Soil Science", "Community Organising"],
    icon: <TreePine className="w-4 h-4" />,
    color: "bg-green-100 text-green-700",
    verified: true,
  },
  {
    id: "composting",
    title: "Neighborhood Composting Hub",
    org: "EcoBarangay Network",
    location: "Quezon City, NCR",
    category: "Composting",
    difficulty: "Beginner",
    duration: "3 weeks",
    points: 120,
    volunteers: 6,
    volunteersNeeded: 10,
    professionals: 0,
    professionalsNeeded: 1,
    urgent: false,
    description: "Set up a community composting station and educate neighbors on organic waste reduction, vermicomposting, and using compost for urban gardens.",
    image: "https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["Composting", "Urban Farming", "Teaching"],
    icon: <Recycle className="w-4 h-4" />,
    color: "bg-lime-100 text-lime-700",
    verified: true,
  },
  {
    id: "water-conservation",
    title: "Rainwater Harvesting System",
    org: "WaterSense Alliance",
    location: "Iloilo City, Visayas",
    category: "Water Conservation",
    difficulty: "Intermediate",
    duration: "5 weeks",
    points: 200,
    volunteers: 10,
    volunteersNeeded: 18,
    professionals: 2,
    professionalsNeeded: 3,
    urgent: false,
    description: "Design and build rainwater collection systems for community gardens and households. Learn plumbing basics, filtration methods, and water quality testing.",
    image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    tags: ["Construction", "Community Organising", "Teaching"],
    icon: <Droplets className="w-4 h-4" />,
    color: "bg-cyan-100 text-cyan-700",
    verified: false,
  },
];

const categories = ["All", "Urban Farming", "Energy Saving", "Repair Skills", "Reforestation", "Composting", "Water Conservation"];
const regions = ["All Regions", "NCR", "Luzon", "Visayas", "Mindanao", "Caraga"];
const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function MissionDashboard() {
  const [activeTab, setActiveTab] = useState<"browse" | "poster">("browse");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allMissions.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.org.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === "All" || m.category === selectedCategory;
    const matchUrgent = !urgentOnly || m.urgent;
    return matchSearch && matchCat && matchUrgent;
  });

  const urgent = filtered.filter(m => m.urgent);
  const regular = filtered.filter(m => !m.urgent);
  const sorted = [...urgent, ...regular];

  return (
    <div className="min-h-screen bg-[#F9FDFB]">
      {/* Header */}
      <div className="bg-[#0F3D2E] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[#6DD4A8] font-semibold text-sm uppercase tracking-wider mb-1">Mission Board</p>
              <h1 className="text-white font-[Manrope] font-bold text-3xl md:text-4xl">
                Find Your Mission
              </h1>
              <p className="text-[#A8D5BF] mt-2">
                Based on your profile, <span className="text-white font-semibold">12 projects match you right now.</span>
              </p>
            </div>
            {/* Tab switcher */}
            <div className="flex bg-white/10 rounded-xl p-1 gap-1 w-fit">
              <button
                onClick={() => setActiveTab("browse")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "browse" ? "bg-white text-[#0F3D2E]" : "text-white/70 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Browse Missions
              </button>
              <button
                onClick={() => setActiveTab("poster")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "poster" ? "bg-white text-[#0F3D2E]" : "text-white/70 hover:text-white"
                }`}
              >
                <Target className="w-4 h-4" />
                My Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search missions, organisations, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 focus:border-[#2F8F6B]"
              />
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 bg-white"
            >
              {regions.map(r => <option key={r}>{r}</option>)}
            </select>
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                urgentOnly
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "border-gray-200 text-gray-600 hover:border-[#2F8F6B]"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Urgent Only
            </button>
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#E6F4EE] text-[#0F3D2E]" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#E6F4EE] text-[#0F3D2E]" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#0F3D2E] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-[#E6F4EE] hover:text-[#0F3D2E]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[#0F3D2E]">{sorted.length}</span> missions found
            {urgent.length > 0 && (
              <span className="ml-2 text-red-600 font-medium">· {urgent.length} urgent</span>
            )}
          </p>
          <Link to="/post-project" className="text-sm font-semibold text-[#2F8F6B] hover:text-[#0F3D2E] flex items-center gap-1">
            + Post a Mission
          </Link>
        </div>

        {activeTab === "browse" && (
          <>
            {/* Urgent banner */}
            {urgent.length > 0 && !urgentOnly && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 text-sm">
                    {urgent.length} urgent mission{urgent.length > 1 ? "s" : ""} need immediate help
                  </p>
                  <p className="text-red-600 text-xs mt-0.5">These projects have critical deadlines or immediate needs.</p>
                </div>
              </div>
            )}

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sorted.map((mission) => (
                  <Link
                    to={`/missions/${mission.id}`}
                    key={mission.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
                  >
                    <div className="relative">
                      <img src={mission.image} alt={mission.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                      {mission.urgent && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          URGENT
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${mission.color}`}>
                          {mission.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-[Manrope] font-bold text-[#0F3D2E] text-base leading-tight">{mission.title}</h3>
                        {mission.verified && (
                          <CheckCircle className="w-4 h-4 text-[#2F8F6B] flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{mission.org}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{mission.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mission.duration}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Volunteers</span>
                            <span className="font-medium text-[#0F3D2E]">{mission.volunteers}/{mission.volunteersNeeded}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2F8F6B] rounded-full"
                              style={{ width: `${(mission.volunteers / mission.volunteersNeeded) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {mission.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs bg-[#E6F4EE] text-[#0F3D2E] px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#2F8F6B]">
                          <Star className="w-3.5 h-3.5 fill-[#2F8F6B]" />
                          +{mission.points} points
                        </div>
                        <span className="text-xs font-semibold text-[#2F8F6B] flex items-center gap-1">
                          View & Apply <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sorted.map((mission) => (
                  <Link
                    to={`/missions/${mission.id}`}
                    key={mission.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex overflow-hidden group"
                  >
                    <img src={mission.image} alt={mission.title} className="w-36 h-full object-cover group-hover:scale-105 transition-transform duration-300 flex-shrink-0" />
                    <div className="p-4 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-[Manrope] font-bold text-[#0F3D2E] text-base">{mission.title}</h3>
                            {mission.urgent && (
                              <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3" />
                                URGENT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{mission.org} · {mission.location}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${mission.color}`}>
                          {mission.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{mission.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mission.duration}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{mission.volunteers}/{mission.volunteersNeeded}</span>
                          <span className="flex items-center gap-1 font-semibold text-[#2F8F6B]"><Star className="w-3 h-3 fill-[#2F8F6B]" />+{mission.points} pts</span>
                        </div>
                        <span className="text-xs font-semibold text-[#2F8F6B] flex items-center gap-1">
                          View & Apply <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "poster" && (
          <PosterView />
        )}
      </div>
    </div>
  );
}

function PosterView() {
  const projects = [
    {
      title: "Coastal Reforestation Drive",
      status: "Active",
      volunteers: 45,
      volunteersNeeded: 60,
      professionals: 3,
      professionalsNeeded: 5,
      notifications: 12,
    },
    {
      title: "Solar Panel Installation",
      status: "Active",
      volunteers: 8,
      volunteersNeeded: 15,
      professionals: 4,
      professionalsNeeded: 5,
      notifications: 3,
    },
    {
      title: "Urban Garden Network",
      status: "Draft",
      volunteers: 0,
      volunteersNeeded: 20,
      professionals: 0,
      professionalsNeeded: 3,
      notifications: 0,
    },
  ];

  return (
    <div>
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Projects", value: 2, color: "bg-green-50 text-green-700 border-green-100" },
          { label: "Draft Projects", value: 1, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: "Completed", value: 4, color: "bg-blue-50 text-blue-700 border-blue-100" },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border p-4 text-center ${item.color}`}>
            <div className="text-3xl font-[Manrope] font-bold">{item.value}</div>
            <div className="text-xs font-medium mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Match banner */}
      <div className="bg-[#E6F4EE] border border-[#2F8F6B]/20 rounded-xl p-4 mb-6 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-[#2F8F6B]" />
        <p className="text-[#0F3D2E] font-medium text-sm">
          <span className="font-bold">34 vetted profiles</span> matched your Coastal Reforestation project in Surigao del Norte
        </p>
        <Link to="/dashboard" className="ml-auto text-sm font-semibold text-[#2F8F6B] whitespace-nowrap">View Matches →</Link>
      </div>

      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-[Manrope] font-bold text-[#0F3D2E]">{p.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    p.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>{p.status}</span>
                </div>
                <div className="flex gap-6 mt-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Volunteers</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-[#2F8F6B] rounded-full" style={{ width: p.volunteersNeeded > 0 ? `${(p.volunteers / p.volunteersNeeded) * 100}%` : "0%" }} />
                      </div>
                      <span className="text-xs font-medium text-[#0F3D2E]">{p.volunteers}/{p.volunteersNeeded}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Professionals</p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: p.professionalsNeeded > 0 ? `${(p.professionals / p.professionalsNeeded) * 100}%` : "0%" }} />
                      </div>
                      <span className="text-xs font-medium text-[#0F3D2E]">{p.professionals}/{p.professionalsNeeded}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {p.notifications > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {p.notifications}
                  </span>
                )}
                <button className="text-sm font-semibold text-[#2F8F6B] border border-[#2F8F6B]/30 px-3 py-1.5 rounded-lg hover:bg-[#E6F4EE] transition-colors">
                  View Matches
                </button>
                <button className="text-sm font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
