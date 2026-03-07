-- ================================================================================
-- SKILLSEED COMMUNITY CHALLENGES - COMPLETE SETUP
-- Run this entire script in Supabase SQL Editor to set up tables + seed data
-- ================================================================================

-- =============================================================================
-- CHALLENGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  points_reward INT DEFAULT 100,
  participant_count INT DEFAULT 0,
  action_count INT DEFAULT 0,
  banner_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'draft')),
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CHALLENGE PARTICIPANTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'joined' CHECK (status IN ('joined', 'completed')),
  actions_completed INT DEFAULT 0,
  points_earned INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- =============================================================================
-- CHALLENGE SUBMISSIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  reflection TEXT,
  impact_summary TEXT,
  like_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- SUBMISSION LIKES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.submission_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.challenge_submissions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON public.challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON public.challenges(deadline);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_status ON public.challenge_participants(status);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge_id ON public.challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user_id ON public.challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_created_at ON public.challenge_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submission_likes_submission_id ON public.submission_likes(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_likes_user_id ON public.submission_likes(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_likes ENABLE ROW LEVEL SECURITY;

-- Challenges policies
DROP POLICY IF EXISTS "Public read active challenges" ON public.challenges;
CREATE POLICY "Public read active challenges" ON public.challenges FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Auth users can create challenges" ON public.challenges;
CREATE POLICY "Auth users can create challenges" ON public.challenges FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Creators can update own challenges" ON public.challenges;
CREATE POLICY "Creators can update own challenges" ON public.challenges FOR UPDATE TO authenticated
  USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Creators can delete own challenges" ON public.challenges;
CREATE POLICY "Creators can delete own challenges" ON public.challenges FOR DELETE TO authenticated
  USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Participants policies
DROP POLICY IF EXISTS "Public read participation stats" ON public.challenge_participants;
CREATE POLICY "Public read participation stats" ON public.challenge_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users can join challenges" ON public.challenge_participants;
CREATE POLICY "Auth users can join challenges" ON public.challenge_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Participants can update own progress" ON public.challenge_participants;
CREATE POLICY "Participants can update own progress" ON public.challenge_participants FOR UPDATE TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Participants can leave challenges" ON public.challenge_participants;
CREATE POLICY "Participants can leave challenges" ON public.challenge_participants FOR DELETE TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Submissions policies
DROP POLICY IF EXISTS "Public read submissions" ON public.challenge_submissions;
CREATE POLICY "Public read submissions" ON public.challenge_submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users can submit" ON public.challenge_submissions;
CREATE POLICY "Auth users can submit" ON public.challenge_submissions FOR INSERT TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own submissions" ON public.challenge_submissions;
CREATE POLICY "Users can delete own submissions" ON public.challenge_submissions FOR DELETE TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Likes policies
DROP POLICY IF EXISTS "Public read likes" ON public.submission_likes;
CREATE POLICY "Public read likes" ON public.submission_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Auth users can like" ON public.submission_likes;
CREATE POLICY "Auth users can like" ON public.submission_likes FOR INSERT TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can unlike" ON public.submission_likes;
CREATE POLICY "Users can unlike" ON public.submission_likes FOR DELETE TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- =============================================================================
-- FUNCTIONS
-- =============================================================================
CREATE OR REPLACE FUNCTION increment_participant_count(p_challenge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges SET participant_count = participant_count + 1, updated_at = NOW() WHERE id = p_challenge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_participant_count(p_challenge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges SET participant_count = GREATEST(participant_count - 1, 0), updated_at = NOW() WHERE id = p_challenge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_action_count(p_challenge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges SET action_count = action_count + 1, updated_at = NOW() WHERE id = p_challenge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_challenge_action(p_challenge_id UUID, p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges SET action_count = action_count + 1, updated_at = NOW() WHERE id = p_challenge_id;
  UPDATE public.challenge_participants 
    SET actions_completed = actions_completed + 1,
        points_earned = points_earned + (SELECT COALESCE(points_reward, 100) FROM public.challenges WHERE id = p_challenge_id) / 5
    WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION complete_challenge_rpc(
  p_challenge_id UUID, p_user_id UUID, p_photo_url TEXT, p_reflection TEXT DEFAULT NULL, p_impact_summary TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_submission_id UUID;
  v_points_reward INT;
BEGIN
  SELECT points_reward INTO v_points_reward FROM public.challenges WHERE id = p_challenge_id;
  IF v_points_reward IS NULL THEN RAISE EXCEPTION 'Challenge not found'; END IF;
  UPDATE public.challenge_participants SET status = 'completed', points_earned = v_points_reward WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
  INSERT INTO public.challenge_submissions (challenge_id, user_id, photo_url, reflection, impact_summary) VALUES (p_challenge_id, p_user_id, p_photo_url, p_reflection, p_impact_summary) RETURNING id INTO v_submission_id;
  RETURN v_submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION toggle_submission_like(p_submission_id UUID, p_user_id UUID)
RETURNS INT AS $$
DECLARE v_exists BOOLEAN; v_new_count INT;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.submission_likes WHERE submission_id = p_submission_id AND user_id = p_user_id) INTO v_exists;
  IF v_exists THEN
    DELETE FROM public.submission_likes WHERE submission_id = p_submission_id AND user_id = p_user_id;
    UPDATE public.challenge_submissions SET like_count = GREATEST(like_count - 1, 0) WHERE id = p_submission_id RETURNING like_count INTO v_new_count;
  ELSE
    INSERT INTO public.submission_likes (submission_id, user_id) VALUES (p_submission_id, p_user_id);
    UPDATE public.challenge_submissions SET like_count = like_count + 1 WHERE id = p_submission_id RETURNING like_count INTO v_new_count;
  END IF;
  RETURN COALESCE(v_new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- VIEWS
-- =============================================================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT cp.user_id, p.name, p.location, p.avatar_url, SUM(cp.points_earned)::INT AS total_points, COUNT(cp.challenge_id)::INT AS missions_completed
FROM public.challenge_participants cp JOIN public.profiles p ON p.id = cp.user_id
GROUP BY cp.user_id, p.name, p.location, p.avatar_url ORDER BY total_points DESC;

CREATE OR REPLACE VIEW public.featured_challenge AS
SELECT *, ((participant_count * 2) + (action_count * 1.5) + CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 50 ELSE 0 END) AS activity_score
FROM public.challenges WHERE status = 'active' AND deadline > NOW() ORDER BY activity_score DESC, deadline ASC LIMIT 1;

CREATE OR REPLACE VIEW public.community_feed AS
SELECT cs.id, cs.challenge_id, cs.user_id, cs.photo_url, cs.reflection, cs.impact_summary, cs.like_count, cs.created_at,
  c.title AS challenge_title, c.category AS challenge_category, c.points_reward AS challenge_points,
  p.name AS user_name, p.avatar_url AS user_avatar, p.location AS user_location
FROM public.challenge_submissions cs JOIN public.challenges c ON c.id = cs.challenge_id JOIN public.profiles p ON p.id = cs.user_id
ORDER BY cs.created_at DESC;

-- Grant view access
GRANT SELECT ON public.leaderboard TO authenticated, anon;
GRANT SELECT ON public.featured_challenge TO authenticated, anon;
GRANT SELECT ON public.community_feed TO authenticated, anon;

-- =============================================================================
-- SEED DATA - CHALLENGES (no creator_id so it works without profiles)
-- =============================================================================
INSERT INTO public.challenges (id, creator_id, title, description, category, difficulty, points_reward, participant_count, action_count, banner_url, status, deadline) VALUES
('c1111111-1111-1111-1111-111111111111', NULL, 'Build a Solar Light for Your Community', 'Assemble a low-cost solar lamp using recycled bottles and basic electronics. Document your build, share it with neighbors, and inspire others to light up off-grid areas.', 'Solar Energy', 'Intermediate', 500, 1230, 4820, 'https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '30 days'),
('c1111111-1111-1111-1111-111111111112', NULL, '30-Day Zero Waste Challenge', 'Reduce household waste to near-zero for 30 days. Document your journey, share tips, and inspire your neighborhood.', 'Waste Reduction', 'Intermediate', 500, 2840, 12450, 'https://images.unsplash.com/photo-1759503407810-f0402fd9f237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '12 days'),
('c1111111-1111-1111-1111-111111111113', NULL, 'Plant 3 Trees in Your Barangay', 'Source native seedlings, plant them in public spaces, and geo-tag each tree. Coordinate with your local barangay hall.', 'Urban Greening', 'Beginner', 300, 1780, 5340, 'https://images.unsplash.com/photo-1752169580565-c2515f8973f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '21 days'),
('c1111111-1111-1111-1111-111111111114', NULL, 'Conduct a Carbon Audit at Home', 'Use the SkillSeed carbon tracker to log your household emissions for one week. Share your results and one action you took to reduce them.', 'Energy Efficiency', 'Beginner', 200, 945, 3780, 'https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '14 days'),
('c1111111-1111-1111-1111-111111111115', NULL, 'Community Repair Marathon', 'Host or attend a local repair event. Repair items, document them, and together we''ll save thousands from the landfill.', 'Waste Reduction', 'Beginner', 350, 620, 1860, 'https://images.unsplash.com/photo-1585406666850-82f7532fdae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '22 days'),
('c1111111-1111-1111-1111-111111111116', NULL, 'Urban Garden Network', 'Start or contribute to an urban garden in your area. Connect rooftop gardens, balcony farms, and community plots into a city-wide food network.', 'Urban Greening', 'Beginner', 450, 1780, 7120, 'https://images.unsplash.com/photo-1763897710760-2d47e1fa69ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '30 days'),
('c1111111-1111-1111-1111-111111111117', NULL, 'Rainwater Harvesting Setup', 'Install a simple rainwater collection system at home or in your community. Document the setup process and measure water saved.', 'Water Conservation', 'Intermediate', 400, 520, 1560, 'https://images.unsplash.com/photo-1626793369994-a904d2462888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '28 days'),
('c1111111-1111-1111-1111-111111111118', NULL, 'Climate Action Sprint', 'A week-long intensive challenge: complete 5 mini-missions across different climate skills areas in 7 days.', 'Mixed', 'Advanced', 600, 3200, 16000, 'https://images.unsplash.com/photo-1759503407810-f0402fd9f237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600', 'active', NOW() + INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE BUCKET (run separately if needed)
-- =============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('challenge-photos', 'challenge-photos', true);
