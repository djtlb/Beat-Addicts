import React from 'react';
import PricingPlans from '../components/PricingPlans';

const Pricing = () => {
  console.log('Pricing page rendered');

  return (
    <div className="min-h-screen studio-bg">
      <div className="max-w-7xl mx-auto space-y-12 p-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-raver underground-text-glow">NEURAL STUDIO PRICING</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-underground">
            Choose your path to AI-powered music production mastery
          </p>
        </div>

        {/* Production Process Demo Videos */}
        <div className="space-y-8">
          <h2 className="text-3xl font-raver text-center underground-text-glow">PRODUCTION PROCESS DEMOS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Generation Demo */}
            <div className="underground-glass p-6 rounded-xl">
              <h3 className="font-raver text-white mb-4 text-center">AI MUSIC GENERATION</h3>
              <div className="aspect-video bg-black/40 rounded-lg mb-4 flex items-center justify-center border border-purple-500/30">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-gray-300 font-underground">Watch AI create full tracks</p>
                  <p className="text-xs text-gray-500 mt-2">2:30 demonstration</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 font-underground">
                See how our neural networks transform simple prompts into complete musical compositions with drums, bass, melodies, and arrangements.
              </p>
            </div>

            {/* Stem Separation Demo */}
            <div className="underground-glass p-6 rounded-xl">
              <h3 className="font-raver text-white mb-4 text-center">STEM SEPARATION</h3>
              <div className="aspect-video bg-black/40 rounded-lg mb-4 flex items-center justify-center border border-cyan-500/30">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-gray-300 font-underground">AI separates audio tracks</p>
                  <p className="text-xs text-gray-500 mt-2">1:45 demonstration</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 font-underground">
                Watch our AI isolate vocals, drums, bass, and instruments from any audio file with professional precision.
              </p>
            </div>

            {/* Voice Cloning Demo */}
            <div className="underground-glass p-6 rounded-xl">
              <h3 className="font-raver text-white mb-4 text-center">VOICE CLONING</h3>
              <div className="aspect-video bg-black/40 rounded-lg mb-4 flex items-center justify-center border border-emerald-500/30">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-gray-300 font-underground">Ethical voice modeling</p>
                  <p className="text-xs text-gray-500 mt-2">3:15 demonstration</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 font-underground">
                Learn how to record your voice and create AI models that generate vocals in your unique style.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="underground-glass p-8 rounded-xl">
          <h3 className="text-2xl font-raver text-center underground-text-glow mb-8">FEATURE COMPARISON</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 font-raver text-white">FEATURE</th>
                  <th className="text-center p-4 font-raver text-gray-400">STARTER</th>
                  <th className="text-center p-4 font-raver text-blue-400">PRO</th>
                  <th className="text-center p-4 font-raver text-purple-400">STUDIO</th>
                </tr>
              </thead>
              <tbody className="font-underground">
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">AI Music Generation</td>
                  <td className="text-center p-4 text-yellow-400">3/day</td>
                  <td className="text-center p-4 text-emerald-400">Unlimited</td>
                  <td className="text-center p-4 text-emerald-400">Unlimited</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">Track Duration</td>
                  <td className="text-center p-4 text-gray-400">90 seconds</td>
                  <td className="text-center p-4 text-blue-400">5 minutes</td>
                  <td className="text-center p-4 text-purple-400">10 minutes</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">Audio Quality</td>
                  <td className="text-center p-4 text-gray-400">MP3 320kbps</td>
                  <td className="text-center p-4 text-blue-400">WAV 192kHz</td>
                  <td className="text-center p-4 text-purple-400">WAV 192kHz</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">Voice Cloning</td>
                  <td className="text-center p-4 text-red-400">✗</td>
                  <td className="text-center p-4 text-emerald-400">✓</td>
                  <td className="text-center p-4 text-emerald-400">✓</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">Stem Separation</td>
                  <td className="text-center p-4 text-yellow-400">1/day</td>
                  <td className="text-center p-4 text-emerald-400">Unlimited</td>
                  <td className="text-center p-4 text-emerald-400">Unlimited</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">Commercial Rights</td>
                  <td className="text-center p-4 text-red-400">✗</td>
                  <td className="text-center p-4 text-emerald-400">✓</td>
                  <td className="text-center p-4 text-emerald-400">✓</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">Download Access</td>
                  <td className="text-center p-4 text-red-400">✗</td>
                  <td className="text-center p-4 text-emerald-400">✓</td>
                  <td className="text-center p-4 text-emerald-400">✓</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">Experimental Genres</td>
                  <td className="text-center p-4 text-red-400">✗</td>
                  <td className="text-center p-4 text-red-400">✗</td>
                  <td className="text-center p-4 text-purple-400">Admin Only</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white">API Access</td>
                  <td className="text-center p-4 text-red-400">✗</td>
                  <td className="text-center p-4 text-red-400">✗</td>
                  <td className="text-center p-4 text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="p-4 text-white">Support Level</td>
                  <td className="text-center p-4 text-gray-400">Community</td>
                  <td className="text-center p-4 text-blue-400">24hr Response</td>
                  <td className="text-center p-4 text-purple-400">1hr Response</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Plans */}
        <PricingPlans />

        {/* FAQ Section */}
        <div className="underground-glass p-8 rounded-xl">
          <h3 className="text-2xl font-raver text-center underground-text-glow mb-8">FREQUENTLY ASKED QUESTIONS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-raver text-white mb-2">What are experimental genres?</h4>
                <p className="text-sm text-gray-300 font-underground">
                  Experimental genres like Levity Push and Wubcraft are cutting-edge AI-generated styles that push the boundaries of electronic music, currently available to admin users only.
                </p>
              </div>
              
              <div>
                <h4 className="font-raver text-white mb-2">Can I use generated music commercially?</h4>
                <p className="text-sm text-gray-300 font-underground">
                  Pro and Studio subscribers get full commercial rights to all downloaded content. Free users can only use generated music for personal projects.
                </p>
              </div>
              
              <div>
                <h4 className="font-raver text-white mb-2">How does voice cloning work?</h4>
                <p className="text-sm text-gray-300 font-underground">
                  Record 30 seconds of your own voice, and our AI creates a personalized vocal model. This is ethical AI - only your voice, no celebrity cloning.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-raver text-white mb-2">What audio quality do I get?</h4>
                <p className="text-sm text-gray-300 font-underground">
                  Free users get MP3 320kbps. Pro and Studio users get ultra-HD WAV files at 192kHz/32-bit for professional production quality.
                </p>
              </div>
              
              <div>
                <h4 className="font-raver text-white mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-gray-300 font-underground">
                  Yes, all subscriptions can be cancelled anytime. You keep access to features until your current billing period ends.
                </p>
              </div>
              
              <div>
                <h4 className="font-raver text-white mb-2">What's the difference between Pro and Studio?</h4>
                <p className="text-sm text-gray-300 font-underground">
                  Studio adds longer tracks (10min vs 5min), API access, experimental genres, and priority support with 1-hour response times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;