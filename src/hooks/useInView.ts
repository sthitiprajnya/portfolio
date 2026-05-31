import { useInView as useObserverInView, IntersectionOptions } from 'react-intersection-observer';

export function useInView(options?: IntersectionOptions) {
  const { ref, inView } = useObserverInView({
    threshold: 0.12,
    triggerOnce: true,
    ...options,
  });

  return { ref, isInView: inView, inView };
}
