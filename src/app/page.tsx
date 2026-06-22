"use client";

import Button from "@/components/ui/Button";
import Illustration from "@/components/ui/Illustration";

export default function Home() {
  function startDemo() {
    window.location.href = "/funnel";
  }

  return (
    <main className="page">
      <div className="shell hero">
        <section>
          <h1>
            VitaFlow
          </h1>

          <p className="hero-lede">
            Discover your health score, calorie target,
            and personalized roadmap based on your
            lifestyle and goals.
          </p>

          <div className="hero-actions">
            <Button onClick={startDemo}>
              Start My Assessment
            </Button>

            <Button variant="ghost">
              View Sample Result
            </Button>
          </div>

          <p className="tip">
            💡 Just 5 minutes to unlock your personalized health roadmap.
          </p>
        </section>

          <section className="hero-visual">
            <Illustration
              src="/images/hero.jpg"
              alt="VitaFlow health assessment illustration"
              label="Hero Illustration"
              size="large"
            />
          </section>
      </div>
    </main>
  );
}