"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { EventForm } from "@/components/events/event-form";
import { ParticipantInvite } from "@/components/events/participant-invite";
import { RuleBuilder } from "@/components/events/rule-builder";
import { EventSummaryPreview } from "@/components/events/event-summary-preview";
import { cn } from "@/lib/utils";
import type { Rule } from "@/types";
import Link from "next/link";

const steps = [
  { id: 1, name: "Details", description: "Basic event info" },
  { id: 2, name: "Invite", description: "Add participants" },
  { id: 3, name: "Rules", description: "Set spending rules" },
  { id: 4, name: "Review", description: "Confirm & create" },
];

interface Participant {
  id: string;
  email: string;
  name?: string;
  status: "pending" | "accepted";
}

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);

  const handleAddParticipant = (email: string) => {
    setParticipants([
      ...participants,
      { id: Date.now().toString(), email, status: "pending" },
    ]);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    // Redirect to event page
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return eventData.name && eventData.startDate && eventData.budget;
      case 2:
        return true; // Participants are optional
      case 3:
        return true; // Rules are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="font-semibold text-foreground">Create Event</h1>
            <p className="text-xs text-muted-foreground">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all",
                      currentStep === step.id
                        ? "gradient-primary text-white shadow-glow"
                        : currentStep > step.id
                          ? "bg-primary text-white"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center hidden md:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        currentStep >= step.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 md:w-24 lg:w-32 h-0.5 mx-2",
                      currentStep > step.id ? "gradient-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-32 max-w-2xl">
        {currentStep === 1 && (
          <EventForm data={eventData} onChange={setEventData} />
        )}
        {currentStep === 2 && (
          <ParticipantInvite
            participants={participants}
            onAdd={handleAddParticipant}
            onRemove={handleRemoveParticipant}
          />
        )}
        {currentStep === 3 && (
          <RuleBuilder rules={rules} onRulesChange={setRules} />
        )}
        {currentStep === 4 && (
          <EventSummaryPreview
            event={eventData}
            participants={participants}
            rules={rules}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-2xl">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              currentStep === 1
                ? "text-muted-foreground cursor-not-allowed"
                : "text-foreground hover:bg-secondary"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep === steps.length ? (
            <GradientButton
              onClick={handleCreate}
              loading={loading}
              disabled={!canProceed()}
            >
              Create Event
              <Check className="ml-2 w-4 h-4" />
            </GradientButton>
          ) : (
            <GradientButton onClick={handleNext} disabled={!canProceed()}>
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </GradientButton>
          )}
        </div>
      </div>
    </div>
  );
}
