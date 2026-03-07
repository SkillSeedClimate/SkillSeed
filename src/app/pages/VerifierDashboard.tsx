import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getCurrentProfile } from '../utils/matchService';
import {
  fetchPendingSubmissions,
  verifySubmission,
  rejectSubmission
} from '../utils/questService';
import type { Profile, QuestProgressWithDetails } from '../types/database';
import { toast } from 'sonner';

export function VerifierDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<QuestProgressWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    if (authLoading) return;

    async function loadData() {
      setLoading(true);
      try {
        if (!user) {
          navigate('/auth');
          return;
        }

        const profileData = await getCurrentProfile();
        if (!profileData?.id || !profileData.is_verifier) {
          toast.error('Access denied. Verifier privileges required.');
          navigate('/hands-on');
          return;
        }

        setProfile(profileData);

        const submissionsData = await fetchPendingSubmissions();
        setSubmissions(submissionsData);
      } catch (err) {
        console.error('Error loading submissions:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading, navigate]);

  // Handle verify
  const handleVerify = async (submission: QuestProgressWithDetails) => {
    if (!profile?.id) return;

    setProcessingId(submission.id);
    try {
      await verifySubmission(
        submission.id,
        submission.user_id,
        submission.quest_id,
        profile.id
      );
      toast.success('Submission verified and certificate awarded!');
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
    } catch (err) {
      console.error('Error verifying:', err);
      toast.error('Failed to verify submission.');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject
  const handleReject = async (submission: QuestProgressWithDetails) => {
    const reason = window.prompt('Rejection reason (will be shown to user):');
    if (!reason) return;

    setProcessingId(submission.id);
    try {
      await rejectSubmission(submission.id, reason);
      toast.success('Submission rejected with feedback.');
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
    } catch (err) {
      console.error('Error rejecting:', err);
      toast.error('Failed to reject submission.');
    } finally {
      setProcessingId(null);
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F8F6B]" />
          <p className="text-gray-500">Loading submissions...</p>
        </div>
      </div>
    );
  }

  // Auth guard
  if (!user || !profile?.is_verifier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 text-[#0F3D2E]">Access Denied</h2>
          <p className="mb-4 text-gray-500">
            You need verifier privileges to access this page.
          </p>
          <Link to="/hands-on" className="text-[#2F8F6B] font-semibold">
            Back to Quests →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a3a2a] px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/hands-on')}
            className="flex items-center gap-2 text-green-300 text-sm hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quests
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifier Dashboard</h1>
        <p className="text-sm text-gray-500 mb-8">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''} awaiting
          review
        </p>

        {/* Submissions list */}
        {submissions.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <p className="text-gray-400">No submissions pending review. 🎉</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {submissions.map(sub => {
              const questData = sub.quests as unknown as {
                title?: string;
                tier?: string;
                certificate_name?: string;
                badge_name?: string;
              } | undefined;
              const profileData = sub.profiles as unknown as {
                name?: string;
                avatar_url?: string;
              } | undefined;

              return (
                <div
                  key={sub.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {questData?.title || 'Unknown Quest'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Submitted by {profileData?.name || 'Unknown User'} ·{' '}
                        {sub.submitted_at
                          ? new Date(sub.submitted_at).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <span className="bg-yellow-50 text-yellow-700 text-xs px-3 py-1 rounded-full">
                      📜 {questData?.certificate_name || questData?.badge_name || 'Award'}
                    </span>
                  </div>

                  {/* Photo */}
                  {sub.photo_url && (
                    <img
                      src={sub.photo_url}
                      alt="Submission"
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}

                  {/* Reflection */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-700">"{sub.reflection}"</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerify(sub)}
                      disabled={processingId === sub.id}
                      className="flex-1 bg-green-600 text-white text-sm py-2.5 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {processingId === sub.id ? 'Processing...' : '✓ Verify & Award Certificate'}
                    </button>
                    <button
                      onClick={() => handleReject(sub)}
                      disabled={processingId === sub.id}
                      className="flex-1 border border-red-200 text-red-500 text-sm py-2.5 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                    >
                      ✗ Reject with Feedback
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifierDashboard;
