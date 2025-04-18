import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserAdminStatus } from "../lib/actions";

interface UseIsAdminResult {
  isAdmin: boolean | null;
  loading: boolean;
  error: string | null;
}

export function useIsAdmin(): UseIsAdminResult {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.name) {
      setLoading(false);
      return;
    }

    const fetchAdminStatus = async () => {
      try {
        const response = await getUserAdminStatus(session.user?.name || "") ;
        if (response && response.admin !== undefined) {
          setIsAdmin(response.admin);
        }
      } catch (err) {
        console.error("Error fetching admin status:", err);
        setError("Failed to fetch admin status.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStatus();
  }, [session?.user?.name]);

  return { isAdmin, loading, error };
}
