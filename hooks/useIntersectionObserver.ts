
import { useState, useEffect, RefObject } from 'react';

const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  { threshold = 0.9, root = null, rootMargin = '0%' }
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, root, rootMargin]);

  return isIntersecting;
};

export default useIntersectionObserver;
