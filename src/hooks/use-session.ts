import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';

export const useSession = () => {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        return;
      }
      if (mounted.current) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted.current) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, loading };
};
