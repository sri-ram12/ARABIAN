'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// SSR-safe dynamic import for the intro
const FireIntro = dynamic(() => import('./FireIntro'), { ssr: false });

export default function FireIntroWrapper() {
  // Always starts as true so whenever the user refreshes or enters the website, the intro plays immediately!
  const [show, setShow] = useState(true);

  const handleComplete = () => {
    setShow(false);
  };

  if (!show) return null;
  return <FireIntro onComplete={handleComplete} />;
}
