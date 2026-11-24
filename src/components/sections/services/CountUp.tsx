import { AnimatedValue } from '@/components/motion/AnimatedValue'

/** Counts from 0 to `value` once it scrolls into view (instantly for reduced motion). */
export function CountUp({ value, duration = 1800 }: { value: number; duration?: number }) {
  return <AnimatedValue value={value} duration={duration} />
}
