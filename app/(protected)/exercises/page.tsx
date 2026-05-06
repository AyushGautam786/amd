"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Clock, Activity, Zap, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Select } from "@/components/ui/select";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [availableTime, setAvailableTime] = useState("30");
  const { toast } = useToast();

  const fetchExercises = async (time: string) => {
    try {
      setGenerating(true);
      const res = await fetch(`/api/exercises?time=${time}`);
      const json = await res.json();
      if (json.success) {
        setExercises(json.data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load exercises", variant: "destructive" });
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchExercises(availableTime);
  }, []);

  const handleGenerateNew = () => {
    fetchExercises(availableTime);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 skeleton rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-emerald-400" />
            Your AI Workout
          </h1>
          <p className="text-gray-400">Personalized workout plan based on your profile.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-32">
            <Select
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              options={[
                { value: "15", label: "15 mins" },
                { value: "30", label: "30 mins" },
                { value: "45", label: "45 mins" },
                { value: "60", label: "60 mins" },
              ]}
            />
          </div>
          <Button onClick={handleGenerateNew} disabled={generating} className="gap-2">
            {generating ? (
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Regenerate
          </Button>
        </div>
      </div>

      {exercises && (
        <>
          <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5">
            <h2 className="text-2xl font-bold text-white mb-2">{exercises.title}</h2>
            <p className="text-gray-300 mb-6">{exercises.description}</p>
            
            <div className="flex flex-wrap gap-4">
              <Badge variant="default" className="gap-2 px-3 py-1.5 bg-gray-900 text-gray-300">
                <Clock className="w-4 h-4 text-emerald-400" /> {exercises.totalDuration} mins
              </Badge>
              <Badge variant="default" className="gap-2 px-3 py-1.5 bg-gray-900 text-gray-300">
                <Activity className="w-4 h-4 text-emerald-400" /> {exercises.difficulty}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
              <div>
                <h4 className="text-sm font-semibold text-emerald-400 mb-2 uppercase tracking-wider">Warmup</h4>
                <p className="text-sm text-gray-300">{exercises.warmup}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-teal-400 mb-2 uppercase tracking-wider">Cooldown</h4>
                <p className="text-sm text-gray-300">{exercises.cooldown}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Exercises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.exercises.map((ex: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-5 hover:border-emerald-500/30 transition-colors relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform" />
                  <h4 className="text-lg font-bold text-white mb-3 pr-8">{ex.name}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {ex.sets && (
                      <div className="bg-gray-900/60 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Sets</p>
                        <p className="font-semibold text-white">{ex.sets}</p>
                      </div>
                    )}
                    {ex.reps && (
                      <div className="bg-gray-900/60 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Reps</p>
                        <p className="font-semibold text-white">{ex.reps}</p>
                      </div>
                    )}
                    {ex.duration && (
                      <div className="bg-gray-900/60 rounded-lg p-2 text-center col-span-2">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-semibold text-white">{ex.duration}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-3 border-t border-gray-800">
                    <p className="text-sm text-gray-400">
                      <span className="text-emerald-400 text-xs uppercase tracking-wider font-semibold block mb-1">How to:</span>
                      {ex.instructions}
                    </p>
                  </div>
                  
                  {ex.rest && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-800/50 rounded-lg px-3 py-2 w-fit">
                      <Clock className="w-3 h-3" /> Rest: {ex.rest}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
