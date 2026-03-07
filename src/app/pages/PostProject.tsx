import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createProject } from "../utils/matchService";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  Eye,
  ChevronRight,
  CheckCircle,
  Plus,
  Minus,
  Building2,
  Leaf,
  Image,
  Briefcase,
  Heart,
} from "lucide-react";

const focusAreas = ["Disaster Response", "Reforestation", "Marine", "Urban", "Agriculture", "Education", "Energy", "Water Conservation"];
const allSkills = ["GIS Mapping", "Soil Science", "Forestry", "Community Organising", "Urban Farming", "Solar Installation", "Teaching", "Medical", "Construction", "Electrical"];

export function PostProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<"ongoing" | "urgent">("ongoing");
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [volunteerCount, setVolunteerCount] = useState(5);
  const [professionalCount, setProfessionalCount] = useState(2);
  const [volunteerSkills, setVolunteerSkills] = useState<string[]>([]);
  const [professionalSkills, setProfessionalSkills] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    duration: "",
    description: "",
    bannerUrl: "",
  });

  const resetForm = () => {
    setStep(1);
    setProjectType("ongoing");
    setSelectedFocus([]);
    setVolunteerCount(5);
    setProfessionalCount(2);
    setVolunteerSkills([]);
    setProfessionalSkills([]);
    setSubmitted(false);
    setError(null);
    setFormData({
      title: "",
      location: "",
      startDate: "",
      duration: "",
      description: "",
      bannerUrl: "",
    });
  };

  const toggleFocus = (area: string) => {
    setSelectedFocus(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };
  
  const toggleSkill = (skill: string, type: "volunteer" | "professional") => {
    if (type === "volunteer") {
      setVolunteerSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    } else {
      setProfessionalSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Draft saved");
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const allSkillsNeeded = [...new Set([...volunteerSkills, ...professionalSkills])];

      const project = await createProject({
        title: formData.title,
        type: projectType === "urgent" ? "urgent" : "project",
        focus_area: selectedFocus,
        location: formData.location || null,
        description: formData.description || null,
        volunteers_needed: volunteerCount,
        professionals_needed: professionalCount,
        skills_needed: allSkillsNeeded,
        duration: formData.duration || null,
        start_date: formData.startDate || null,
        status: "open",
        points: projectType === "urgent" ? 200 : 100,
      });

      if (project) {
        setSubmitted(true);
      } else {
        setError("Failed to create project. Please make sure you're logged in and try again.");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = ['Project Basics', 'Details', 'People Needed'];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9FDFB] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#E6F4EE] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#2F8F6B]" />
          </div>
          <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-2xl mb-3">Project Posted!</h2>
          <p className="text-gray-500 mb-2">
            Your project is live. We're matching vetted profiles right now.
          </p>
          <div className="bg-[#E6F4EE] rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-[#0F3D2E] mb-1">
              {projectType === "urgent" ? "🚨 URGENT" : "📌 ONGOING"} · {formData.title || "Your Project"}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedFocus.map(f => (
                <span key={f} className="text-xs bg-white text-[#0F3D2E] px-2 py-0.5 rounded-full">{f}</span>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Link to="/browse" className="w-full flex items-center justify-center gap-2 bg-[#0F3D2E] text-white py-3 rounded-xl font-semibold hover:bg-[#2F8F6B] transition-colors">
              View Matches <ChevronRight className="w-4 h-4" />
            </Link>
            <button onClick={resetForm} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
              Post Another Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FDFB]">
      {/* Header */}
      <div className="bg-[#0F3D2E] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#6DD4A8] font-semibold text-sm uppercase tracking-wider mb-1">Post a Project</p>
          <h1 className="text-white font-[Manrope] font-bold text-3xl md:text-4xl">
            Find the right people for your climate mission
          </h1>
          <p className="text-[#A8D5BF] mt-2">Connect your project with vetted volunteers and professionals.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form — 3 columns */}
          <div className="lg:col-span-3">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > i + 1 ? 'bg-green-500 text-white' :
                    step === i + 1 ? 'bg-[#1a3a2a] text-white' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs ${step === i + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {label}
                  </span>
                  {i < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* STEP 1: Project Basics */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl mb-4">Project Basics</h2>

                  {/* Project Type */}
                  <div>
                    <label className="text-sm font-semibold text-[#0F3D2E] block mb-2">Project Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setProjectType("ongoing")}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                          projectType === "ongoing"
                            ? "bg-[#0F3D2E] text-white"
                            : "border border-gray-200 text-gray-600 hover:border-[#2F8F6B]"
                        }`}
                      >
                        Ongoing Project
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjectType("urgent")}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                          projectType === "urgent"
                            ? "bg-red-500 text-white"
                            : "border border-gray-200 text-gray-600 hover:border-red-300"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Urgent Need
                      </button>
                    </div>
                    {projectType === "urgent" && (
                      <p className="text-red-600 text-xs mt-2">
                        Urgent projects get priority visibility and trigger immediate notifications
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-sm font-semibold text-[#0F3D2E] block mb-1.5">Project Title *</label>
                    <input
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Coastal Reforestation Drive in Surigao"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 focus:border-[#2F8F6B]"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#0F3D2E] mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Location *
                      </label>
                      <input
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Province"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 focus:border-[#2F8F6B]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0F3D2E] mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Start Date
                      </label>
                      <input
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 focus:border-[#2F8F6B] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#0F3D2E] mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 bg-white"
                    >
                      <option value="">Select duration...</option>
                      <option>1 week</option>
                      <option>2 weeks</option>
                      <option>1 month</option>
                      <option>2–3 months</option>
                      <option>6 months</option>
                      <option>Ongoing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#0F3D2E] block mb-2">Focus Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {focusAreas.map(area => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleFocus(area)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                            selectedFocus.includes(area)
                              ? "bg-[#0F3D2E] text-white border-[#0F3D2E]"
                              : "border-gray-200 text-gray-600 hover:border-[#2F8F6B]"
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Project Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl mb-4">Project Details</h2>

                  <div>
                    <label className="text-sm font-semibold text-[#0F3D2E] block mb-1.5">Project Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Describe the project, its goals, what volunteers/professionals will do, and the expected impact (max 250 words)..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 focus:border-[#2F8F6B] resize-none"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {formData.description.trim().split(/\s+/).filter(Boolean).length}/250 words
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#0F3D2E] block mb-1.5">
                      <Image className="w-3.5 h-3.5 inline mr-1" />
                      Banner Image URL
                    </label>
                    <input
                      name="bannerUrl"
                      type="url"
                      value={formData.bannerUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8F6B]/30 focus:border-[#2F8F6B]"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Add a compelling image that represents your project
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: People Needed */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-[Manrope] font-bold text-[#0F3D2E] text-xl mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#2F8F6B]" /> People Needed
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Volunteers card */}
                    <div className="border border-green-200 rounded-2xl p-4 bg-green-50">
                      <p className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Heart className="w-4 h-4" /> Volunteers Needed
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <button 
                          type="button"
                          onClick={() => setVolunteerCount(v => Math.max(0, v - 1))}
                          className="w-8 h-8 border border-green-300 rounded-lg flex items-center justify-center hover:bg-green-100 text-green-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-3xl font-bold text-green-800 w-12 text-center">{volunteerCount}</span>
                        <button 
                          type="button"
                          onClick={() => setVolunteerCount(v => v + 1)}
                          className="w-8 h-8 border border-green-300 rounded-lg flex items-center justify-center hover:bg-green-100 text-green-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Required skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {allSkills.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill, "volunteer")}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                              volunteerSkills.includes(skill)
                                ? "bg-green-600 text-white border-green-600"
                                : "border-green-300 text-green-700 hover:border-green-500"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Professionals card */}
                    <div className="border border-blue-200 rounded-2xl p-4 bg-blue-50">
                      <p className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Professionals Needed
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <button 
                          type="button"
                          onClick={() => setProfessionalCount(p => Math.max(0, p - 1))}
                          className="w-8 h-8 border border-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-100 text-blue-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-3xl font-bold text-blue-800 w-12 text-center">{professionalCount}</span>
                        <button 
                          type="button"
                          onClick={() => setProfessionalCount(p => p + 1)}
                          className="w-8 h-8 border border-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-100 text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Required skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {allSkills.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill, "professional")}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                              professionalSkills.includes(skill)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-blue-300 text-blue-700 hover:border-blue-500"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* Bottom action bar */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                )}
                <div className="flex gap-3 ml-auto">
                  <button 
                    type="button"
                    onClick={saveDraft}
                    className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50"
                  >
                    Save Draft
                  </button>
                  {step < 3 ? (
                    <button 
                      type="button"
                      onClick={() => setStep(s => s + 1)}
                      className="bg-[#1a3a2a] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-green-900 transition"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-[#1a3a2a] text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-green-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Posting..." : "Post Project"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview — 2 columns */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-500">Live Preview</span>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {formData.bannerUrl ? (
                  <img src={formData.bannerUrl} alt="Project banner" className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 bg-gradient-to-br from-[#0F3D2E] to-[#2F8F6B] flex items-center justify-center">
                    <div className="text-center">
                      <Leaf className="w-8 h-8 text-white/60 mx-auto mb-1" />
                      <p className="text-white/60 text-xs">Project image</p>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  {projectType === "urgent" && (
                    <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full w-fit mb-2">
                      <AlertTriangle className="w-3 h-3" />
                      URGENT
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Your Organisation
                    <span className="text-green-500">✓</span>
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2">
                    {formData.title || "Your Project Title"}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    {formData.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {formData.location}
                      </span>
                    )}
                    {formData.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formData.duration}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedFocus.map(f => (
                      <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>

                  {formData.description && (
                    <p className="text-xs text-gray-500 line-clamp-3 mb-3">{formData.description}</p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {volunteerCount > 0 && (
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" /> {volunteerCount} volunteers
                      </span>
                    )}
                    {professionalCount > 0 && (
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {professionalCount} professionals
                      </span>
                    )}
                  </div>

                  <div className="bg-[#1a3a2a] text-white text-sm font-medium text-center py-2 rounded-xl">
                    View & Apply
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-4 bg-[#E6F4EE] rounded-xl p-4">
                <p className="font-semibold text-[#0F3D2E] text-sm mb-2">💡 Tips for better matches</p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>• Add a clear project description</li>
                  <li>• Select specific focus areas</li>
                  <li>• Tag the exact skills you need</li>
                  <li>• Set a realistic start date</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
