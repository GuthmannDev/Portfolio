'use client';

import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>Logged in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You're signed in with GitHub. Your user ID is {user.id}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your GitHub information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Username:</span>{' '}
                {user.user_metadata.user_name || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Full Name:</span>{' '}
                {user.user_metadata.full_name || 'N/A'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Last Sign In:</span>{' '}
                {new Date(user.last_sign_in_at || '').toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button 
                className="w-full px-4 py-2 text-sm font-medium text-center bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => router.push('/dashboard/settings')}
              >
                Account Settings
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
