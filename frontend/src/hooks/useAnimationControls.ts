import { useState, useEffect, useCallback, useRef } from 'react';

export interface AnimationState {
  isPlaying: boolean;
  speed: number; // 0.1 to 3.0
  currentTime: number; // 0 to 1
  direction: 'forward' | 'reverse' | 'pingpong';
  loop: boolean;
}

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: AnimationState['direction']) => void;
  setLoop: (loop: boolean) => void;
  scrubTo: (time: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
}

export interface UseAnimationControlsOptions {
  initialSpeed?: number;
  initialDirection?: AnimationState['direction'];
  initialLoop?: boolean;
  stepSize?: number;
  onTimeChange?: (time: number) => void;
}

export const useAnimationControls = (options: UseAnimationControlsOptions = {}) => {
  const {
    initialSpeed = 1.0,
    initialDirection = 'forward',
    initialLoop = true,
    stepSize = 0.05,
    onTimeChange,
  } = options;

  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    speed: initialSpeed,
    currentTime: 0,
    direction: initialDirection,
    loop: initialLoop,
  });

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1); // For pingpong mode

  const updateTime = useCallback((deltaTime: number) => {
    setAnimationState(prev => {
      let newTime = prev.currentTime;
      const timeStep = (deltaTime * prev.speed) / 5000; // 5 seconds for full cycle at speed 1.0

      switch (prev.direction) {
        case 'forward':
          newTime += timeStep;
          if (newTime >= 1) {
            newTime = prev.loop ? 0 : 1;
          }
          break;
        
        case 'reverse':
          newTime -= timeStep;
          if (newTime <= 0) {
            newTime = prev.loop ? 1 : 0;
          }
          break;
        
        case 'pingpong':
          newTime += timeStep * directionRef.current;
          if (newTime >= 1) {
            newTime = 1;
            directionRef.current = -1;
          } else if (newTime <= 0) {
            newTime = 0;
            directionRef.current = 1;
          }
          break;
      }

      // Stop animation if we've reached the end and not looping
      const shouldStop = !prev.loop && (
        (prev.direction === 'forward' && newTime >= 1) ||
        (prev.direction === 'reverse' && newTime <= 0)
      );

      if (shouldStop) {
        return { ...prev, currentTime: newTime, isPlaying: false };
      }

      return { ...prev, currentTime: newTime };
    });
  }, []);

  const animate = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    updateTime(deltaTime);

    if (animationState.isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animationState.isPlaying, updateTime]);

  useEffect(() => {
    if (animationState.isPlaying) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationState.isPlaying, animate]);

  // Notify parent of time changes
  useEffect(() => {
    if (onTimeChange) {
      onTimeChange(animationState.currentTime);
    }
  }, [animationState.currentTime, onTimeChange]);

  const controls: AnimationControls = {
    play: () => setAnimationState(prev => ({ ...prev, isPlaying: true })),
    
    pause: () => setAnimationState(prev => ({ ...prev, isPlaying: false })),
    
    stop: () => setAnimationState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentTime: prev.direction === 'reverse' ? 1 : 0 
    })),
    
    setSpeed: (speed: number) => setAnimationState(prev => ({ 
      ...prev, 
      speed: Math.max(0.1, Math.min(3.0, speed)) 
    })),
    
    setDirection: (direction: AnimationState['direction']) => {
      setAnimationState(prev => ({ ...prev, direction }));
      // Reset pingpong direction
      if (direction === 'pingpong') {
        directionRef.current = 1;
      }
    },
    
    setLoop: (loop: boolean) => setAnimationState(prev => ({ ...prev, loop })),
    
    scrubTo: (time: number) => setAnimationState(prev => ({ 
      ...prev, 
      currentTime: Math.max(0, Math.min(1, time)) 
    })),
    
    stepForward: () => setAnimationState(prev => ({ 
      ...prev, 
      currentTime: Math.min(1, prev.currentTime + stepSize) 
    })),
    
    stepBackward: () => setAnimationState(prev => ({ 
      ...prev, 
      currentTime: Math.max(0, prev.currentTime - stepSize) 
    })),
  };

  return {
    animationState,
    controls,
  };
};