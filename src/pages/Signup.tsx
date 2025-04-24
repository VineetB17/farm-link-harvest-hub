
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    location: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please make sure your passwords match',
        variant: 'destructive',
      });
      return;
    }
    
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.farmName,
        formData.location
      );
      navigate('/inventory');
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error creating your account',
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
          <CardTitle className="text-2xl font-bold text-farmlink-secondary">
            {step === 1 ? 'Create Your Account' : 'Farm Details'}
          </CardTitle>
          <p className="text-gray-600 mt-1 text-sm">
            {step === 1 ? 'Enter your personal information' : 'Tell us about your farm'}
          </p>
        </CardHeader>
        
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleNextStep}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="password">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="farmName">
                    Farm Name
                  </label>
                  <Input
                    id="farmName"
                    name="farmName"
                    type="text"
                    value={formData.farmName}
                    onChange={handleChange}
                    placeholder="Green Acres Farm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="location">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Mumbai, Maharashtra"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="phone">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 border border-farmlink-primary text-farmlink-primary rounded-md hover:bg-farmlink-light"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-2"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-farmlink-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
