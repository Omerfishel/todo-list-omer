
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signUp(email, password, username);
      setSuccess(true);
      // Don't navigate immediately, let the user see the success message
      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000); // After 3 seconds, redirect to sign in
    } catch (error) {
      console.error("SignUp error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-indigo-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">Create an account</CardTitle>
            <CardDescription className="text-center">
              Sign up to start managing your tasks.
            </CardDescription>
          </CardHeader>
          {success ? (
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <h3 className="font-bold">Account created successfully!</h3>
                <p>Please check your email to verify your account.</p>
                <p className="mt-2">You will be redirected to the sign in page shortly...</p>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose a username"
                    className="border-indigo-100 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="border-indigo-100 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a password"
                    minLength={6}
                    className="border-indigo-100 focus-visible:ring-indigo-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700" 
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
