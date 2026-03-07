import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Sprout,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Leaf,
  Globe,
  TrendingUp,
  Star,
  Play,
  ChevronRight,
  Wrench,
  Sun,
  TreePine,
  Recycle,
  Target,
  BookOpen,
} from "lucide-react";

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCounter({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2000, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-[Manrope] font-bold text-white mb-1">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[#A8D5BF] text-sm font-medium">{label}</div>
    </div>
  );
}

const missions = [
  {
    id: "urban-garden",
    title: "Urban Rooftop Garden",
    category: "Urban Farming",
    difficulty: "Beginner",
    duration: "4 weeks",
    points: 150,
    image: "https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    participants: 234,
    icon: <Sprout className="w-4 h-4" />,
    color: "bg-emerald-100 text-emerald-700",
    tag: "Popular",
  },
  {
    id: "solar-install",
    title: "Solar Panel Basics",
    category: "Energy Saving",
    difficulty: "Intermediate",
    duration: "6 weeks",
    points: 250,
    image: "https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    participants: 189,
    icon: <Sun className="w-4 h-4" />,
    color: "bg-amber-100 text-amber-700",
    tag: "Trending",
  },
  {
    id: "repair-skills",
    title: "Repair & Reuse Workshop",
    category: "Repair Skills",
    difficulty: "Beginner",
    duration: "2 weeks",
    points: 100,
    image: "https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    participants: 312,
    icon: <Wrench className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-700",
    tag: "New",
  },
  {
    id: "reforestation",
    title: "Community Reforestation",
    category: "Reforestation",
    difficulty: "All Levels",
    duration: "8 weeks",
    points: 300,
    image: "https://images.unsplash.com/photo-1752169580565-c2515f8973f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    participants: 156,
    icon: <TreePine className="w-4 h-4" />,
    color: "bg-green-100 text-green-700",
    tag: "Impact",
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "Urban Farmer, Manila",
    avatar: "MS",
    text: "SkillSeed helped me turn my apartment rooftop into a thriving garden. I learned composting and now supply fresh veggies to 10 families!",
    rating: 5,
  },
  {
    name: "James Reyes",
    role: "Solar Technician, Cebu",
    avatar: "JR",
    text: "Through the Solar Panel Basics mission, I got certified and now work with a local energy company. This platform changed my career.",
    rating: 5,
  },
  {
    name: "Ana Lim",
    role: "Teacher & Climate Volunteer",
    avatar: "AL",
    text: "I completed 6 missions and earned enough points to join a national reforestation drive. The community challenges keep me motivated!",
    rating: 5,
  },
];

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center bg-[#0F3D2E] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1768306661941-90a759800c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1600)`,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D2E] via-[#0F3D2E]/95 to-[#1A5C43]" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#2F8F6B]/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-[#6DD4A8]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#2F8F6B]/20 border border-[#2F8F6B]/30 text-[#6DD4A8] text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Leaf className="w-4 h-4" />
                Climate Skills Platform · 12,000+ Missions Completed
              </div>
              <h1 className="text-white font-[Manrope] font-extrabold leading-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
                Grow Real Skills.{" "}
                <span className="text-[#6DD4A8]">Drive Real</span>{" "}
                Climate Action.
              </h1>
              <p className="text-[#A8D5BF] text-lg leading-relaxed mb-8 max-w-lg">
                SkillSeed matches climate projects with people who have the skills to make a difference. Complete hands-on missions, earn impact points, and connect with a global community of climate champions.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/post-project"
                  className="inline-flex items-center gap-2 bg-[#2F8F6B] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#257A5B] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Post a Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  <Play className="w-4 h-4" />
                  Offer My Skills
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-[#A8D5BF]">
                {["Vetted Profiles", "Real-world Missions", "Track Your Impact"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#6DD4A8]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — mission preview cards */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  {missions.slice(0, 4).map((m, i) => (
                    <div
                      key={m.id}
                      className={`bg-white/10 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:bg-white/15 transition-all ${i === 1 ? "mt-6" : ""} ${i === 3 ? "-mt-3" : ""}`}
                    >
                      <img src={m.image} alt={m.title} className="w-full h-24 object-cover" />
                      <div className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.color}`}>
                          {m.category}
                        </span>
                        <p className="text-white text-sm font-semibold mt-1.5 leading-tight">{m.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-[#A8D5BF] text-xs">
                          <Users className="w-3 h-3" />
                          {m.participants} learners
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#E6F4EE] rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#2F8F6B]" />
                  </div>
                  <div>
                    <p className="text-[#0F3D2E] font-bold text-sm">+1,240</p>
                    <p className="text-gray-500 text-xs">impact points earned today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#2F8F6B] font-semibold text-sm uppercase tracking-wider">How it works</span>
            <h2 className="text-[#0F3D2E] font-[Manrope] font-bold mt-2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              Three steps to climate impact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#E6F4EE] via-[#2F8F6B] to-[#E6F4EE]" />

            {[
              {
                icon: <BookOpen className="w-7 h-7" />,
                step: "01",
                title: "Learn Skills",
                desc: "Pick from real-world missions in composting, gardening, solar energy, repair skills, and more. Learn at your own pace.",
                color: "bg-emerald-50",
                iconColor: "bg-[#2F8F6B]",
              },
              {
                icon: <Target className="w-7 h-7" />,
                step: "02",
                title: "Get Matched",
                desc: "Our smart matching connects your skills with climate projects in your area. Get found by NGOs, orgs, and communities that need you.",
                color: "bg-teal-50",
                iconColor: "bg-teal-600",
              },
              {
                icon: <TrendingUp className="w-7 h-7" />,
                step: "03",
                title: "Track Impact",
                desc: "Earn points, collect badges, and see your real-world impact. Every mission you complete moves us closer to a greener future.",
                color: "bg-green-50",
                iconColor: "bg-[#0F3D2E]",
              },
            ].map((item, i) => (
              <div key={i} className={`${item.color} rounded-2xl p-8 relative text-center hover:shadow-lg transition-shadow`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-[#E6F4EE] text-[#2F8F6B] text-xs font-bold px-3 py-1 rounded-full">
                  Step {item.step}
                </div>
                <div className={`w-14 h-14 ${item.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-5 text-white mt-3`}>
                  {item.icon}
                </div>
                <h3 className="text-[#0F3D2E] font-[Manrope] font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Impact Stats */}
      <section className="py-16 bg-gradient-to-r from-[#0F3D2E] to-[#1A5C43]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <StatCounter value={12480} label="Vetted Profiles" suffix="+" />
            <StatCounter value={847} label="Active Projects" />
            <StatCounter value={63} label="Regions Covered" />
            <StatCounter value={320000} label="kg CO₂ Offset" suffix="+" />
          </div>
        </div>
      </section>

      {/* Featured Missions */}
      <section className="py-20 bg-[#F9FDFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[#2F8F6B] font-semibold text-sm uppercase tracking-wider">Featured Missions</span>
              <h2 className="text-[#0F3D2E] font-[Manrope] font-bold mt-2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
                Real missions. Real impact.
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="hidden md:flex items-center gap-1.5 text-[#2F8F6B] font-medium text-sm hover:text-[#0F3D2E] transition-colors"
            >
              View all missions <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {missions.map((mission) => (
              <Link
                to={`/missions/${mission.id}`}
                key={mission.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={mission.image}
                    alt={mission.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[#0F3D2E]">
                      {mission.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${mission.color}`}>
                      {mission.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-[Manrope] font-bold text-[#0F3D2E] mb-2 leading-tight">
                    {mission.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      {mission.difficulty}
                    </span>
                    <span>·</span>
                    <span>{mission.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3.5 h-3.5" />
                      {mission.participants} joined
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#2F8F6B]">
                      <Star className="w-3.5 h-3.5 fill-[#2F8F6B]" />
                      +{mission.points} pts
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 md:hidden text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-[#2F8F6B] font-medium text-sm"
            >
              View all missions <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dual Sign-Up Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#0F3D2E] font-[Manrope] font-bold" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              How do you want to contribute?
            </h2>
            <p className="text-gray-500 mt-2">Join thousands of climate champions making a difference today.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poster Card */}
            <div className="group relative border-2 border-[#E6F4EE] rounded-2xl p-8 hover:border-[#2F8F6B] hover:shadow-lg transition-all cursor-pointer">
              <div className="w-14 h-14 bg-[#E6F4EE] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#2F8F6B] transition-colors">
                <Globe className="w-7 h-7 text-[#2F8F6B] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[#0F3D2E] font-[Manrope] font-bold text-xl mb-2">
                I need people for a project
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Post your climate project and get matched with vetted volunteers, professionals, and students ready to help.
              </p>
              <ul className="space-y-2 mb-7">
                {["Post unlimited projects", "Smart skill matching", "Access funding resources", "Manage your team"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#2F8F6B] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className="w-full flex items-center justify-center gap-2 bg-[#0F3D2E] text-white py-3 rounded-xl font-semibold hover:bg-[#2F8F6B] transition-colors"
              >
                Post a Project <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Responder Card */}
            <div className="group relative border-2 border-[#E6F4EE] rounded-2xl p-8 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-teal-500 transition-colors">
                <Sprout className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[#0F3D2E] font-[Manrope] font-bold text-xl mb-2">
                I have skills to offer
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Browse real-world missions, apply your skills, earn impact points, and build a verified climate portfolio.
              </p>
              <ul className="space-y-2 mb-7">
                {["Complete hands-on missions", "Earn impact points & badges", "Get verified credentials", "Join community challenges"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
              >
                Offer My Skills <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#E6F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2F8F6B] font-semibold text-sm uppercase tracking-wider">Success Stories</span>
            <h2 className="text-[#0F3D2E] font-[Manrope] font-bold mt-2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              Real people. Real change.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0F3D2E] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F3D2E] text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#0F3D2E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D2E] to-[#1A5C43]" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#2F8F6B]/10 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#2F8F6B]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-[#6DD4A8]" />
          </div>
          <h2 className="text-white font-[Manrope] font-extrabold mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            Start your climate journey today
          </h2>
          <p className="text-[#A8D5BF] text-lg mb-8 leading-relaxed">
            Join 12,000+ climate champions already making a difference. Your skills matter. Your actions count.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 bg-[#2F8F6B] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#257A5B] transition-all shadow-lg"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Browse Missions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
