export default function LoadingSquares({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`grid grid-cols-3 gap-1.5 ${className}`}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-[2px] bg-[#5FA04E]"
          style={{
            animation: `node-load 1.4s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
