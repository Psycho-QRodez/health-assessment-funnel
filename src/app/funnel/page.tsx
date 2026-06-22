"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import OptionCard from "@/components/ui/OptionCard";
import Tip from "@/components/ui/Tip";
import Illustration from "@/components/ui/Illustration";

type QuestionType = "choice" | "promo";

type Question = {
  key: string;
  step: number;
  type: QuestionType;
  image?: string;
  title: string;
  subtitle?: string;
  tip?: string;
  layout?: "left" | "right" | "center";
  multiple?: boolean;
  options?: {
    label: string;
    value: string;
    description?: string;
  }[];
};

const QUESTIONS: Question[] = [
  {
    key: "gender",
    step: 1,
    type: "choice",
    title: "What is your gender?",
    subtitle: "This helps us personalize your health calculation.",
    layout: "center",
    options: [
      { label: "Female", value: "female" },
      { label: "Male", value: "male" },
    ],
  },
  {
    key: "goal",
    step: 2,
    type: "choice",
    title: "What is your main goal?",
    subtitle: "Choose the goal that best matches your current priority.",
    layout: "center",
    options: [
      { label: "Lose Weight", value: "lose_weight" },
      { label: "Maintain Weight", value: "maintain_weight" },
      { label: "Build Muscle", value: "build_muscle" },
      { label: "Improve Body Shape", value: "improve_body_shape" },
      {
        label: "Improve Flexibility & Mobility",
        value: "mobility",
        description: "Yoga, Pilates, stretching, and mobility-focused routines.",
      },
    ],
  },
  {
    key: "tip_sleep_diet",
    step: 3,
    type: "promo",
    title: "Small habits shape long-term results",
    subtitle:
      "Sleep, meal timing, stress, and daily movement all influence how your body responds to a health plan.",
    tip: "We use lifestyle signals to build a more realistic assessment.",
    image: "/images/promo.jpg",
  },
  {
    key: "sleep_duration",
    step: 3,
    type: "choice",
    title: "How long do you usually sleep?",
    subtitle: "Choose your average sleep duration on most nights.",
    tip: "Consistent sleep can improve recovery, appetite regulation, and energy.",
    layout: "right",
    image: "/images/sleep.jpg",
    options: [
      { label: "Less than 5 hours", value: "less_than_5" },
      { label: "5 - 6 hours", value: "5_6" },
      { label: "7 - 8 hours", value: "7_8" },
      { label: "More than 8 hours", value: "more_than_8" },
    ],
  },
  {
    key: "sleep_schedule",
    step: 4,
    type: "choice",
    title: "How regular is your sleep schedule?",
    subtitle:
      "Regular means your bedtime and wake-up time are mostly consistent across the week.",
    tip: "A stable sleep schedule helps your body maintain a predictable recovery rhythm.",
    layout: "left",
    image: "/images/sleep.jpg",
    options: [
      { label: "Regular", value: "regular" },
      { label: "Sometimes irregular", value: "sometimes_irregular" },
      { label: "Highly irregular", value: "highly_irregular" },
    ],
  },
  {
    key: "meal_regularity",
    step: 5,
    type: "choice",
    title: "How regular are your meals?",
    subtitle: "Regular means your meal times are mostly stable across the week.",
    tip: "Meal rhythm can affect energy, hunger control, and long-term adherence.",
    layout: "right",
    image: "/images/eating.jpg",
    options: [
      { label: "Regular", value: "regular" },
      { label: "Sometimes irregular", value: "sometimes_irregular" },
      { label: "Highly irregular", value: "highly_irregular" },
    ],
  },
  {
    key: "eating_habit",
    step: 6,
    type: "choice",
    title: "Which eating pattern sounds closest to you?",
    subtitle: "Choose the option that best describes your usual diet.",
    layout: "left",
    image: "/images/eating.jpg",
    options: [
      { label: "Mostly healthy and balanced", value: "mostly_healthy_balanced" },
      { label: "Generally balanced", value: "generally_balanced" },
      { label: "Frequent restaurant or takeout meals", value: "frequent_takeout" },
      { label: "High sugar, fat, or sodium", value: "high_sugar_high_fat" },
    ],
  },
  {
    key: "tip_activity",
    step: 7,
    type: "promo",
    title: "Your daily movement matters",
    subtitle:
      "Even if you do not work out often, your daily activity level can influence stiffness, energy, and progress.",
    tip: "We consider both exercise habits and everyday activity.",
    image: "/images/activity.jpg",
  },
  {
    key: "stress_level",
    step: 7,
    type: "choice",
    title: "How would you describe your stress level?",
    subtitle: "Stress can influence sleep, eating habits, and consistency.",
    layout: "right",
    image: "/images/activity.jpg",
    options: [
      { label: "Low", value: "low" },
      { label: "Moderate", value: "moderate" },
      { label: "High", value: "high" },
      { label: "Very high", value: "very_high" },
    ],
  },
  {
    key: "activity_level",
    step: 8,
    type: "choice",
    title: "How active is your daily life?",
    subtitle:
      "Think about your daily movement, walking, sitting time, and general energy.",
    tip: "This is about lifestyle activity, not only gym workouts.",
    layout: "left",
    image: "/images/activity.jpg",
    options: [
      { label: "Mostly sitting", value: "mostly_sitting" },
      { label: "Lightly active", value: "lightly_active" },
      { label: "Moderately active", value: "moderately_active" },
      { label: "Very active", value: "very_active" },
    ],
  },
  {
    key: "mobility_experience",
    step: 9,
    type: "choice",
    title: "What is your flexibility or mobility experience?",
    subtitle:
      "This includes yoga, Pilates, stretching, or mobility-focused routines.",
    layout: "right",
    image: "/images/mobility.jpg",
    options: [
      { label: "Never tried", value: "never_tried" },
      { label: "Beginner", value: "beginner" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
    ],
  },
  {
    key: "workout_type",
    step: 10,
    type: "choice",
    multiple: true,
    title: "What type of workout do you usually do?",
    subtitle: "Select all activities that apply to your current routine.",
    tip: "You can select more than one option.",
    layout: "left",
    image: "/images/workout.jpg",
    options: [
      { label: "No workout", value: "no_workout" },
      { label: "Strength training", value: "strength_training" },
      { label: "Cardio", value: "cardio" },
      { label: "Sports", value: "sports" },
      { label: "Mixed activities", value: "mixed_activities" },
      { label: "Yoga", value: "yoga" },
      { label: "Pilates", value: "pilates" },
      { label: "Stretching", value: "stretching" },
      { label: "Not sure yet", value: "not_sure_yet" },
    ],
  },
  {
    key: "workout_frequency",
    step: 11,
    type: "choice",
    title: "How often do you work out?",
    subtitle: "Pick the option closest to your current routine.",
    tip: "No fixed routine is completely fine. The plan should fit your real life.",
    layout: "right",
    image: "/images/workout.jpg",
    options: [
      { label: "Every day", value: "every_day" },
      { label: "3 - 5 times per week", value: "3_5_per_week" },
      { label: "1 - 2 times per week", value: "1_2_per_week" },
      { label: "A few times per month", value: "few_per_month" },
      { label: "No fixed routine", value: "no_fixed_routine" },
    ],
  },
];

export default function FunnelPage() {
  const [sessionId, setSessionId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isStarting, setIsStarting] = useState(true);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalSteps = 17;

  const progressStep = useMemo(() => {
    return currentQuestion.step;
  }, [currentQuestion.step]);

  useEffect(() => {
    const existingSessionId = window.localStorage.getItem("sessionId");

    if (existingSessionId) {
      setIsStarting(false);
      setShowResumeModal(true);
      return;
    }

    createNewSession();
  }, []);

  useEffect(() => {
    const savedValue = answers[currentQuestion.key];

    if (currentQuestion.multiple) {
      setSelectedValues(Array.isArray(savedValue) ? savedValue : []);
      setSelectedValue("");
      return;
    }

    if (typeof savedValue === "string") {
      setSelectedValue(savedValue);
    } else {
      setSelectedValue("");
    }

    setSelectedValues([]);
  }, [currentQuestion.key, currentQuestion.multiple, answers]);

  async function createNewSession() {
    try {
      setIsStarting(true);
      setError("");

      const response = await fetch("/api/session/start", {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to create session");
      }

      setSessionId(data.sessionId);
      setAnswers({});
      setCurrentIndex(0);

      window.localStorage.setItem("sessionId", data.sessionId);
    } catch {
      setError("Unable to start assessment. Please refresh the page.");
    } finally {
      setIsStarting(false);
      setShowResumeModal(false);
    }
  }

  async function recoverSession(existingSessionId: string) {
    try {
      setIsStarting(true);
      setError("");

      setSessionId(existingSessionId);

      const recoverResponse = await fetch(
        `/api/progress/recover?sessionId=${existingSessionId}`
      );

      const recoverData = await recoverResponse.json();

      if (recoverData.success) {
        setAnswers(recoverData.data.form_data || {});

        const recoveredStep = recoverData.data.current_step || 1;

        const recoveredIndex = QUESTIONS.findIndex(
          (question) =>
            question.type === "choice" && question.step === recoveredStep
        );

        if (recoveredIndex >= 0) {
          setCurrentIndex(recoveredIndex);
        }
      }
    } catch {
      setError("Unable to recover your assessment.");
    } finally {
      setIsStarting(false);
      setShowResumeModal(false);
    }
  }

  function handleContinueAssessment() {
    const existingSessionId = window.localStorage.getItem("sessionId");

    if (!existingSessionId) {
      createNewSession();
      return;
    }

    recoverSession(existingSessionId);
  }

  function handleStartOver() {
    window.localStorage.removeItem("sessionId");
    createNewSession();
  }

  async function saveAnswer(value: string | string[]) {
    if (!sessionId) {
      setError("Session is not ready yet.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/progress/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          questionKey: currentQuestion.key,
          answerValue: value,
          currentStep: currentQuestion.step,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Save failed");
      }

      setAnswers(data.formData || {});
    } catch {
      setError("Unable to save your answer. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function toggleMultiValue(value: string) {
    let nextValues: string[];

    if (value === "no_workout") {
      nextValues = selectedValues.includes("no_workout")
        ? []
        : ["no_workout"];
    } else {
      const valuesWithoutNoWorkout = selectedValues.filter(
        (item) => item !== "no_workout"
      );

      nextValues = valuesWithoutNoWorkout.includes(value)
        ? valuesWithoutNoWorkout.filter((item) => item !== value)
        : [...valuesWithoutNoWorkout, value];
    }

  setSelectedValues(nextValues);
  saveAnswer(nextValues);
}
  function selectSingleValue(value: string) {
    setSelectedValue(value);
    saveAnswer(value);
  }

    function goNext() {
    if (currentQuestion.type === "choice") {
        if (currentQuestion.multiple && selectedValues.length === 0) {
        setError("Please select at least one option to continue.");
        return;
        }

        if (!currentQuestion.multiple && !selectedValue) {
        setError("Please select one option to continue.");
        return;
        }
    }

    const shouldSkipWorkoutFrequency =
        currentQuestion.key === "workout_type" &&
        selectedValues.includes("no_workout");

    if (shouldSkipWorkoutFrequency) {
        window.location.href = "/funnel/details";
        return;
    }

    if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setError("");
    } else {
        window.location.href = "/funnel/details";
    }
    }

  function goBack() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setError("");
    }
  }

  if (isStarting) {
    return (
      <main className="page">
        <div className="shell center-question">
          <h2>Preparing your assessment...</h2>
          <p className="hero-lede">
            We are setting up your private session.
          </p>
        </div>
      </main>
    );
  }

  if (showResumeModal) {
    return (
      <main className="page">
        <div className="resume-modal-shell">
          <div className="pay-card resume-card">
            <p className="result-kicker">VitaFlow</p>

            <h2>Continue your assessment?</h2>

            <p>
              You have an unfinished assessment. Continue where you left off,
              or start a new assessment from the beginning.
            </p>

            <div className="resume-actions">
              <Button onClick={handleContinueAssessment}>
                Continue
              </Button>

              <Button variant="ghost" onClick={handleStartOver}>
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (currentQuestion.type === "promo") {
    return (
      <main className="page">
        <div className="shell question-page">
          <ProgressBar current={progressStep} total={totalSteps} />

          <section className="question-layout promo-layout">
            <Illustration
            src={currentQuestion.image}
            alt={currentQuestion.title}
            label="Promo Illustration"
            />

            <div className="question-copy">
              <h2>{currentQuestion.title}</h2>

              {currentQuestion.subtitle && <p>{currentQuestion.subtitle}</p>}

              {currentQuestion.tip && <Tip>{currentQuestion.tip}</Tip>}
            </div>
          </section>

          <div className="question-actions promo-actions">
            <Button onClick={goNext}>Continue</Button>
          </div>
        </div>
      </main>
    );
  }

  const isCenter = currentQuestion.layout === "center";

  const renderOptions = () => (
    <div className="options">
      {currentQuestion.options?.map((option) => {
        const selected = currentQuestion.multiple
          ? selectedValues.includes(option.value)
          : selectedValue === option.value;

        return (
          <OptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={selected}
            onClick={() =>
              currentQuestion.multiple
                ? toggleMultiValue(option.value)
                : selectSingleValue(option.value)
            }
          />
        );
      })}
    </div>
  );

  const renderActions = () => (
    <div className="question-actions">
      <Button variant="ghost" onClick={goBack}>
        Back
      </Button>

      <Button onClick={goNext} disabled={isSaving}>
        Next
      </Button>
    </div>
  );

  return (
    <main className="page">
      <div className="shell question-page">
        <ProgressBar current={progressStep} total={totalSteps} />

        {isCenter ? (
          <section className="center-question">
            <h2>{currentQuestion.title}</h2>

            {currentQuestion.subtitle && <p>{currentQuestion.subtitle}</p>}

            {renderOptions()}

            {currentQuestion.tip && <Tip>{currentQuestion.tip}</Tip>}

            {error && <p className="form-error">{error}</p>}

            {renderActions()}
          </section>
        ) : (
          <section
            className={
              currentQuestion.layout === "left"
                ? "question-layout reverse"
                : "question-layout"
            }
          >
            {currentQuestion.layout === "left" && (
                <Illustration
                    src={currentQuestion.image}
                    alt={currentQuestion.title}
                    label="Question Illustration"
                />
            )}

            <div className="question-copy">
              <h2>{currentQuestion.title}</h2>

              {currentQuestion.subtitle && <p>{currentQuestion.subtitle}</p>}

              {renderOptions()}

              {currentQuestion.tip && <Tip>{currentQuestion.tip}</Tip>}

              {error && <p className="form-error">{error}</p>}

              {renderActions()}
            </div>

            {currentQuestion.layout === "right" && (
                <Illustration
                    src={currentQuestion.image}
                    alt={currentQuestion.title}
                    label="Question Illustration"
                />
            )}
          </section>
        )}
      </div>
    </main>
  );
}