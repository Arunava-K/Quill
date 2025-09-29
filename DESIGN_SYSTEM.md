# Quill App - Design System Documentation

## Overview
This design system defines the visual language and component standards for the Quill note-taking application, ensuring consistency and maintainability across all interfaces.

## Color Palette

### Primary Colors (Purple/Violet Theme)
```css
/* Primary - Main brand colors */
--color-primary-50: #f8f6ff;   /* Very light purple backgrounds */
--color-primary-100: #f0ebff;  /* Light purple backgrounds */
--color-primary-200: #e4d9ff;  /* Subtle purple accents */
--color-primary-300: #d1bbff;  /* Soft purple borders */
--color-primary-400: #b892ff;  /* Medium purple elements */
--color-primary-500: #9d66ff;  /* Main brand color */
--color-primary-600: #8b3dff;  /* Hover states */
--color-primary-700: #7c2ae8;  /* Active states */
--color-primary-800: #6a23c4;  /* Dark purple text */
--color-primary-900: #581ea1;  /* Darkest purple */
```

### Secondary Colors (Warm Orange)
```css
/* Secondary - Accent and highlight colors */
--color-secondary-50: #fef7f0;
--color-secondary-100: #fdeee0;
--color-secondary-200: #fad9c1;
--color-secondary-300: #f6be96;
--color-secondary-400: #f19869;
--color-secondary-500: #ed7847;  /* Secondary brand color */
--color-secondary-600: #de5f33;
--color-secondary-700: #b84a2a;
--color-secondary-800: #933d28;
--color-secondary-900: #773424;
```

### Accent Colors (Teal/Turquoise)
```css
/* Accent - Success states and special highlights */
--color-accent-50: #f0fdf9;
--color-accent-100: #ccfbef;
--color-accent-200: #99f6e0;
--color-accent-300: #5eead4;
--color-accent-400: #2dd4bf;
--color-accent-500: #14b8a6;   /* Main accent color */
--color-accent-600: #0d9488;
--color-accent-700: #0f766e;
--color-accent-800: #115e59;
--color-accent-900: #134e4a;
```

### Neutral Colors (Grays)
```css
/* Neutral - Text, borders, backgrounds */
--color-neutral-50: #fafafa;   /* Lightest backgrounds */
--color-neutral-100: #f5f5f5;  /* Light backgrounds */
--color-neutral-200: #e5e5e5;  /* Subtle borders */
--color-neutral-300: #d4d4d4;  /* Light borders */
--color-neutral-400: #a3a3a3;  /* Placeholder text */
--color-neutral-500: #737373;  /* Secondary text */
--color-neutral-600: #525252;  /* Body text */
--color-neutral-700: #404040;  /* Headings */
--color-neutral-800: #262626;  /* Dark text */
--color-neutral-900: #171717;  /* Darkest text */
```

### Semantic Colors
```css
/* Status and feedback colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;

/* Background variants */
--color-success-bg: #ecfdf5;
--color-warning-bg: #fffbeb;
--color-error-bg: #fef2f2;
--color-info-bg: #eff6ff;
```

## Typography

### Font Family
```css
--font-family-sans: 'Inter', system-ui, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes & Line Heights
```css
/* Text sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Scale
```css
/* Headings */
.text-h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-h2 { font-size: var(--text-3xl); font-weight: var(--font-bold); line-height: var(--leading-tight); }
.text-h3 { font-size: var(--text-2xl); font-weight: var(--font-semibold); line-height: var(--leading-tight); }
.text-h4 { font-size: var(--text-xl); font-weight: var(--font-semibold); line-height: var(--leading-normal); }

/* Body text */
.text-body-lg { font-size: var(--text-lg); line-height: var(--leading-relaxed); }
.text-body { font-size: var(--text-base); line-height: var(--leading-normal); }
.text-body-sm { font-size: var(--text-sm); line-height: var(--leading-normal); }

/* Utility text */
.text-caption { font-size: var(--text-xs); line-height: var(--leading-normal); color: var(--color-neutral-500); }
.text-label { font-size: var(--text-sm); font-weight: var(--font-medium); }
```

## Spacing System

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Layout Spacing
```css
/* Component spacing */
--spacing-component-xs: var(--space-2);  /* 8px */
--spacing-component-sm: var(--space-3);  /* 12px */
--spacing-component-md: var(--space-4);  /* 16px */
--spacing-component-lg: var(--space-6);  /* 24px */
--spacing-component-xl: var(--space-8);  /* 32px */

/* Section spacing */
--spacing-section-sm: var(--space-8);    /* 32px */
--spacing-section-md: var(--space-12);   /* 48px */
--spacing-section-lg: var(--space-16);   /* 64px */
--spacing-section-xl: var(--space-20);   /* 80px */
```

## Border Radius

### Radius Scale
```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Full circle */
```

### Component Radius
```css
/* Specific component radius */
--radius-button: var(--radius-xl);      /* 12px */
--radius-card: var(--radius-2xl);       /* 16px */
--radius-input: var(--radius-lg);       /* 8px */
--radius-modal: var(--radius-2xl);      /* 16px */
--radius-badge: var(--radius-full);     /* Full pill */
```

## Shadows & Effects

### Shadow System
```css
/* Elevation shadows */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Soft shadows (current design) */
--shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
--shadow-medium: 0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-large: 0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```

### Glass Effects
```css
/* Glassmorphism effects */
.glass-light {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-medium {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
```

## Component Specifications

### 1. Navigation Sidebar
```css
/* Dimensions */
width: 280px;
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px);
border-right: 1px solid var(--color-primary-100);
box-shadow: var(--shadow-soft);

/* Sections */
.nav-section {
  padding: var(--spacing-component-lg);
  border-bottom: 1px solid var(--color-primary-100);
}

.nav-item {
  padding: var(--spacing-component-sm) var(--spacing-component-md);
  border-radius: var(--radius-xl);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--color-primary-50);
}

.nav-item.active {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}
```

### 2. Note Cards
```css
/* Card container */
.note-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-component-lg);
  box-shadow: var(--shadow-soft);
  transition: all 0.2s ease;
}

.note-card:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--color-primary-200);
  box-shadow: var(--shadow-medium);
  transform: translateY(-2px);
}

/* Card content */
.note-card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-800);
  margin-bottom: var(--spacing-component-sm);
}

.note-card-content {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--spacing-component-md);
}

.note-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}
```

### 3. Buttons
```css
/* Primary button */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  padding: var(--spacing-component-sm) var(--spacing-component-lg);
  border-radius: var(--radius-button);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-soft);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  box-shadow: var(--shadow-medium);
  transform: translateY(-1px);
}

/* Secondary button */
.btn-secondary {
  background: var(--color-neutral-100);
  color: var(--color-neutral-700);
  border: 1px solid var(--color-neutral-200);
}

.btn-secondary:hover {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-300);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--color-neutral-600);
  border: none;
}

.btn-ghost:hover {
  background: var(--color-neutral-100);
}
```

### 4. Tags
```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--spacing-component-sm);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: var(--radius-badge);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.tag-removable {
  padding-right: var(--space-1);
}

.tag-remove {
  margin-left: var(--space-1);
  color: var(--color-primary-500);
  cursor: pointer;
}
```

### 5. Input Fields
```css
.input {
  padding: var(--spacing-component-sm) var(--spacing-component-md);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-input);
  background: rgba(255, 255, 255, 0.8);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgba(157, 102, 255, 0.1);
}

.input::placeholder {
  color: var(--color-neutral-400);
}
```

## Layout Specifications

### Grid System
```css
/* Main layout grid */
.app-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
}

/* Content grid (3-column responsive) */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-component-lg);
  padding: var(--spacing-component-lg);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
  }
  
  .notes-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-component-md);
  }
}
```

### Animation Standards
```css
/* Transition timing */
--transition-fast: 0.15s ease;
--transition-normal: 0.2s ease;
--transition-slow: 0.3s ease;

/* Common animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animate-fade-in {
  animation: fadeIn var(--transition-normal);
}

.animate-slide-in {
  animation: slideIn var(--transition-normal);
}
```

## Accessibility Standards

### Focus States
```css
.focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 2px;
}
```

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 ratio)
- Interactive elements must have clear focus indicators
- Color should not be the only way to convey information

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order should be logical and intuitive
- Escape key should close modals and dropdowns

This design system ensures consistency, accessibility, and maintainability across the entire Quill application.
