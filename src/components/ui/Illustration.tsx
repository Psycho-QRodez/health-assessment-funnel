import Image from "next/image";

type IllustrationProps = {
  src?: string;
  alt: string;
  label?: string;
  size?: "default" | "small" | "large";
};

export default function Illustration({
  src,
  alt,
  label = "Illustration Placeholder",
  size = "default",
}: IllustrationProps) {
  if (!src) {
    return (
      <div className={`image-placeholder ${size}`}>
        {label}
      </div>
    );
  }

  return (
    <div className={`illustration ${size}`}>
      <Image
        src={src}
        alt={alt}
        width={520}
        height={520}
        priority={size === "large"}
      />
    </div>
  );
}