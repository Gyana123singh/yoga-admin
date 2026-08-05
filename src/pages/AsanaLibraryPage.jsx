import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CreateAsanaModal } from '../components/modals/CreateAsanaModal';
import { useApp } from '../context/AppContext';
import { api, BACKEND_URL } from '../services/api';
import { Dumbbell, Plus, Eye, Box, AlertTriangle } from 'lucide-react';

export function AsanaLibraryPage() {
  const { showToast } = useApp();
  const [asanas, setAsanas] = useState([]);
  const [selectedPose, setSelectedPose] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAsanas() {
      setIsLoading(true);
      const data = await api.getAsanas();
      setAsanas(data);
      setIsLoading(false);
    }
    fetchAsanas();
  }, []);

  const handleAddAsana = async (newPoseData) => {
    const created = await api.createAsana(newPoseData);
    setAsanas((prev) => [created, ...prev]);
    showToast(`Asana ${created.englishName} created successfully!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 shrink-0" /> Poses & Asanas Library
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Anatomical poses with Sanskrit taxonomy, contraindications, muscle activation, and 3D visualizers.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="primary" icon={Plus} className="w-full sm:w-auto" onClick={() => setIsCreateOpen(true)}>
            Add New Asana
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-slate-400 text-sm font-medium">
          Loading Asana Library...
        </div>
      ) : (
        /* Asanas Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {asanas.map((pose) => (
            <Card key={pose.id || pose._id} className="group overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={pose.imageUrl}
                    alt={pose.englishName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="indigo" size="sm">{pose.difficulty}</Badge>
                  </div>
                  {pose.pose3dAvailable && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-[10px] font-bold text-cyan-300">
                      <Box className="w-3 h-3" /> 3D Animated
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-semibold text-cyan-300 italic">{pose.sanskritName}</p>
                    <h3 className="text-lg font-extrabold text-white leading-snug">{pose.englishName}</h3>
                  </div>
                </div>

                <CardContent className="space-y-3 p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {pose.benefits}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {pose.targetMuscles && pose.targetMuscles.map((muscle, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              <div className="p-4 pt-0 border-t border-slate-200/40 dark:border-slate-800/60 mt-2">
                <Button
                  variant="glass"
                  size="sm"
                  className="w-full"
                  icon={Eye}
                  onClick={() => setSelectedPose(pose)}
                >
                  Inspect Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Inspect Pose Details Modal */}
      {selectedPose && (
        <Modal
          isOpen={!!selectedPose}
          onClose={() => setSelectedPose(null)}
          title={`${selectedPose.englishName} (${selectedPose.sanskritName})`}
          subtitle={`Category: ${selectedPose.category} • Level: ${selectedPose.difficulty}`}
        >
          <div className="space-y-4">
            <img src={selectedPose.imageUrl} alt={selectedPose.englishName} className="w-full h-56 object-cover rounded-2xl" />

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
              <span className="font-bold text-indigo-400">Therapeutic Benefits</span>
              <p className="text-slate-700 dark:text-slate-300">{selectedPose.benefits}</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
              <span className="font-bold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Contraindications & Cautions
              </span>
              <p className="text-slate-700 dark:text-slate-300">{selectedPose.contraindications}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Step-by-Step Sequence</span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {selectedPose.instructions && selectedPose.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Asana Modal */}
      <CreateAsanaModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddAsana={handleAddAsana}
      />
    </div>
  );
}
