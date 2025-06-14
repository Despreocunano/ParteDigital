interface DividerProps {
  className?: string;
}

export function Divider({ className = '' }: DividerProps) {
  return (
    <div className={`w-24 h-1 bg-gradient-to-r from-[#F8BBD9] to-[#FCE4EC] mx-auto ${className}`} />
  );
} 