import { useEffect, useCallback, useRef, useState } from "react";

export interface TouchGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onTap?: (x: number, y: number) => void;
}

export interface UseTouchGesturesOptions {
  swipeThreshold?: number;
  pinchThreshold?: number;
  doubleTapDelay?: number;
  longPressDelay?: number;
  enabled?: boolean;
}

export const useTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  handlers: TouchGestureHandlers,
  options: UseTouchGesturesOptions = {}
) => {
  const {
    swipeThreshold = 50,
    pinchThreshold = 0.1,
    doubleTapDelay = 300,
    longPressDelay = 500,
    enabled = true,
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const lastTapRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);
  const [isGesturing, setIsGesturing] = useState(false);

  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!enabled) return;

      const touch = event.touches[0];
      const now = Date.now();

      if (event.touches.length === 1) {
        // Single touch
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: now,
        };

        // Start long press timer
        if (handlers.onLongPress) {
          longPressTimerRef.current = setTimeout(() => {
            handlers.onLongPress!();
            setIsGesturing(true);
          }, longPressDelay);
        }
      } else if (event.touches.length === 2) {
        // Pinch gesture start
        const distance = getDistance(event.touches[0], event.touches[1]);
        initialPinchDistanceRef.current = distance;
        setIsGesturing(true);

        // Clear long press timer
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }
    },
    [enabled, handlers.onLongPress, longPressDelay, getDistance]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!enabled) return;

      if (
        event.touches.length === 2 &&
        initialPinchDistanceRef.current &&
        handlers.onPinch
      ) {
        // Pinch gesture
        const currentDistance = getDistance(event.touches[0], event.touches[1]);
        const scale = currentDistance / initialPinchDistanceRef.current;

        if (Math.abs(scale - 1) > pinchThreshold) {
          handlers.onPinch(scale);
        }
      } else if (event.touches.length === 1 && touchStartRef.current) {
        // Clear long press timer on move
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }
    },
    [enabled, handlers.onPinch, getDistance, pinchThreshold]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!enabled) return;

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (event.touches.length === 0 && touchStartRef.current && !isGesturing) {
        const touch = event.changedTouches[0];
        const now = Date.now();
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = now - touchStartRef.current.time;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 10 && deltaTime < 200) {
          // Tap gesture
          const lastTap = lastTapRef.current;

          if (
            lastTap &&
            now - lastTap.time < doubleTapDelay &&
            Math.abs(touch.clientX - lastTap.x) < 50 &&
            Math.abs(touch.clientY - lastTap.y) < 50
          ) {
            // Double tap
            if (handlers.onDoubleTap) {
              handlers.onDoubleTap();
            }
            lastTapRef.current = null;
          } else {
            // Single tap
            if (handlers.onTap) {
              handlers.onTap(touch.clientX, touch.clientY);
            }
            lastTapRef.current = {
              x: touch.clientX,
              y: touch.clientY,
              time: now,
            };
          }
        } else if (distance > swipeThreshold) {
          // Swipe gesture
          const absX = Math.abs(deltaX);
          const absY = Math.abs(deltaY);

          if (absX > absY) {
            // Horizontal swipe
            if (deltaX > 0 && handlers.onSwipeRight) {
              handlers.onSwipeRight();
            } else if (deltaX < 0 && handlers.onSwipeLeft) {
              handlers.onSwipeLeft();
            }
          } else {
            // Vertical swipe
            if (deltaY > 0 && handlers.onSwipeDown) {
              handlers.onSwipeDown();
            } else if (deltaY < 0 && handlers.onSwipeUp) {
              handlers.onSwipeUp();
            }
          }
        }
      }

      // Reset state
      if (event.touches.length === 0) {
        touchStartRef.current = null;
        initialPinchDistanceRef.current = null;
        setIsGesturing(false);
      }
    },
    [
      enabled,
      isGesturing,
      swipeThreshold,
      doubleTapDelay,
      handlers.onSwipeLeft,
      handlers.onSwipeRight,
      handlers.onSwipeUp,
      handlers.onSwipeDown,
      handlers.onDoubleTap,
      handlers.onTap,
    ]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, enabled]);

  return {
    isGesturing,
  };
};
