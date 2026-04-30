/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Lightbulb, 
  Target, 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Search,
  ArrowRight,
  Loader2,
  Sparkles,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { generateStartupIdeas } from './services/geminiService';
import { StartupIdea, GenerationState } from './types';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

export default function App() {
  const [interest, setInterest] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    ideas: [],
    error: null,
  });

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsModalOpen(true);
    }
  }, []);

  const handleGenerate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!interest.trim() || state.isLoading) return;

    if (!apiKey) {
      setIsModalOpen(true);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const results = await generateStartupIdeas(interest, apiKey);
      setState({
        isLoading: false,
        ideas: results,
        error: null,
      });
    } catch (err) {
      setState({
        isLoading: false,
        ideas: [],
        error: 'Analysis failed. Please check your API key or refine your interest.',
      });
    }
  };

  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-bg-root/80 backdrop-blur-md border-b border-border-subtle px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-lg tracking-tight">Catalyst</h1>
              <p className="label-mono leading-none opacity-50">SaaS Strategy Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
              title="API Settings"
            >
              <Settings className="w-5 h-5 text-brand-muted group-hover:text-white transition-colors" />
            </button>
            <div className="hidden md:flex flex-col items-end">
              <span className="label-mono">System Load</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Optimal
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-32">
        {/* Input Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-sans font-bold tracking-tight mb-6"
          >
            Venture Discovery <br />
            <span className="text-muted italic font-medium">unlocked via intelligence.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted text-lg md:text-xl mb-12 max-w-xl mx-auto"
          >
            Identify profitable niche opportunities tailored for isolated development and rapid scaling.
          </motion.p>
          
          <form onSubmit={handleGenerate} className="relative group max-w-2xl mx-auto">
            <input
              id="interest-input"
              type="text"
              placeholder="e.g. Sustainable Commerce, HealthTech for Nomads"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              disabled={state.isLoading}
              className="input-saas w-full pr-24"
            />
            <button
              id="generate-button"
              type="submit"
              disabled={state.isLoading || !interest.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square btn-primary !p-0 !rounded-lg"
              title="Generate Ideas"
            >
              {state.isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['SaaS for Agencies', 'Automation for SMBs', 'AI Audio Tools'].map((tag) => (
              <button
                key={tag}
                onClick={() => setInterest(tag)}
                className="label-mono border border-border-subtle px-4 py-2 rounded-full hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        <AnimatePresence mode="wait">
          {state.isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center gap-6"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-white animate-spin opacity-20" />
                <BarChart3 className="absolute inset-0 m-auto w-6 h-6 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="label-mono animate-pulse">Running Market Simulations</p>
                <div className="h-[2px] w-32 bg-white/5 rounded-full mx-auto overflow-hidden">
                  <motion.div 
                    animate={{ x: [-128, 128] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="h-full w-1/2 bg-white/40" 
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {state.ideas.length > 0 ? (
                <>
                  <div className="flex items-end justify-between mb-12 border-b border-border-subtle pb-6">
                    <div>
                      <span className="label-mono mb-1 block">Analysis Output</span>
                      <h3 className="text-2xl font-bold font-sans">Strategic Hypotheses</h3>
                    </div>
                    <p className="text-right text-[11px] font-mono opacity-40 uppercase hidden sm:block">
                      Generated based on: <br />
                      <span className="text-white brightness-125">{interest}</span>
                    </p>
                  </div>
                  <div className="grid gap-10">
                    {state.ideas.map((idea, index) => (
                      <StartupIdeaCard key={idea.id} idea={idea} index={index} />
                    ))}
                  </div>
                </>
              ) : state.error ? (
                <div className="saas-card !border-red-500/30 bg-red-500/5 text-center py-12">
                  <p className="text-red-400 font-medium mb-2">Computational Error</p>
                  <p className="text-muted text-sm">{state.error}</p>
                </div>
              ) : (
                <div className="py-24 text-center opacity-30 select-none">
                  <Lightbulb className="w-12 h-12 mx-auto mb-6 opacity-20" />
                  <p className="label-mono">Awaiting primary input directive</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ApiKeyModal
          isOpen={isModalOpen}
          initialKey={apiKey || ''}
          onSave={saveApiKey}
          onClose={() => setIsModalOpen(false)}
        />
      </main>

      <footer className="border-t border-border-subtle py-16 mt-32 bg-bg-card/30">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold tracking-tight">Catalyst v1.0</span>
            </div>
            <p className="text-muted text-sm max-w-sm">
              An intelligent validation engine for independent founders. We prioritize unit economics and solo-operator feasibility in every synthesis.
            </p>
          </div>
          <div>
            <span className="label-mono mb-6 block">Capabilities</span>
            <ul className="text-sm space-y-3 font-medium opacity-80">
              <li className="hover:text-white transition-colors cursor-default">Market Mapping</li>
              <li className="hover:text-white transition-colors cursor-default">MVP Blueprinting</li>
              <li className="hover:text-white transition-colors cursor-default">Scale Invariants</li>
            </ul>
          </div>
          <div className="text-right">
            <span className="label-mono mb-6 block">Legal</span>
            <p className="text-[10px] font-mono opacity-30 uppercase tracking-widest leading-relaxed">
              Proprietary Engine <br />
              &copy; 2026 Independent Innovation <br />
              All Hypotheses Validated
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface ApiKeyModalProps {
  isOpen: boolean;
  initialKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

function ApiKeyModal({ isOpen, initialKey, onSave, onClose }: ApiKeyModalProps) {
  const [key, setKey] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) setKey(initialKey);
  }, [isOpen, initialKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md saas-card !bg-bg-card p-8 space-y-8"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 border border-border-subtle rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">API Configuration</h3>
                <p className="text-muted text-sm mt-1">
                  Enter your Gemini API key to unlock the strategy engine. Your key is stored locally and never leaves your browser.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="input-saas w-full pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-brand-muted font-mono leading-relaxed">
                Need a key? Visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-white underline decoration-white/20 underline-offset-4 hover:decoration-white transition-all">Google AI Studio</a> console to generate one for free.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border border-border-subtle hover:bg-white/5 transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(key)}
                disabled={!key.trim()}
                className="flex-2 btn-primary !py-3 font-medium text-sm disabled:opacity-50"
              >
                Initialize Engine
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface IdeaCardProps {
  idea: StartupIdea;
  index: number;
  key?: string | number;
}

function StartupIdeaCard({ idea, index }: IdeaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="saas-card overflow-hidden group"
    >
      <div className="grid lg:grid-cols-[1.2fr,2fr] gap-0 -m-6 divide-x divide-border-subtle">
        {/* Left Aspect: Identity & Score */}
        <div className="p-8 lg:p-10 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs opacity-30">{(index + 1).toString().padStart(2, '0')}</span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>
            <h4 className="text-3xl font-bold tracking-tight group-hover:translate-x-1 transition-transform">
              {idea.title}
            </h4>
          </div>

          <div className="bg-bg-accent/50 rounded-xl p-6 border border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <span className="label-mono">Validation Index</span>
              <span className="text-xs font-bold">{idea.validationScore}/10</span>
            </div>
            <div className="flex gap-1.5">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 flex-1 rounded-full transition-all duration-700 ${
                    i < idea.validationScore 
                      ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                      : 'bg-white/5'
                  }`} 
                  style={{ transitionDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="label-mono flex items-center gap-2">
              <Target className="w-3 h-3" />
              Primary Segment
            </span>
            <p className="text-sm font-medium leading-relaxed">
              {idea.targetUsers}
            </p>
          </div>
        </div>

        {/* Right Aspect: Strategic Matrix */}
        <div className="p-8 lg:p-10 bg-bg-accent/20 grid md:grid-cols-2 gap-10">
          <CardDetail 
            icon={<Lightbulb className="w-4 h-4 text-brand-muted" />} 
            label="Problem Hypothesis" 
            content={idea.problem} 
          />
          <CardDetail 
            icon={<Wrench className="w-4 h-4 text-brand-muted" />} 
            label="MVP Blueprint" 
            content={idea.mvp} 
          />
          <CardDetail 
            icon={<DollarSign className="w-4 h-4 text-brand-muted" />} 
            label="Monetization Engine" 
            content={idea.monetization} 
          />
          <CardDetail 
            icon={<TrendingUp className="w-4 h-4 text-brand-muted" />} 
            label="Scalability Vector" 
            content={idea.scalability} 
          />
        </div>
      </div>
    </motion.div>
  );
}

function CardDetail({ icon, label, content }: { icon: ReactNode, label: string, content: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-md bg-white/5 border border-border-subtle group-hover:border-white/20 transition-all">
          {icon}
        </div>
        <span className="label-mono">{label}</span>
      </div>
      <p className="text-sm text-muted">
        {content}
      </p>
    </div>
  );
}

