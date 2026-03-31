import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { supabase } from "../utils/supabase";

export function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Supabase will have already processed the OAuth callback at this point.
      // We simply verify there's a session and then route the user onward.
      const next = params.get("next") || "/dashboard";
      try {
        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          if (data.session) navigate(next, { replace: true });
          else navigate("/auth?tab=login", { replace: true });
        }
      } catch {
        if (!cancelled) navigate("/auth?tab=login", { replace: true });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, params]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F9FAFB] dark:bg-[#0D1F18]">
      <div className="flex items-center gap-3 text-sm text-[#4b5563] dark:text-emerald-100/80">
        <Loader2 className="w-4 h-4 animate-spin" />
        Completing sign-in…
      </div>
    </div>
  );
}

