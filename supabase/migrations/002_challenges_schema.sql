-- SkillSeed Community Challenges Schema
-- Migration: 002_challenges_schema.sql
-- Created: 2026-03-07

-- =============================================================================
-- CHALLENGES TABLE
-- Community-driven climate action challenges
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g. 'Waste Reduction', 'Solar Energy', 'Urban Greening'
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
-- Tracks user participation and progress in challenges
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
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON public.challenges(creator_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON public.challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON public.challenges(deadline);

CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_status ON public.challenge_participants(status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on both tables
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- CHALLENGES POLICIES

-- Anyone can read active challenges
CREATE POLICY "Public read active challenges"
  ON public.challenges FOR SELECT
  USING (status = 'active');

-- Creators can read their own drafts
CREATE POLICY "Creators can read own challenges"
  ON public.challenges FOR SELECT
  TO authenticated
  USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Authenticated users can insert challenges
CREATE POLICY "Auth users can create challenges"
  ON public.challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Creators can update their own challenges
CREATE POLICY "Creators can update own challenges"
  ON public.challenges FOR UPDATE
  TO authenticated
  USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Creators can delete their own challenges
CREATE POLICY "Creators can delete own challenges"
  ON public.challenges FOR DELETE
  TO authenticated
  USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- CHALLENGE PARTICIPANTS POLICIES

-- Participants can read their own participation records
CREATE POLICY "Read own participation"
  ON public.challenge_participants FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Anyone can read participant counts (for display)
CREATE POLICY "Public read participation stats"
  ON public.challenge_participants FOR SELECT
  USING (true);

-- Authenticated users can join challenges
CREATE POLICY "Auth users can join challenges"
  ON public.challenge_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Participants can update their own progress
CREATE POLICY "Participants can update own progress"
  ON public.challenge_participants FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Participants can leave challenges
CREATE POLICY "Participants can leave challenges"
  ON public.challenge_participants FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to increment participant count when a user joins
CREATE OR REPLACE FUNCTION increment_participant_count(p_challenge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges 
  SET participant_count = participant_count + 1,
      updated_at = NOW()
  WHERE id = p_challenge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement participant count when a user leaves
CREATE OR REPLACE FUNCTION decrement_participant_count(p_challenge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges 
  SET participant_count = GREATEST(participant_count - 1, 0),
      updated_at = NOW()
  WHERE id = p_challenge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment action count
CREATE OR REPLACE FUNCTION increment_action_count(p_challenge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.challenges 
  SET action_count = action_count + 1,
      updated_at = NOW()
  WHERE id = p_challenge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- LEADERBOARD VIEW
-- Aggregates total points per user across all challenges
-- =============================================================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  cp.user_id,
  p.name,
  p.location,
  p.avatar_url,
  SUM(cp.points_earned)::INT AS total_points,
  COUNT(cp.challenge_id)::INT AS missions_completed
FROM public.challenge_participants cp
JOIN public.profiles p ON p.id = cp.user_id
GROUP BY cp.user_id, p.name, p.location, p.avatar_url
ORDER BY total_points DESC;

-- Grant access to the view
GRANT SELECT ON public.leaderboard TO authenticated;
GRANT SELECT ON public.leaderboard TO anon;

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_challenges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW
  EXECUTE FUNCTION update_challenges_updated_at();

-- =============================================================================
-- FEATURED CHALLENGE VIEW
-- Auto-computed based on activity score formula
-- activity_score = (participant_count * 2) + (action_count * 1.5) + recency_bonus
-- =============================================================================
CREATE OR REPLACE VIEW public.featured_challenge AS
SELECT *,
  (
    (participant_count * 2) +
    (action_count * 1.5) +
    CASE 
      WHEN created_at > NOW() - INTERVAL '7 days' THEN 50
      ELSE 0 
    END
  ) AS activity_score
FROM public.challenges
WHERE status = 'active'
  AND deadline > NOW()
ORDER BY activity_score DESC, deadline ASC
LIMIT 1;

-- Grant access to the featured challenge view
GRANT SELECT ON public.featured_challenge TO authenticated;
GRANT SELECT ON public.featured_challenge TO anon;

-- =============================================================================
-- LOG CHALLENGE ACTION FUNCTION
-- Increments both global action count and personal actions/points
-- =============================================================================
CREATE OR REPLACE FUNCTION log_challenge_action(p_challenge_id UUID, p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Increment global action count on the challenge
  UPDATE public.challenges 
    SET action_count = action_count + 1,
        updated_at = NOW()
    WHERE id = p_challenge_id;

  -- Increment personal actions for this participant
  -- Earn 1/5 of reward per action logged
  UPDATE public.challenge_participants 
    SET actions_completed = actions_completed + 1,
        points_earned = points_earned + (
          SELECT COALESCE(points_reward, 100) FROM public.challenges WHERE id = p_challenge_id
        ) / 5
    WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- CHALLENGE SUBMISSIONS TABLE
-- Photo proof submissions when users complete a challenge
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
-- Tracks which users have liked which submissions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.submission_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.challenge_submissions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(submission_id, user_id)
);

-- =============================================================================
-- INDEXES FOR SUBMISSIONS AND LIKES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge_id ON public.challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user_id ON public.challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_created_at ON public.challenge_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submission_likes_submission_id ON public.submission_likes(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_likes_user_id ON public.submission_likes(user_id);

-- =============================================================================
-- RLS FOR SUBMISSIONS
-- =============================================================================
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read submissions (public feed)
CREATE POLICY "Public read submissions"
  ON public.challenge_submissions FOR SELECT
  USING (true);

-- Authenticated users can insert their own submissions
CREATE POLICY "Auth users can submit"
  ON public.challenge_submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Users can delete their own submissions
CREATE POLICY "Users can delete own submissions"
  ON public.challenge_submissions FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- =============================================================================
-- RLS FOR SUBMISSION LIKES
-- =============================================================================
ALTER TABLE public.submission_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read likes (for counting)
CREATE POLICY "Public read likes"
  ON public.submission_likes FOR SELECT
  USING (true);

-- Authenticated users can like submissions
CREATE POLICY "Auth users can like"
  ON public.submission_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Users can unlike (delete their own likes)
CREATE POLICY "Users can unlike"
  ON public.submission_likes FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- =============================================================================
-- COMPLETE CHALLENGE FUNCTION
-- Marks participant as completed and awards full points
-- =============================================================================
CREATE OR REPLACE FUNCTION complete_challenge_rpc(
  p_challenge_id UUID,
  p_user_id UUID,
  p_photo_url TEXT,
  p_reflection TEXT DEFAULT NULL,
  p_impact_summary TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_submission_id UUID;
  v_points_reward INT;
BEGIN
  -- Get the challenge points reward
  SELECT points_reward INTO v_points_reward
  FROM public.challenges
  WHERE id = p_challenge_id;

  IF v_points_reward IS NULL THEN
    RAISE EXCEPTION 'Challenge not found';
  END IF;

  -- Update participant status to completed and award full points
  UPDATE public.challenge_participants
  SET status = 'completed',
      points_earned = v_points_reward
  WHERE challenge_id = p_challenge_id AND user_id = p_user_id;

  -- Insert the submission record
  INSERT INTO public.challenge_submissions (challenge_id, user_id, photo_url, reflection, impact_summary)
  VALUES (p_challenge_id, p_user_id, p_photo_url, p_reflection, p_impact_summary)
  RETURNING id INTO v_submission_id;

  RETURN v_submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TOGGLE SUBMISSION LIKE FUNCTION
-- Adds like if not exists, removes if exists; returns new like_count
-- =============================================================================
CREATE OR REPLACE FUNCTION toggle_submission_like(p_submission_id UUID, p_user_id UUID)
RETURNS INT AS $$
DECLARE
  v_exists BOOLEAN;
  v_new_count INT;
BEGIN
  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM public.submission_likes
    WHERE submission_id = p_submission_id AND user_id = p_user_id
  ) INTO v_exists;

  IF v_exists THEN
    -- Remove like
    DELETE FROM public.submission_likes
    WHERE submission_id = p_submission_id AND user_id = p_user_id;

    -- Decrement count
    UPDATE public.challenge_submissions
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = p_submission_id
    RETURNING like_count INTO v_new_count;
  ELSE
    -- Add like
    INSERT INTO public.submission_likes (submission_id, user_id)
    VALUES (p_submission_id, p_user_id);

    -- Increment count
    UPDATE public.challenge_submissions
    SET like_count = like_count + 1
    WHERE id = p_submission_id
    RETURNING like_count INTO v_new_count;
  END IF;

  RETURN COALESCE(v_new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMUNITY FEED VIEW
-- Submissions with user and challenge info for the feed
-- =============================================================================
CREATE OR REPLACE VIEW public.community_feed AS
SELECT 
  cs.id,
  cs.challenge_id,
  cs.user_id,
  cs.photo_url,
  cs.reflection,
  cs.impact_summary,
  cs.like_count,
  cs.created_at,
  c.title AS challenge_title,
  c.category AS challenge_category,
  c.points_reward AS challenge_points,
  p.name AS user_name,
  p.avatar_url AS user_avatar,
  p.location AS user_location
FROM public.challenge_submissions cs
JOIN public.challenges c ON c.id = cs.challenge_id
JOIN public.profiles p ON p.id = cs.user_id
ORDER BY cs.created_at DESC;

-- Grant access to the feed view
GRANT SELECT ON public.community_feed TO authenticated;
GRANT SELECT ON public.community_feed TO anon;

-- =============================================================================
-- STORAGE BUCKET FOR CHALLENGE PHOTOS
-- Run this in the Supabase dashboard SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('challenge-photos', 'challenge-photos', true);
-- =============================================================================
