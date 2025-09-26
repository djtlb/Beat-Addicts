import React from 'react';
import { 
  Check, 
  Crown, 
  Zap, 
  Download, 
  Music, 
  Mic, 
  Headphones,
  Star,
  Shield,
  Sparkles,
  Target,
  Activity,
  Radio,
  Layers,
  Volume2,
  Settings,
  Clock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PricingPlansProps {
  className?: string;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ className = '' }) => {
  const { subscription, hasAccess } = useAuth();

  console.log('Ultra-premium PricingPlans rendered');

  const plans = [
    {
      id: 'free',
      name: 'Neural Starter',
      tagline: 'Explore AI Music',
      price: { monthly: 0, yearly: 0 },
      description: 'Experience the future of music creation with limited access',
      icon: Music,
      color: 'tier-free',
      gradient: 'from-gray-600 to-gray-800',
      borderGradient: 'from-gray-500 to-gray-700',
      popular: false,
      features: [
        { text: 'Basic AI music synthesis', included: true, note: '3 tracks per day' },
        { text: 'Standard audio quality (MP3 320kbps)', included: true },
        { text: 'Essential genre templates (5 genres)', included: true },
        { text: 'Community support forum', included: true },
        { text: 'Neural processing (50 steps)', included: true },
        { text: 'Track duration up to 90 seconds', included: true },
        { text: 'Download & ownership rights', included: false, note: 'Streaming only' },
        { text: 'Commercial usage rights', included: false, note: 'Personal use only' },
        { text: 'Advanced stem separation', included: false },
        { text: 'Neural voice synthesis', included: false },
        { text: 'Extended compositions', included: false },
        { text: 'Priority neural processing', included: false }
      ],
      limitations: [
        'No ownership or commercial rights',
        'Watermarked audio output',
        'Limited to 90 seconds per track',
        'Basic neural model access only',
        'Community support only',
        '3 generations per day limit'
      ],
      badge: null
    },
    {
      id: 'pro',
      name: 'Neural Professional',
      tagline: 'Professional Creator',
      price: { monthly: 29, yearly: 290 },
      description: 'Advanced AI tools for serious music creators and producers',
      icon: Headphones,
      color: 'tier-pro',
      gradient: 'from-cyan-500 to-blue-600',
      borderGradient: 'from-cyan-400 to-blue-500',
      popular: true,
      features: [
        { text: 'Enhanced AI music generation', included: true, note: '50 tracks per day' },
        { text: 'Ultra-HD audio quality (WAV 192kHz/32-bit)', included: true },
        { text: 'Complete genre library (20+ genres)', included: true },
        { text: 'Download & ownership rights', included: true, note: 'While subscribed' },
        { text: 'Commercial usage license', included: true, note: 'For downloaded tracks' },
        { text: 'Advanced stem separation', included: true, note: '20 per day' },
        { text: 'Neural voice recording & synthesis', included: true, note: '10 per day' },
        { text: 'Extended compositions (up to 5 min)', included: true },
        { text: 'Priority neural processing (2x faster)', included: true },
        { text: 'Advanced neural controls (75 steps)', included: true },
        { text: 'Professional support (24hr response)', included: true }
      ],
      perks: [
        'Full commercial rights for downloaded content',
        'No watermarks on any output',
        'Advanced neural model access',
        'Priority processing queue',
        'Professional audio mastering',
        'Batch generation capabilities'
      ],
      badge: { text: 'Most Popular', color: 'from-cyan-500 to-blue-500' }
    },
    {
      id: 'studio',
      name: 'Neural Studio Master',
      tagline: 'Ultimate Creator Suite',
      price: { monthly: 79, yearly: 790 },
      description: 'Complete professional studio suite with cutting-edge AI technology',
      icon: Crown,
      color: 'tier-studio',
      gradient: 'from-purple-600 via-pink-500 to-purple-800',
      borderGradient: 'from-purple-500 via-pink-400 to-purple-600',
      popular: false,
      features: [
        { text: 'Everything in Neural Professional', included: true },
        { text: 'Maximum AI music generation', included: true, note: '200 tracks per day' },
        { text: 'Advanced neural voice cloning', included: true, note: '50 per day' },
        { text: 'Multi-track stem generation', included: true, note: '100 per day' },
        { text: 'Custom neural model fine-tuning', included: true },
        { text: 'Extended masterpieces (up to 10 min)', included: true },
        { text: 'Quantum batch processing', included: true },
        { text: 'White-label licensing', included: true },
        { text: 'Dedicated studio support (1hr response)', included: true },
        { text: 'Neural remix & variation engine', included: true },
        { text: 'Advanced harmonic layering', included: true, note: '100 steps max' }
      ],
      perks: [
        'Lifetime ownership of all generated content',
        'Custom AI model training on your style',
        'Advanced collaboration tools',
        '24/7 premium studio support',
        'Early access to experimental features',
        'Neural mixing & mastering suite',
        'Professional distribution licensing'
      ],
      badge: { text: 'Ultimate Studio', color: 'from-purple-500 to-pink-500' }
    }
  ];

  const handleSubscribe = (planId: string) => {
    console.log(`Subscribe to ${planId} plan`);
    // TODO: Implement Stripe subscription logic
    alert(`Upgrading to ${planId} plan - Neural payment processing coming soon!`);
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === 'free') return !subscription || subscription.subscription_tier === 'free';
    return subscription?.subscription_tier === planId;
  };

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Ultra-Premium Header */}
      <div className="text-center space-y-6 studio-glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-5xl font-black studio-text-gradient mb-4">Neural Studio Plans</h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-6">
            Quantum-enhanced music production tools for every level of creative professional
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <span className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Neural Processing</span>
            </span>
            <span className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>27.27x Acceleration</span>
            </span>
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ultra-HD Quality</span>
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = isCurrentPlan(plan.id);
          const isPopular = plan.popular;
          
          return (
            <div key={plan.id} className={`${plan.color} relative group hover:scale-105 transition-all duration-500`}>
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`bg-gradient-to-r ${plan.badge.color} text-white px-6 py-3 rounded-full text-sm font-black flex items-center space-x-2 shadow-lg`}>
                    <Star className="w-4 h-4" />
                    <span>{plan.badge.text}</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8 relative">
                <div className={`w-24 h-24 bg-gradient-to-br ${plan.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2">{plan.name}</h3>
                <p className="text-lg font-bold studio-text-premium mb-3">{plan.tagline}</p>
                <p className="text-gray-400 mb-8 leading-relaxed">{plan.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-baseline justify-center space-x-3">
                    <span className="text-5xl font-black text-white">
                      ${plan.price.monthly}
                    </span>
                    <span className="text-xl text-gray-400">/month</span>
                  </div>
                  {plan.price.yearly > 0 && (
                    <p className="text-sm text-emerald-400 font-bold">
                      Save ${(plan.price.monthly * 12) - plan.price.yearly}/year with annual billing
                    </p>
                  )}
                </div>
              </div>

              {/* Enhanced Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 border-2 border-gray-600 rounded-full mt-0.5" />
                    )}
                    <div>
                      <span className={`text-sm font-medium ${feature.included ? 'text-white' : 'text-gray-500'}`}>
                        {feature.text}
                      </span>
                      {feature.note && (
                        <p className="text-xs text-gray-400 mt-1 font-medium">{feature.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Limitations or Perks */}
              {plan.limitations && (
                <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/20 rounded-2xl">
                  <h4 className="text-sm font-black text-red-400 mb-3 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Limitations:</span>
                  </h4>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="text-xs text-red-300 flex items-start space-x-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.perks && (
                <div className="mb-8 p-6 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl">
                  <h4 className="text-sm font-black text-emerald-400 mb-3 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Premium Benefits:</span>
                  </h4>
                  <ul className="space-y-2">
                    {plan.perks.map((perk, index) => (
                      <li key={index} className="text-xs text-emerald-300 flex items-start space-x-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Enhanced CTA Button */}
              <div className="mt-auto">
                {isCurrent ? (
                  <div className="w-full py-4 px-6 bg-gray-700 text-gray-300 rounded-2xl text-center font-black text-lg">
                    Current Neural Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 ${
                      plan.id === 'free'
                        ? 'bg-gray-600 hover:bg-gray-500 text-white hover:scale-105'
                        : `studio-premium-button bg-gradient-to-r ${plan.gradient} hover:scale-105 shadow-2xl`
                    }`}
                  >
                    {plan.id === 'free' ? 'Start Neural Journey' : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Features Comparison */}
      <div className="text-center space-y-8 pt-12 border-t border-gray-700 studio-glass-card p-8 rounded-3xl">
        <h3 className="text-3xl font-black studio-text-gradient">All Neural Plans Include:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-3 p-4 studio-console rounded-2xl">
            <Zap className="w-8 h-8 text-purple-400" />
            <span className="font-bold text-white">Neural AI</span>
            <span className="text-xs text-gray-400 text-center">Advanced artificial intelligence</span>
          </div>
          <div className="flex flex-col items-center space-y-3 p-4 studio-console rounded-2xl">
            <Volume2 className="w-8 h-8 text-cyan-400" />
            <span className="font-bold text-white">Ultra-HD Audio</span>
            <span className="text-xs text-gray-400 text-center">Professional quality output</span>
          </div>
          <div className="flex flex-col items-center space-y-3 p-4 studio-console rounded-2xl">
            <Radio className="w-8 h-8 text-emerald-400" />
            <span className="font-bold text-white">Multi-Genre</span>
            <span className="text-xs text-gray-400 text-center">Diverse musical styles</span>
          </div>
          <div className="flex flex-col items-center space-y-3 p-4 studio-console rounded-2xl">
            <Shield className="w-8 h-8 text-rose-400" />
            <span className="font-bold text-white">Secure & Private</span>
            <span className="text-xs text-gray-400 text-center">Enterprise-grade security</span>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed">
            All subscriptions can be cancelled anytime. Ownership rights only apply to content downloaded while subscription is active. 
            Neural processing powered by quantum-enhanced AI models. Professional licensing available for commercial distribution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;