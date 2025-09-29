import { useState } from "react";

interface SidebarToggleProps {
  onToggle: () => void;
  className?: string;
}

export default function SidebarToggle({ onToggle, className = "" }: SidebarToggleProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onToggle();
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-xl transition-all duration-200 hover:shadow-soft ${
        isPressed ? 'sidebar-toggle-pressed' : ''
      } ${className}`}
      style={{ 
        color: 'var(--color-text-secondary)',
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-neutral-300)',
        transform: isPressed ? 'scale(0.95)' : 'scale(1)'
      }}
      onMouseEnter={(e) => {
        if (!isPressed) {
          e.currentTarget.style.color = 'var(--color-text-primary)';
          e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
          e.currentTarget.style.borderColor = 'var(--color-neutral-400)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isPressed) {
          e.currentTarget.style.color = 'var(--color-text-secondary)';
          e.currentTarget.style.backgroundColor = 'var(--color-background)';
          e.currentTarget.style.borderColor = 'var(--color-neutral-300)';
        }
      }}
      title="Toggle sidebar (Cmd/Ctrl + B)"
      aria-label="Toggle sidebar"
    >
      <svg 
        className={`w-5 h-5 transition-transform duration-200 ${isPressed ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
