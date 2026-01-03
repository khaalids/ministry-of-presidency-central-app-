import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/Image';

const LoginAuthentication = () => {
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // Sample users for testing
  const sampleUsers = [
    { role: 'Admin', email: 'admin@gov.et', password: 'Admin@2026', description: 'Full system access' },
    { role: 'DG (Director General)', email: 'dg@gov.et', password: 'DG@2026', description: 'View all departments' },
    { role: 'Minister', email: 'minister@gov.et', password: 'Minister@2026', description: 'View all departments' },
    { role: 'Department Head', email: 'depthead@gov.et', password: 'DeptHead@2026', description: 'Finance department only' }
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/executive-overview');
    }
  }, [user, authLoading, navigate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data, error: signInError } = await signIn(formData?.email, formData?.password);
      
      if (signInError) {
        setError(signInError?.message || 'Invalid email or password');
        setIsSubmitting(false);
        return;
      }

      if (data?.user) {
        // Successful login - redirect will happen via useEffect
        navigate('/executive-overview');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert('Password reset functionality will be implemented');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-5xl flex gap-6">
        {/* Demo Credentials Panel */}
        {showDemoCredentials && (
          <div className="w-96 bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Demo Accounts
              </h3>
              <button
                onClick={() => setShowDemoCredentials(false)}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="X" size={18} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Click any account below to auto-fill credentials for testing
            </p>
            <div className="space-y-3">
              {sampleUsers?.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(user?.email, user?.password)}
                  className="w-full text-left p-3 bg-brown-50 hover:bg-brown-100 rounded-lg border border-border hover:border-primary/50 transition-smooth group"
                  disabled={isSubmitting}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                      {user?.role}
                    </span>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-smooth" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{user?.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Mail" size={12} />
                    <span className="font-mono">{user?.email}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Icon name="Info" size={14} className="flex-shrink-0 mt-0.5" />
                <p>
                  These are test accounts for demonstration purposes. Each role has different access levels.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="flex-1 max-w-md">
          {/* Header with Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-brown-100 flex items-center justify-center">
                <Image 
                  src="assets/images/New_Project__1_-1767357804834.jpg" 
                  alt="Ministry Dashboard Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Ministry Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Secure Access for Government Officials
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
              Sign In to Your Account
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon name="Mail" size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData?.email}
                    onChange={(e) => handleChange('email', e?.target?.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                    placeholder="your.email@ministry.gov"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Icon name="Lock" size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData?.password}
                    onChange={(e) => handleChange('password', e?.target?.value)}
                    required
                    className="w-full pl-10 pr-12 py-2.5 bg-card border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                    disabled={isSubmitting}
                  >
                    <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e?.target?.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 transition-smooth"
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Show Demo Credentials Toggle */}
            {!showDemoCredentials && (
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={() => setShowDemoCredentials(true)}
                  className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-smooth"
                >
                  <Icon name="Users" size={16} />
                  <span>Show Demo Accounts</span>
                </button>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Icon name="Shield" size={16} className="flex-shrink-0 mt-0.5" />
                <p>
                  Your credentials are encrypted and transmitted securely. For security compliance,
                  sessions will timeout after inactivity.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>© 2026 Ministry Dashboard. All rights reserved.</p>
            <p className="mt-1">Authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuthentication;