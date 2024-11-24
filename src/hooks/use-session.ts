import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';

export const useSession = () => {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    mounted.current = true;

    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }
        if (mounted.current) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        if (mounted.current) {
          setLoading(false);
        }
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
