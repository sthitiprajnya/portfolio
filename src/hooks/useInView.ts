import { useInView as useObserverInView, IntersectionOptions } from 'react-intersection-observer';

// Day 79: Explicitly expose rootMargin prop configuration handling
interface CustomIntersectionOptions extends IntersectionOptions {
  rootMargin?: string;
}

export function useInView(options?: CustomIntersectionOptions) {
  const { ref, inView } = useObserverInView({
    threshold: 0.12,
    triggerOnce: true,
    rootMargin: options?.rootMargin || '0px',
    ...options,
  });

  return { ref, isInView: inView, inView };
}
