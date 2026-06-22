type TipProps = {
  children: React.ReactNode;
};

export default function Tip({ children }: TipProps) {
  return (
    <p className="tip">
      💡 {children}
    </p>
  );
}