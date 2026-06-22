type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>Lifestyle Assessment</span>
        <span>
          {current}/{total}
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}