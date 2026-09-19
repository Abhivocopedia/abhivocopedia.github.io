import styles from './DecorativeMarks.module.css';

interface StarProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'mustard' | 'orange' | 'green' | 'teal' | 'coral' | 'ink' | 'warm-white';
  className?: string;
  style?: React.CSSProperties;
}

export function Star({ size = 'md', color = 'mustard', className, style }: StarProps) {
  return (
    <span
      className={`${styles.star} ${styles[size]} ${styles[color]} ${className || ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}

interface DecorativeCornerProps {
  position: 'tl' | 'tr' | 'bl' | 'br';
  color?: 'ink' | 'mustard' | 'warm-white';
  className?: string;
  style?: React.CSSProperties;
}

export function DecorativeCorner({ position, color = 'ink', className, style }: DecorativeCornerProps) {
  const colorClass = color === 'mustard' ? styles.accent : color === 'warm-white' ? styles.warmWhite : '';
  return (
    <span
      className={`${styles.decorativeCorner} ${styles[position]} ${colorClass} ${className || ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}

interface CrosshairProps {
  color?: 'ink' | 'mustard' | 'orange' | 'green' | 'teal';
  className?: string;
  style?: React.CSSProperties;
}

export function Crosshair({ color = 'ink', className, style }: CrosshairProps) {
  const colorClass = color === 'mustard' ? styles.accent : color === 'orange' ? styles.orange : color === 'green' ? styles.green : color === 'teal' ? styles.teal : '';
  return (
    <span
      className={`${styles.crosshair} ${colorClass} ${className || ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}

interface LabelProps {
  children: React.ReactNode;
  variant?: 'default' | 'number' | 'meta';
  className?: string;
  style?: React.CSSProperties;
}

export function Label({ children, variant = 'default', className, style }: LabelProps) {
  const variants: Record<string, string> = {
    default: styles.labelDefault,
    number: styles.labelNumber,
    meta: styles.labelMeta,
  };
  return (
    <span className={`${variants[variant]} ${className || ''}`} style={style}>{children}</span>
  );
}

interface ArrowProps {
  direction?: 'right' | 'left' | 'up' | 'down';
  size?: number;
  className?: string;
  color?: 'ink' | 'mustard' | 'orange' | 'green' | 'teal' | 'warm-white';
}

export function Arrow({ direction = 'right', size = 20, className, color = 'ink' }: ArrowProps) {
  const rotations: Record<string, string> = {
    right: '0deg',
    left: '180deg',
    up: '-90deg',
    down: '90deg',
  };

  return (
    <svg
      className={`${styles.arrow} ${className || ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${rotations[direction]})`, color: `var(--${color})` }}
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

interface StickerProps {
  children: React.ReactNode;
  variant?: 'mustard' | 'green' | 'teal' | 'orange' | 'ink' | 'coral';
  className?: string;
}

export function Sticker({ children, variant = 'mustard', className }: StickerProps) {
  return (
    <span className={`${styles.sticker} ${styles[variant]} ${className || ''}`}>
      {children}
    </span>
  );
}

interface DotPatternProps {
  color?: 'ink' | 'mustard' | 'warm-white';
  className?: string;
}

export function DotPattern({ color = 'ink', className }: DotPatternProps) {
  const colorClass = color === 'mustard' ? styles.accent : color === 'warm-white' ? styles.warmWhite : '';
  return (
    <div
      className={`${styles.dotPattern} ${colorClass} ${className || ''}`}
      aria-hidden="true"
    />
  );
}

interface HalftonePatternProps {
  color?: 'ink' | 'mustard';
  className?: string;
}

export function HalftonePattern({ color = 'ink', className }: HalftonePatternProps) {
  return (
    <div
      className={`${styles.halftonePattern} ${color === 'mustard' ? styles.accent : ''} ${className || ''}`}
      aria-hidden="true"
    />
  );
}

interface OrganicShapeProps {
  variant?: 1 | 2 | 3;
  className?: string;
  style?: React.CSSProperties;
}

export function OrganicShape({ variant = 1, className, style }: OrganicShapeProps) {
  return (
    <span
      className={`${styles.organicShape} ${styles[`shape${variant}`]} ${className || ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}