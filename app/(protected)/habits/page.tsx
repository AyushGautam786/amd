"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Plus, Droplets, Moon, Dumbbell, Pizza, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const [logValue, setLogValue] = useState("");
  const { toast } = useToast();

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const json = await res.json();
      if (json.success) {
        setHabits(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch habits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabit || !logValue) return;

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId: selectedHabit.id,
          value: parseFloat(logValue),
        }),
      });

      if (!res.ok) throw new Error("Failed to log habit");

      toast({
        title: "Logged successfully",
        description: `Your ${selectedHabit.name.toLowerCase()} has been updated.`,
        variant: "success",
      });

      setIsLogDialogOpen(false);
      setLogValue("");
      fetchHabits();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log habit.",
        variant: "destructive",
      });
    }
  };

  const getHabitIcon = (type: string) => {
    switch (type) {
      case "WATER_INTAKE": return <Droplets className="w-5 h-5 text-blue-400" />;
      case "SLEEP": return <Moon className="w-5 h-5 text-purple-400" />;
      case "WORKOUT": return <Dumbbell className="w-5 h-5 text-emerald-400" />;
      case "JUNK_FOOD": return <Pizza className="w-5 h-5 text-red-400" />;
      case "MEAL_CONSISTENCY": return <Clock className="w-5 h-5 text-orange-400" />;
      default: return <Activity className="w-5 h-5 text-teal-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 skeleton rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Habits Tracker</h1>
        <p className="text-gray-400">Track your daily routines to build consistency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit, idx) => {
          const progress = Math.min((habit.logs?.[0]?.value || 0) / habit.target * 100, 100);
          const isComplete = progress >= 100;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={habit.id}
              className="glass-card p-6 relative overflow-hidden group"
            >
              {isComplete && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10 blur-xl" />
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                    {getHabitIcon(habit.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{habit.name}</h3>
                    <p className="text-xs text-gray-500">Target: {habit.target} {habit.unit}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-xs text-gray-400">Streak:</span>
                    <span className="font-bold text-emerald-400 fire-animation text-sm">{habit.streak}🔥</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-0.5">Best: {habit.bestStreak}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Today's Progress</span>
                  <span className="font-medium text-white">{habit.logs?.[0]?.value || 0} / {habit.target} {habit.unit}</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${isComplete ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-gradient-to-r from-emerald-500/50 to-teal-500'}`}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-800/60">
                <div className="flex gap-1">
                  {/* Last 7 days mock up dots */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i < habit.streak % 7 ? 'bg-emerald-400' : 'bg-gray-800'}`} />
                  ))}
                </div>
                
                <Button 
                  size="sm" 
                  variant={isComplete ? "outline" : "default"}
                  className={isComplete ? "text-emerald-400 border-emerald-500/30 gap-1.5" : "gap-1.5"}
                  onClick={() => {
                    setSelectedHabit(habit);
                    setLogValue(habit.logs?.[0]?.value?.toString() || "");
                    setIsLogDialogOpen(true);
                  }}
                >
                  {isComplete ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Updated</>
                  ) : (
                    <><Plus className="w-3.5 h-3.5" /> Log</>
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Log Dialog */}
      <DialogPrimitive.Root open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-800 bg-gray-950 p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl">
            <div className="flex flex-col space-y-1.5 mb-2">
              <DialogPrimitive.Title className="text-lg font-semibold text-white">
                Log {selectedHabit?.name}
              </DialogPrimitive.Title>
            </div>
            
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Value ({selectedHabit?.unit})</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={logValue} 
                    onChange={(e) => setLogValue(e.target.value)} 
                    className="text-lg"
                    required
                  />
                  {selectedHabit?.type === 'WATER_INTAKE' && (
                    <Button type="button" variant="outline" onClick={() => setLogValue((prev) => (parseFloat(prev||'0') + 1).toString())}>
                      +1
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsLogDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save
                </Button>
              </div>
            </form>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
