import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CreateAIRuleModal } from '../components/modals/CreateAIRuleModal';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import { Sparkles, Plus, ArrowRight, Bot } from 'lucide-react';

export function RecommendationEnginePage() {
  const { showToast } = useApp();
  const [rules, setRules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRules() {
      setIsLoading(true);
      const data = await api.getRecommendationRules();
      setRules(data);
      setIsLoading(false);
    }
    loadRules();
  }, []);

  const handleAddRule = async (newRuleData) => {
    const created = await api.createRecommendationRule(newRuleData);
    setRules((prev) => [created, ...prev]);
    showToast(`Recommendation rule "${created.userState}" added!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> Today's Recommendation Engine
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Configure biometric & mood-based recommendation rules for personalized user daily flows.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="primary" icon={Plus} className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
            Create AI Rule
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 text-sm font-medium">
          Loading Recommendation Engine Rules...
        </div>
      ) : (
        /* Rules Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <Card key={rule.id || rule._id} gradientBorder>
              <CardHeader
                actions={
                  <Badge variant={rule.priority === 'Urgent High' ? 'rose' : rule.priority === 'High' ? 'amber' : 'indigo'}>
                    {rule.priority} Priority
                  </Badge>
                }
              >
                <CardTitle subtitle={`Rule Code: ${rule.id}`}>
                  {rule.userState}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Biometric Trigger Condition</span>
                  <p className="font-extrabold text-indigo-600 dark:text-indigo-400">{rule.triggerCondition}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recommended Flow Sequence</span>
                  <div className="space-y-1">
                    {rule.recommendedSequence && rule.recommendedSequence.map((seq, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{seq}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                  <span className="font-bold text-indigo-400 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" /> AI System Prompt Logic
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 italic">"{rule.aiPromptTemplate}"</p>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-400">
                  <span>Matched {rule.matchCount ? rule.matchCount.toLocaleString() : 0} times</span>
                  <Badge variant="emerald" size="sm">Rule Active</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Rule Modal */}
      <CreateAIRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRule={handleAddRule}
      />
    </div>
  );
}
