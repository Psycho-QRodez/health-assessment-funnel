"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import ProgressBar from "@/components/ui/ProgressBar";
import Tip from "@/components/ui/Tip";

type DetailStep = {
  key: string;
  step: number;
  title: string;
  subtitle?: string;
  tip?: string;
  placeholder: string;
  inputType: "number" | "text" | "email";
  suffix?: string;
};

const DETAIL_STEPS: DetailStep[] = [
  {
    key: "age",
    step: 12,
    title: "What is your age?",
    subtitle: "Age helps us estimate your daily energy needs more accurately.",
    tip: "Please enter your actual age for a more reliable assessment.",
    placeholder: "26",
    inputType: "number",
    suffix: "years",
  },
  {
    key: "height",
    step: 13,
    title: "What is your height?",
    subtitle: "We use height and weight to calculate your BMI.",
    placeholder: "170",
    inputType: "number",
    suffix: "cm",
  },
  {
    key: "weight",
    step: 14,
    title: "What is your current weight?",
    subtitle: "This helps us estimate your current health profile.",
    placeholder: "78",
    inputType: "number",
    suffix: "kg",
  },
  {
    key: "target_weight",
    step: 15,
    title: "What is your target weight?",
    subtitle:
      "If your goal is weight loss, your target weight should be lower than your current weight.",
    tip: "Your target should feel realistic and sustainable.",
    placeholder: "70",
    inputType: "number",
    suffix: "kg",
  },
  {
    key: "name",
    step: 16,
    title: "What should we call you?",
    subtitle: "We will use this to personalize your report.",
    placeholder: "Alex",
    inputType: "text",
  },
  {
    key: "email",
    step: 17,
    title: "Where should we send your plan?",
    subtitle: "Enter your email to continue to your personalized result.",
    tip: "Your report is generated instantly. No spam.",
    placeholder: "alex@example.com",
    inputType: "email",
  },
];

export default function DetailsPage() {
  const [sessionId, setSessionId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [currentValue, setCurrentValue] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentStep = DETAIL_STEPS[currentIndex];

  const totalDisplaySteps = 17;

  const progressCurrent = useMemo(() => {
    return currentStep.step;
  }, [currentStep.step]);

  useEffect(() => {
    const storedSessionId =
      window.localStorage.getItem("sessionId");

    if (!storedSessionId) {
      window.location.href = "/funnel";
      return;
    }

    setSessionId(storedSessionId);

    async function recover() {
      try {
        const response = await fetch(
          `/api/progress/recover?sessionId=${storedSessionId}`
        );

        const data = await response.json();

        if (data.success) {
          const formData = data.data.form_data || {};

          const nextValues: Record<string, string> = {};

          for (const step of DETAIL_STEPS) {
            if (formData[step.key] !== undefined) {
              nextValues[step.key] = String(formData[step.key]);
            }
          }

          setValues(nextValues);

          const currentDetailIndex =
            DETAIL_STEPS.findIndex(
              (step) => step.step === data.data.current_step
            );

          if (currentDetailIndex >= 0) {
            setCurrentIndex(currentDetailIndex);
          }
        }
      } catch {
        setError("Unable to recover your progress.");
      }
    }

    recover();
  }, []);

  useEffect(() => {
    setCurrentValue(values[currentStep.key] || "");
    setError("");
  }, [currentStep.key, values]);

  function normalizeValue() {
    if (currentStep.inputType === "number") {
      return Number(currentValue);
    }

    return currentValue.trim();
  }

  function validateClientSide() {
    if (!currentValue.trim()) {
      return "Please enter a value to continue.";
    }

    if (currentStep.inputType === "number") {
      const numericValue = Number(currentValue);

      if (Number.isNaN(numericValue)) {
        return "Please enter a valid number.";
      }
    }

    if (
      currentStep.inputType === "email" &&
      !currentValue.includes("@")
    ) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  async function saveCurrentStep() {
    const clientError = validateClientSide();

    if (clientError) {
      setError(clientError);
      return false;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/progress/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          questionKey: currentStep.key,
          answerValue: normalizeValue(),
          currentStep: currentStep.step,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error("Save failed");
      }

      setValues((prev) => ({
        ...prev,
        [currentStep.key]: currentValue,
      }));

      return true;
    } catch {
      setError("Unable to save this answer. Please check your input.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function goNext() {
    const saved = await saveCurrentStep();

    if (!saved) return;

    if (currentIndex < DETAIL_STEPS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    await generateResult();
  }

  function goBack() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return;
    }

    window.location.href = "/funnel";
  }

  async function generateResult() {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/results/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Unable to generate result.");
        return;
      }

      window.location.href = "/result";
    } catch {
      setError("Unable to generate your result. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="page">
      <div className="shell question-page">
        <ProgressBar
          current={progressCurrent}
          total={totalDisplaySteps}
        />

        <section className="center-question detail-question">
          <h2>{currentStep.title}</h2>

          {currentStep.subtitle && (
            <p>{currentStep.subtitle}</p>
          )}

          <div className="input-with-suffix">
            <InputField
              value={currentValue}
              onChange={setCurrentValue}
              placeholder={currentStep.placeholder}
              type={currentStep.inputType}
            />

            {currentStep.suffix && (
              <span>{currentStep.suffix}</span>
            )}
          </div>

          {currentStep.tip && (
            <Tip>{currentStep.tip}</Tip>
          )}

          {error && (
            <p className="form-error">{error}</p>
          )}

          <div className="question-actions">
            <Button variant="ghost" onClick={goBack}>
              Back
            </Button>

            <Button
              onClick={goNext}
              disabled={isSaving || isGenerating}
            >
              {currentIndex === DETAIL_STEPS.length - 1
                ? isGenerating
                  ? "Generating..."
                  : "See My Result"
                : "Next"}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}