-- SkillSeed Challenge Seed Data
-- Run this after 002_challenges_schema.sql migration
-- =============================================================================

-- =============================================================================
-- DEMO CHALLENGES
-- Using a demo creator_id from the existing seed profiles
-- =============================================================================

INSERT INTO public.challenges (
  id,
  creator_id,
  title,
  description,
  category,
  difficulty,
  points_reward,
  participant_count,
  action_count,
  banner_url,
  status,
  deadline
) VALUES
-- Challenge 1: Solar Light Build
(
  'c1111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111112', -- Marcus Johnson (Solar Expert)
  'Build a Solar Light for Your Community',
  'Assemble a low-cost solar lamp using recycled bottles and basic electronics. Document your build, share it with neighbors, and inspire others to light up off-grid areas.',
  'Solar Energy',
  'Intermediate',
  500,
  1230,
  4820,
  'https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '30 days'
),
-- Challenge 2: Zero Waste
(
  'c1111111-1111-1111-1111-111111111112',
  '11111111-1111-1111-1111-111111111116', -- Tyler Brooks
  '30-Day Zero Waste Challenge',
  'Reduce household waste to near-zero for 30 days. Document your journey, share tips, and inspire your neighborhood.',
  'Waste Reduction',
  'Intermediate',
  500,
  2840,
  12450,
  'https://images.unsplash.com/photo-1759503407810-f0402fd9f237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '12 days'
),
-- Challenge 3: Tree Planting
(
  'c1111111-1111-1111-1111-111111111113',
  '11111111-1111-1111-1111-111111111115', -- Emma Rodriguez (Urban Planner)
  'Plant 3 Trees in Your Barangay',
  'Source native seedlings, plant them in public spaces, and geo-tag each tree. Coordinate with your local barangay hall.',
  'Urban Greening',
  'Beginner',
  300,
  1780,
  5340,
  'https://images.unsplash.com/photo-1752169580565-c2515f8973f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '21 days'
),
-- Challenge 4: Carbon Audit
(
  'c1111111-1111-1111-1111-111111111114',
  '11111111-1111-1111-1111-111111111111', -- Dr. Sarah Chen (Climate Scientist)
  'Conduct a Carbon Audit at Home',
  'Use the SkillSeed carbon tracker to log your household emissions for one week. Share your results and one action you took to reduce them.',
  'Energy Efficiency',
  'Beginner',
  200,
  945,
  3780,
  'https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '14 days'
),
-- Challenge 5: Community Repair
(
  'c1111111-1111-1111-1111-111111111115',
  '11111111-1111-1111-1111-111111111121', -- Michael Torres
  'Community Repair Marathon',
  'Host or attend a local repair event. Repair items, document them, and together we''ll save thousands from the landfill.',
  'Waste Reduction',
  'Beginner',
  350,
  620,
  1860,
  'https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '22 days'
),
-- Challenge 6: Urban Garden Network
(
  'c1111111-1111-1111-1111-111111111116',
  '11111111-1111-1111-1111-111111111115', -- Emma Rodriguez
  'Urban Garden Network',
  'Start or contribute to an urban garden in your area. Connect rooftop gardens, balcony farms, and community plots into a city-wide food network.',
  'Urban Greening',
  'Beginner',
  450,
  1780,
  7120,
  'https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '30 days'
),
-- Challenge 7: Water Conservation
(
  'c1111111-1111-1111-1111-111111111117',
  '11111111-1111-1111-1111-111111111114', -- Dr. James Okonkwo
  'Rainwater Harvesting Setup',
  'Install a simple rainwater collection system at home or in your community. Document the setup process and measure water saved.',
  'Water Conservation',
  'Intermediate',
  400,
  520,
  1560,
  'https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '28 days'
),
-- Challenge 8: Climate Action Sprint (Featured)
(
  'c1111111-1111-1111-1111-111111111118',
  '11111111-1111-1111-1111-111111111111', -- Dr. Sarah Chen
  'Climate Action Sprint',
  'A week-long intensive challenge: complete 5 mini-missions across different climate skills areas in 7 days.',
  'Mixed',
  'Advanced',
  600,
  3200,
  16000,
  'https://images.unsplash.com/photo-1759503407810-f0402fd9f237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  'active',
  NOW() + INTERVAL '7 days'
);

-- =============================================================================
-- DEMO CHALLENGE PARTICIPANTS
-- Seed some participation data for leaderboard
-- =============================================================================

INSERT INTO public.challenge_participants (
  challenge_id,
  user_id,
  status,
  actions_completed,
  points_earned
) VALUES
-- Various participants joining challenges
-- Dr. Sarah Chen
('c1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'completed', 30, 500),
('c1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'completed', 7, 200),
('c1111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111111', 'joined', 3, 300),

-- Marcus Johnson
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111112', 'completed', 5, 500),
('c1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111112', 'completed', 3, 300),
('c1111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111112', 'completed', 5, 600),

-- Aisha Patel
('c1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111113', 'joined', 20, 350),
('c1111111-1111-1111-1111-111111111116', '11111111-1111-1111-1111-111111111113', 'completed', 10, 450),
('c1111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111113', 'joined', 2, 200),

-- Dr. James Okonkwo
('c1111111-1111-1111-1111-111111111117', '11111111-1111-1111-1111-111111111114', 'completed', 5, 400),
('c1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111114', 'joined', 15, 250),

-- Emma Rodriguez
('c1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111115', 'completed', 3, 300),
('c1111111-1111-1111-1111-111111111116', '11111111-1111-1111-1111-111111111115', 'completed', 15, 450),
('c1111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111115', 'joined', 4, 350),

-- Tyler Brooks
('c1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111116', 'completed', 30, 500),
('c1111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111116', 'joined', 2, 100),

-- Sofia Andersen
('c1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111117', 'completed', 7, 200),
('c1111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111117', 'completed', 5, 600),

-- Alex Kim
('c1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111118', 'completed', 3, 300),
('c1111111-1111-1111-1111-111111111116', '11111111-1111-1111-1111-111111111118', 'joined', 5, 150),

-- Priya Sharma
('c1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111119', 'joined', 3, 100),
('c1111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111119', 'joined', 1, 100),

-- Jordan Williams
('c1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111120', 'joined', 10, 150),
('c1111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111120', 'completed', 5, 350);
