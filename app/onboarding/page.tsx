"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-form-hooks"; // Will use standard react hook form actually, I imported @hookform/resolvers and zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { onboardingSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

type FormData = z.infer<typeof onboardingSchema>;

const steps = [
  { id: "basics", title: "Basic Info" },
  { id: "body", title: "Body Metrics" },
  { id: "goals", title: "Goals & Lifestyle" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useReactHookForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      gender: "MALE",
      bodyType: "MESOMORPH",
      fitnessGoal: "HEALTHY_LIFESTYLE",
      activityLevel: "MODERATELY_ACTIVE",
      dietaryPreference: "OMNIVORE",
      sleepTime: "22:00",
      wakeTime: "06:00",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      toast({
        title: "Profile setup complete! 🎉",
        description: "Welcome to NutriHabit AI.",
        variant: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (currentStep === 0) fieldsToValidate = ["age", "gender"];
    if (currentStep === 1) fieldsToValidate = ["height", "weight", "bodyType"];

    const isStepValid = await form.trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Let&apos;s personalize your experience
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Setup Your Profile</h1>
          <p className="text-gray-400">
            NutriHabit AI needs some details to create your custom health plan.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, idx) => (
              <span
                key={step.id}
                className={`text-xs font-medium transition-colors ${
                  idx <= currentStep ? "text-emerald-400" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="glass-card p-6 md:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 25"
                      {...form.register("age", { valueAsNumber: true })}
                    />
                    {form.formState.errors.age && (
                      <p className="text-red-400 text-xs mt-1">
                        {form.formState.errors.age.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      id="gender"
                      {...form.register("gender")}
                      options={[
                        { value: "MALE", label: "Male" },
                        { value: "FEMALE", label: "Female" },
                        { value: "OTHER", label: "Other" },
                      ]}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="175"
                        {...form.register("height", { valueAsNumber: true })}
                      />
                      {form.formState.errors.height && (
                        <p className="text-red-400 text-xs mt-1">
                          {form.formState.errors.height.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        {...form.register("weight", { valueAsNumber: true })}
                      />
                      {form.formState.errors.weight && (
                        <p className="text-red-400 text-xs mt-1">
                          {form.formState.errors.weight.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Select
                      id="bodyType"
                      {...form.register("bodyType")}
                      options={[
                        { value: "ECTOMORPH", label: "Ectomorph (Lean, hard to gain weight)" },
                        { value: "MESOMORPH", label: "Mesomorph (Athletic, builds muscle easily)" },
                        { value: "ENDOMORPH", label: "Endomorph (Solid, higher body fat)" },
                      ]}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fitnessGoal">Primary Goal</Label>
                    <Select
                      id="fitnessGoal"
                      {...form.register("fitnessGoal")}
                      options={[
                        { value: "FAT_LOSS", label: "Fat Loss" },
                        { value: "MUSCLE_GAIN", label: "Muscle Gain" },
                        { value: "HEALTHY_LIFESTYLE", label: "Healthy Lifestyle" },
                        { value: "MAINTENANCE", label: "Maintenance" },
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select
                      id="activityLevel"
                      {...form.register("activityLevel")}
                      options={[
                        { value: "SEDENTARY", label: "Sedentary (Office job, no exercise)" },
                        { value: "LIGHTLY_ACTIVE", label: "Lightly Active (1-3 days/week)" },
                        { value: "MODERATELY_ACTIVE", label: "Moderately Active (3-5 days/week)" },
                        { value: "VERY_ACTIVE", label: "Very Active (6-7 days/week)" },
                      ]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dietaryPreference">Dietary Preference</Label>
                    <Select
                      id="dietaryPreference"
                      {...form.register("dietaryPreference")}
                      options={[
                        { value: "OMNIVORE", label: "No Restrictions" },
                        { value: "VEGETARIAN", label: "Vegetarian" },
                        { value: "VEGAN", label: "Vegan" },
                        { value: "KETO", label: "Keto" },
                        { value: "PALEO", label: "Paleo" },
                        { value: "GLUTEN_FREE", label: "Gluten Free" },
                        { value: "DAIRY_FREE", label: "Dairy Free" },
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sleepTime">Typical Bedtime</Label>
                      <Input id="sleepTime" type="time" {...form.register("sleepTime")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wakeTime">Typical Wake Time</Label>
                      <Input id="wakeTime" type="time" {...form.register("wakeTime")} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-6 border-t border-gray-800">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep} className="gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="gap-2 glow-emerald">
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Complete Setup
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
