
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/inventory');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmlink-container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-farmlink-primary flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-farmlink-secondary">
            Welcome Back
          </CardTitle>
          <p className="text-gray-600 mt-1">
            Sign in to access your FarmLink account
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center" htmlFor="email">
                  <Mail className="h-4 w-4 mr-1" /> Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium flex items-center" htmlFor="password">
                    <Lock className="h-4 w-4 mr-1" /> Password
                  </label>
                  <a href="#" className="text-xs text-farmlink-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-farmlink-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <div className="w-full p-4 bg-farmlink-light rounded-md">
            <p className="text-sm text-center text-gray-600 mb-2">
              <strong>Demo Accounts:</strong>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <p><strong>Email:</strong> demo@farmlink.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
              <div>
                <p><strong>Email:</strong> ritesh77@gmail.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
