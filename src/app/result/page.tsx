"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type ResultData = {
  bmi: number;
  healthScore: number;
  recommendedCalories: number;
  targetDate?: string;
  bmiCategory?: string;
  forecastCurve?: {
    week: number;
    weight: number;
  }[];
  recommendations?: string[];
  summary?: string;
};

function ForecastChart({
  data,
}: {
  data: { week: number; weight: number }[];
}) {
  if (!data || data.length === 0) return null;

  const width = 460;
  const height = 260;
  const padding = 42;

  const weights = data.map((item) => item.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  const points = data.map((item, index) => {
    const x =
      padding +
      (index / (data.length - 1)) *
        (width - padding * 2);

    const y =
      padding +
      ((maxWeight - item.weight) /
        (maxWeight - minWeight || 1)) *
        (height - padding * 2);

    return {
      x,
      y,
      ...item,
    };
  });

  const path = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`
    )
    .join(" ");

  const lastPoint = points[points.length - 1];

  const xLabels = points.filter(
    (_, index) =>
      index === 0 ||
      index === points.length - 1 ||
      index % 2 === 0
  );

  return (
    <div className="forecast-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="12 week weight forecast chart"
      >
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="rgba(14,49,13,0.24)"
          strokeWidth="1"
        />

        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(14,49,13,0.24)"
          strokeWidth="1"
        />

        <text
          x={8}
          y={padding + 4}
          fontSize="11"
          fill="var(--body)"
        >
          {maxWeight}kg
        </text>

        <text
          x={8}
          y={height - padding}
          fontSize="11"
          fill="var(--body)"
        >
          {minWeight}kg
        </text>

        {xLabels.map((point) => (
          <text
            key={`x-${point.week}`}
            x={point.x}
            y={height - 12}
            textAnchor="middle"
            fontSize="10"
            fill="var(--body)"
          >
            {point.week}
          </text>
        ))}

        <path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => (
          <circle
            key={point.week}
            cx={point.x}
            cy={point.y}
            r={point.week === lastPoint.week ? 7 : 4}
            fill={
              point.week === lastPoint.week
                ? "var(--tip)"
                : "var(--primary)"
            }
          />
        ))}

        <text
          x={lastPoint.x}
          y={lastPoint.y - 18}
          textAnchor="middle"
          className="forecast-complete"
        >
          ✓
        </text>
      </svg>

      <p className="forecast-caption">
        Week 0 → Week 12 estimated weight trend
      </p>
    </div>
  );
}

export default function ResultPage() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [premiumLocked, setPremiumLocked] = useState(true);
  const [message, setMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

  async function fetchResult() {
    const sessionId =
      window.localStorage.getItem("sessionId");

    if (!sessionId) {
      window.location.href = "/funnel";
      return;
    }

    try {
      const response = await fetch(
        `/api/results?sessionId=${sessionId}`
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Unable to load result.");
      }

      setResult(data.result);
      setPremiumLocked(data.premiumLocked);
      setMessage(data.message || "");
    } catch {
      setError("Unable to load your result.");
    }
  }

  useEffect(() => {
    fetchResult();
  }, []);

  async function unlockPlan() {
    const sessionId =
      window.localStorage.getItem("sessionId");

    if (!sessionId) return;

    setIsPaying(true);
    setError("");

    try {
      const response = await fetch("/api/pay", {
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
        throw new Error("Payment failed.");
      }

      await fetchResult();
    } catch {
      setError("Unable to unlock your plan. Please try again.");
    } finally {
      setIsPaying(false);
    }
  }

  if (!result) {
    return (
      <main className="page">
        <div className="shell center-question">
          <h2>Loading your result...</h2>
          {error && <p className="form-error">{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell result-page">
        <section className="result-hero">
          <p className="result-kicker">
            Your VitaFlow Result
          </p>

          <h1>
            Your personalized health roadmap is ready.
          </h1>

          <p>
            Based on your lifestyle, body profile, and goal, we created
            a tailored preview of your health plan.
          </p>
        </section>

        <section className="result-grid">
          <div className="result-stat">
            <span>Health Score</span>
            <strong>{result.healthScore}</strong>
          </div>

          <div className="result-stat">
            <span>BMI</span>
            <strong>{result.bmi}</strong>
            <small>{result.bmiCategory}</small>
          </div>

          <div className="result-stat">
            <span>Daily Calories</span>
            <strong>{result.recommendedCalories}</strong>
            <small>kcal target</small>
          </div>
        </section>

        {premiumLocked ? (
          <section className="pay-card result-paywall">
            <p className="result-kicker">
              Premium Locked
            </p>

            <h2>
              Unlock your 12-week personalized program
            </h2>

            <p>
              {message ||
                "Get your forecast curve, target timeline, and personalized recommendations."}
            </p>

            <ul className="pay-list">
              <li>✓ 12-week weight forecast</li>
              <li>✓ Personalized habit recommendations</li>
              <li>✓ Goal timeline and target date</li>
              <li>✓ Premium lifestyle roadmap</li>
            </ul>

            <Button onClick={unlockPlan} disabled={isPaying}>
              {isPaying
                ? "Unlocking..."
                : "Unlock My Plan"}
            </Button>

            {error && <p className="form-error">{error}</p>}
          </section>
        ) : (
          <section className="premium-result">
            <div className="result-card forecast-card">
                <div className="forecast-content">
                    <div className="forecast-summary">
                    <h2>12-Week Journey</h2>

                    <p>
                        Your plan is designed to move you from your current
                        weight toward your target in a sustainable way.
                    </p>

                    <div className="forecast-summary-grid">
                        <div>
                        <span>Start Weight</span>
                        <strong>
                            {result.forecastCurve?.[0]?.weight ?? "--"} kg
                        </strong>
                        </div>

                        <div>
                        <span>Target Weight</span>
                        <strong>
                            {result.forecastCurve?.[
                            result.forecastCurve.length - 1
                            ]?.weight ?? "--"} kg
                        </strong>
                        </div>

                        <div>
                        <span>Target Date</span>
                        <strong>{result.targetDate || "--"}</strong>
                        </div>
                    </div>
                    </div>

                    <ForecastChart data={result.forecastCurve || []} />
                </div>
                </div>

            <div className="result-card">
              <h2>Recommendations</h2>

              <ul className="recommendation-list">
                {result.recommendations?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}