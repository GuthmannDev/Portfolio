import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return {
    signInWithGithub,
    signOut,
  };
};
