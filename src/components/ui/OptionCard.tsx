type OptionCardProps = {
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
};

export default function OptionCard({
  label,
  description,
  selected = false,
  onClick,
}: OptionCardProps) {
  return (
    <button
      className={
        selected
          ? "option option-selected"
          : "option"
      }
      onClick={onClick}
    >
      <span>{label}</span>
      {description && <small>{description}</small>}
    </button>
  );
}