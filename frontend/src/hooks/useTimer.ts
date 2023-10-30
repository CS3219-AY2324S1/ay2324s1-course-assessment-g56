import { useState, useRef, useEffect } from 'react';

const useTimer = (initialTime = 30) => {
  const [timer, setTimer] = useState(initialTime);
  const [start, setStart] = useState(false);
  const firstStart = useRef(true);
  const tick = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
      return undefined;
    }

    if (start) {
      tick.current = setInterval(() => {
        setTimer((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(tick.current);
    }

    return () => clearInterval(tick.current);
  }, [start]);

  const startTimer = () => {
    setStart(true);
  };

  const stopTimer = () => {
    setStart(false);
  };

  const resetTimer = () => {
    setStart(false);
    setTimer(initialTime);
  };

  return { timer, start, startTimer, stopTimer, resetTimer };
};

export default useTimer;
