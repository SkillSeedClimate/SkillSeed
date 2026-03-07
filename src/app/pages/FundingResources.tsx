import { useState } from "react";
import {
  Search,
  DollarSign,
  Calendar,
  ExternalLink,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Star,
  Globe,
  CheckCircle,
  Filter,
  BookOpen,
  FileText,
  Lightbulb,
  Users,
} from "lucide-react";

const grants = [
  {
    id: 1,
    title: "Ecosystem Restoration Fund",
    funder: "UNDP",
    logo: "UN",
    logoColor: "bg-blue-600",
    type: "Grant",
    amount: "Up to $500,000",
    deadline: "April 30, 2026",
    region: "Southeast Asia",
    focus: ["Reforestation", "Marine", "Agriculture"],
    eligibility: "NGOs and community groups with 2+ years of operation",
    description: "Supports large-scale ecosystem restoration initiatives in Southeast Asia. Priority given to projects with strong community involvement and measurable biodiversity outcomes.",
    featured: true,
    saved: false,
  },
  {
    id: 2,
    title: "Disaster Resilience Programme",
    funder: "USAID",
    logo: "US",
    logoColor: "bg-red-600",
    type: "Grant",
    amount: "Up to $200,000",
    deadline: "May 15, 2026",
    region: "Philippines",
    focus: ["Disaster Response", "Urban", "Agriculture"],
    eligibility: "Registered organizations in Mindanao and Visayas",
    description: "Funding for projects that build community resilience to climate-related disasters. Focus on early warning systems, evacuation planning, and sustainable livelihoods.",
    featured: true,
    saved: false,
  },
  {
    id: 3,
    title: "Forest Conservation Program",
    funder: "Forest Foundation PH",
    logo: "FF",
    logoColor: "bg-green-700",
    type: "Grant",
    amount: "Up to ₱2,000,000",
    deadline: "June 1, 2026",
    region: "Philippines",
    focus: ["Reforestation", "Education"],
    eligibility: "Philippine-registered NGOs and LGUs",
    description: "Annual grant supporting forest conservation and reforestation initiatives across the Philippines. Includes capacity building support and monitoring tools.",
    featured: true,
    saved: false,
  },
  {
    id: 4,
    title: "Climate Innovation Fellowship",
    funder: "Asian Development Bank",
    logo: "ADB",
    logoColor: "bg-yellow-600",
    type: "Fellowship",
    amount: "$25,000/year",
    deadline: "July 10, 2026",
    region: "Asia-Pacific",
    focus: ["Energy", "Urban", "Agriculture"],
    eligibility: "Individuals 25-40 with climate sector experience",
    description: "12-month fellowship for emerging climate leaders. Includes mentorship, travel grants, and access to ADB networks across the Asia-Pacific.",
    featured: false,
    saved: false,
  },
  {
    id: 5,
    title: "Renewable Energy Transition Fund",
    funder: "Global Environment Facility",
    logo: "GEF",
    logoColor: "bg-teal-600",
    type: "Grant",
    amount: "Up to $1,000,000",
    deadline: "August 1, 2026",
    region: "Global",
    focus: ["Energy", "Urban"],
    eligibility: "Government agencies, NGOs, and academic institutions",
    description: "Supports community-scale renewable energy projects, particularly solar and micro-hydro installations in off-grid and island communities.",
    featured: false,
    saved: false,
  },
  {
    id: 6,
    title: "Ocean Conservation Partnership",
    funder: "WWF Philippines",
    logo: "WWF",
    logoColor: "bg-gray-700",
    type: "Partnership",
    amount: "In-kind + Technical Support",
    deadline: "Rolling",
    region: "Philippines",
    focus: ["Marine"],
    eligibility: "Community groups in coastal areas",
    description: "Partnership programme offering technical expertise, equipment, and training for marine conservation projects. Partners gain access to WWF's monitoring tools and networks.",
    featured: false,
    saved: false,
  },
  {
    id: 7,
    title: "Zero Waste Community Fund",
    funder: "Global Alliance for Incinerator Alternatives",
    logo: "GAIA",
    logoColor: "bg-lime-700",
    type: "Grant",
    amount: "Up to $30,000",
    deadline: "March 31, 2026",
    region: "Southeast Asia",
    focus: ["Urban", "Education"],
    eligibility: "Grassroots organizations and cooperatives",
    description: "Small grants for community-led zero waste initiatives, repair cafés, composting programs, and plastic reduction campaigns.",
    featured: false,
    saved: false,
  },
  {
    id: 8,
    title: "Agroforestry Innovation Grant",
    funder: "World Agroforestry Centre",
    logo: "WAC",
    logoColor: "bg-amber-700",
    type: "Grant",
    amount: "Up to $75,000",
    deadline: "May 31, 2026",
    region: "Southeast Asia",
    focus: ["Agriculture", "Reforestation"],
    eligibility: "Research institutions and community organizations",
    description: "Supports innovative agroforestry projects that combine food production with forest restoration. Particularly interested in indigenous and traditional knowledge integration.",
    featured: false,
    saved: false,
  },
];

const resourceCategories = [
  {
    title: "Grant Writing Guides",
    icon: <FileText className="w-5 h-5" />,
    items: ["How to Write a Climate Grant Proposal", "Impact Measurement Frameworks", "Budgeting for Climate Projects", "Common Grant Mistakes to Avoid"],
  },
  {
    title: "Climate Skills Toolkit",
    icon: <BookOpen className="w-5 h-5" />,
    items: ["Urban Farming Starter Guide", "Community Solar Installation Manual", "Composting Best Practices", "GIS Mapping for Environmental Work"],
  },
  {
    title: "Community Building",
    icon: <Users className="w-5 h-5" />,
    items: ["Running Effective Community Meetings", "Volunteer Management Templates", "Partnership Agreement Templates", "Impact Reporting for Communities"],
  },
  {
    title: "Policy & Advocacy",
    icon: <Lightbulb className="w-5 h-5" />,
    items: ["Philippine Climate Policy Overview", "How to Engage with Local Government", "Climate Litigation Basics", "IPCC Key Findings for Community Action"],
  },
];

const filterTypes = ["All", "Grant", "Fellowship", "In-kind Support", "Partnership"];
const filterFocus = ["All Focus Areas", "Reforestation", "Energy", "Marine", "Urban", "Agriculture", "Disaster Response", "Education"];

export function FundingResources() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedFocus, setSelectedFocus] = useState("All Focus Areas");
  const [savedGrants, setSavedGrants] = useState<number[]>([]);
  const [openSection, setOpenSection] = useState<string | null>("Grant Writing Guides");

  const toggleSave = (id: number) => {
    setSavedGrants(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const filtered = grants.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.funder.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === "All" || g.type === selectedType;
    const matchFocus = selectedFocus === "All Focus Areas" || g.focus.includes(selectedFocus);
    return matchSearch && matchType && matchFocus;
  });

  const featured = filtered.filter(g => g.featured);
  const regular = filtered.filter(g => !g.featured);

  return (
    <div className="min-h-screen bg-[#F9FDFB]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D2E] to-[#1A5C43] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <DollarSign className="w-6 h-6 text-[#6DD4A8]" />
              <span className="text-[#6DD4A8] font-semibold text-sm uppercase tracking-wider">Funding Resources</span>
            </div>
            <h1 className="text-white font-[Manrope] font-bold text-3xl md:text-4xl mb-3">
              Fund Your Climate Mission
            </h1>
            <p className="text-[#A8D5BF] text-base">
              Discover grants, fellowships, and partnerships available for climate projects in your region.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search grants, funders, focus areas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/50 shadow-lg"
              />
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {filterTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                  selectedType === type
                    ? "bg-white text-[#0F3D2E]"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Focus filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter by focus:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterFocus.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFocus(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedFocus === f
                    ? "bg-[#0F3D2E] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#2F8F6B]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Featured grants */}
        {featured.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl">Featured Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map(grant => (
                <GrantCard key={grant.id} grant={grant} saved={savedGrants.includes(grant.id)} onToggleSave={() => toggleSave(grant.id)} />
              ))}
            </div>
          </div>
        )}

        {/* All grants */}
        {regular.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl">All Opportunities</h2>
              <span className="text-sm text-gray-500">{filtered.length} total</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {regular.map(grant => (
                <GrantCard key={grant.id} grant={grant} saved={savedGrants.includes(grant.id)} onToggleSave={() => toggleSave(grant.id)} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-[Manrope] font-bold text-gray-500 text-lg">No grants found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Resource Library */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-[#2F8F6B]" />
            <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl">Resource Library</h2>
          </div>
          <div className="space-y-3">
            {resourceCategories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === cat.title ? null : cat.title)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#E6F4EE] rounded-xl flex items-center justify-center text-[#2F8F6B]">
                      {cat.icon}
                    </div>
                    <span className="font-[Manrope] font-bold text-[#0F3D2E]">{cat.title}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {cat.items.length} resources
                    </span>
                  </div>
                  {openSection === cat.title ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {openSection === cat.title && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {cat.items.map((item) => (
                      <div key={item} className="flex items-center justify-between px-5 py-3 hover:bg-[#F9FDFB] transition-colors">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle className="w-4 h-4 text-[#2F8F6B]" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                        <button className="flex items-center gap-1 text-xs text-[#2F8F6B] font-medium hover:text-[#0F3D2E] transition-colors">
                          View <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GrantCard({ grant, saved, onToggleSave }: { grant: any; saved: boolean; onToggleSave: () => void }) {
  const typeColor: Record<string, string> = {
    Grant: "bg-[#E6F4EE] text-[#0F3D2E]",
    Fellowship: "bg-blue-100 text-blue-700",
    "In-kind Support": "bg-purple-100 text-purple-700",
    Partnership: "bg-amber-100 text-amber-700",
  };

  const isUrgent = grant.deadline !== "Rolling" && new Date(grant.deadline) < new Date("2026-04-01");

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col ${grant.featured ? "border-[#2F8F6B]/20" : "border-gray-100"}`}>
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${grant.logoColor} rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {grant.logo}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{grant.funder}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor[grant.type] || "bg-gray-100 text-gray-600"}`}>
                {grant.type}
              </span>
            </div>
          </div>
          <button onClick={onToggleSave} className="flex-shrink-0">
            <Bookmark className={`w-4 h-4 transition-colors ${saved ? "fill-[#2F8F6B] text-[#2F8F6B]" : "text-gray-300 hover:text-[#2F8F6B]"}`} />
          </button>
        </div>

        <h3 className="font-[Manrope] font-bold text-[#0F3D2E] text-base mb-2 leading-tight">{grant.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{grant.description}</p>

        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-[#2F8F6B]" />
            <span className="font-medium">{grant.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className={`w-3.5 h-3.5 ${isUrgent ? "text-red-500" : "text-gray-400"}`} />
            <span className={isUrgent ? "text-red-600 font-semibold" : ""}>
              Deadline: {grant.deadline}
              {isUrgent && " ⚡"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span>{grant.region}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {grant.focus.map((f: string) => (
            <span key={f} className="text-[10px] font-medium bg-[#E6F4EE] text-[#0F3D2E] px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#0F3D2E] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2F8F6B] transition-colors">
          View Details <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onToggleSave}
          className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
            saved ? "bg-[#E6F4EE] border-[#2F8F6B]/30 text-[#0F3D2E]" : "border-gray-200 text-gray-500 hover:border-[#2F8F6B]/50"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-[#2F8F6B] text-[#2F8F6B]" : ""}`} />
        </button>
      </div>
    </div>
  );
}
