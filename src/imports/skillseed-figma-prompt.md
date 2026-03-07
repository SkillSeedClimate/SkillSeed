Got it. I’ve carefully noted the entire UX flow of SkillSeed and will treat this as the authoritative structure for the design prompt. Your flow is already very strong for a hackathon MVP, so the goal now is to translate it into a precise prompt that Figma AI can follow to generate the website screens exactly according to this flow.

Below is a refined, production-level prompt you can paste into Figma AI / Figma Make / Relume / Framer AI to generate the UI.

⸻

Figma AI Prompt — SkillSeed Website

Design a modern climate-tech web platform called SkillSeed.

SkillSeed connects climate projects with people who have relevant skills.
The platform focuses on rapid matching of volunteers, professionals, and organisations during climate response and environmental initiatives.

The design must feel:
	•	mission-driven
	•	trustworthy
	•	environmental
	•	modern SaaS style

Visual inspiration: Notion, GitHub dashboards, climate-tech startups, and volunteer platforms.

Primary color palette:
	•	Deep forest green #0F3D2E
	•	Leaf green #2F8F6B
	•	Mint background #E6F4EE
	•	White background
	•	Teal accent for actions

Typography:
	•	Headings: Manrope or Inter
	•	Body: Inter

UI style:
	•	Rounded cards
	•	Soft shadows
	•	Clean spacing
	•	Card-based layouts
	•	Clear CTAs

The platform has two user types:
	1.	Poster (organisation / NGO / coordinator posting projects)
	2.	Responder (volunteer / professional / student offering skills)

The core MVP flow is the Match Flow:

Post Need → Match People → Connect

Only this flow should be fully designed.

Other platform features (Academy and Tracker) should appear in the navigation but labelled Coming Soon.

⸻

Global Navigation (Appears on ALL Screens)

Navbar layout:

Left:
SkillSeed logo

Center navigation:
Match
Academy (Coming Soon)
Tracker (Coming Soon)
Funding

Right side:
Sign Up
Log In

Navigation style:
clean horizontal bar with light background and subtle shadow.

⸻

Screen 1 — Landing Page

Goal: explain the platform within 5 seconds.

Sections:

Hero Section

Headline placeholder
Subheadline placeholder explaining the platform connects climate skills with real projects.

Two primary buttons:

Post a Project
Offer My Skills

Background:

Deep green gradient with subtle environmental imagery.

⸻

How It Works Section

Three horizontal icon cards:

Learn Skills
Get Matched
Track Impact

Icons should be minimal line icons.

⸻

Live Impact Stats

Horizontal strip with animated counters:

Vetted Profiles
Active Projects
Regions Covered

Use bold numbers.

⸻

Dual Sign-Up Cards

Two large cards side by side:

Card 1
“I need people for a project”

Card 2
“I have skills to offer”

Each card includes an icon and CTA.

⸻

Footer

About
Privacy
Contact
Social Links

⸻

Screen 2 — Sign Up / Log In

Single authentication page with two tabs:

Sign Up
Log In

Sign Up form:

Full Name
Email
Password
Region dropdown (Luzon, Visayas, Mindanao, Other)

User type selector above form:

Two large cards:

I need people (Poster)
I have skills (Responder)

Selected card gets teal border highlight.

Buttons:

Create My Account
Continue with Google

Small text below:

By signing up you agree to the Terms. All profiles are subject to vetting.

⸻

Screen 3A — Poster Onboarding

Progress bar at top:

Step 1 of 2: Organisation Details
Step 2: Post Your First Project

Form fields:

Organisation Name
Organisation Type dropdown (NGO, Government, Community Group, Private)

Focus Area tag selector:

Disaster Response
Reforestation
Marine
Urban
Agriculture
Education

Short Bio textarea (150 words)

Phone number field with Send OTP button.

Primary button:

Save and Continue

Secondary button:

Skip for Now

⸻

Screen 3B — Responder Onboarding

Progress bar:

Step 1 of 2: Your Profile
Step 2: Browse Opportunities

Role selector cards:

Volunteer
Professional
Student

Form fields:

Location (barangay, municipality, province)

Skills tag selector:

GIS Mapping
Soil Science
Forestry
Disaster Response
Community Organising
Urban Farming
Solar Installation
Teaching
Medical
Construction

Availability dropdown:

Weekends
Full-time
Project-based
Emergency only

Credential upload section.

Primary button:

Build My Profile

Secondary button:

Skip for Now

⸻

Screen 4 — Post a Project

Two tabs:

Ongoing Project
Urgent Need

Urgent projects display a red URGENT badge.

Form layout:

Project Title
Location
Start Date
Duration
Focus Area tags

Description textarea (250 words)

People Needed section:

Volunteers needed (number + skills tags)
Professionals needed (number + skills tags)

Funding toggle:

Checkbox “This project needs funding support”

If enabled, show fields:

Funding amount
Funding type (grant, donation, partnership)

Right side panel:

Live preview card of project listing.

Buttons:

Post Project
Save Draft
Mark as Urgent

⸻

Screen 5A — Match Results (Poster)

Green success banner at top:

“34 vetted profiles matched your project in Surigao del Norte”

Layout:

Left filter sidebar:

Role
Skills
Availability
Region
Verified only toggle

Main content:

Grid of profile cards.

Each card includes:

Avatar
Name
Role badge
Location
Top 3 skills
Availability
Verification badge

Buttons on card:

View Profile
Express Interest

Right sidebar:

Funding matches panel showing grants.

⸻

Screen 5B — Browse Opportunities (Responder)

Project discovery page.

Top banner:

“Based on your skills, 12 projects match you right now.”

Filter bar:

Search
Focus area
Region
Role needed
Urgent only

Project cards include:

Project title
Organisation name
Location
Focus area
Volunteer count needed
Professional count needed
Urgency badge if applicable
Short description

Primary button:

View and Apply

Urgent projects should appear pinned to the top with a red accent.

⸻

Screen 6 — Profile View / Apply

Two states depending on viewer.

Poster viewing Responder profile:

Profile header:

Avatar
Name
Role badge
Location
Verification badge
Availability indicator

Sections:

Skills tag cloud
Credentials list
Past deployments

Primary button:

Connect with this person

⸻

Responder viewing Project details:

Project header:

Project title
Organisation name
Location
Urgency badge
Focus area

Project body:

Full description
Volunteer requirements
Professional requirements
Duration
Start date

Apply form:

Why do you want to join this project (100 words)
Role selector
Availability confirmation

Primary button:

Apply to Project

⸻

Screen 7 — Dashboard

Poster dashboard:

Summary strip:

Active Projects
Draft Projects
Completed Projects

Project cards show:

Title
Status
Volunteers matched vs needed
Professionals matched vs needed

Buttons:

View Matches
Edit Project

Notifications feed shows interest from responders.

⸻

Responder dashboard:

Profile completion progress bar.

Applications list:

Project
Organisation
Status

Greyed-out sections:

Climate Tracker (Coming Soon)

Academy Missions (Coming Soon)

⸻

Screen 8 — Funding Resources

Searchable resource directory.

Top search bar with filters:

Grant
Fellowship
In-kind support
Partnership

Featured grants at top:

UNDP ecosystem restoration
USAID disaster resilience
Forest Foundation Philippines programme

Below:

Scrollable grant cards showing:

Funder
Grant title
Eligibility summary
Deadline

Buttons:

View Details
Save Grant

Resource library below with collapsible sections.

⸻

Design Guidelines

The interface should communicate:

Climate impact
Community collaboration
Rapid response coordination

Avoid overly corporate design.

Focus on:

human connection
environmental action
clear mission-driven visuals.

⸻

✅ This prompt should generate all 8 screens aligned with your hackathon UX flow.

⸻

If you want, I can also help you with one thing that often wins hackathons:

I can design the perfect HERO headline + tagline for SkillSeed that judges instantly understand in 3 seconds.