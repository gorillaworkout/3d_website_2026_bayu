'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
  trigger?: 'hover' | 'mount';
  revealDirection?: 'start' | 'end';
  encryptedClassName?: string;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function DecryptedText({
  text,
  speed = 50,
  className = '',
  trigger = 'mount',
  revealDirection = 'start',
  encryptedClassName = '',
}: DecryptedTextProps) {
  const [display, setDisplay] = useState(text);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [hasDecrypted, setHasDecrypted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealedRef = useRef(0);

  const decrypt = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsDecrypting(true);
    revealedRef.current = 0;

    intervalRef.current = setInterval(() => {
      revealedRef.current++;
      const revealed = revealedRef.current;

      setDisplay(
        text
          .split('')
          .map((c, i) => {
            if (c === ' ') return ' ';
            const isRevealed =
              revealDirection === 'start' ? i < revealed : i >= text.length - revealed;
            if (isRevealed) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (revealed >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsDecrypting(false);
        setHasDecrypted(true);
      }
    }, speed);
  }, [text, speed, revealDirection]);

  useEffect(() => {
    if (trigger === 'mount') {
      // Start with scrambled text
      setDisplay(
        text
          .split('')
          .map((c) => (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      );
      const timeout = setTimeout(decrypt, 500);
      return () => {
        clearTimeout(timeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, decrypt, text]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !isDecrypting) {
      decrypt();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsDecrypting(false);
      setHasDecrypted(false);
      setDisplay(
        text
          .split('')
          .map((c) => (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]))
          .join('')
      );
    }
  };

  return (
    <span
      className={`${className} ${!hasDecrypted && encryptedClassName ? encryptedClassName : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ fontFamily: 'inherit' }}
    >
      {display.split('').map((char, i) => (
        <span
          key={i}
          className={
            char !== text[i] && char !== ' '
              ? 'inline-block opacity-60 blur-[0.5px]'
              : 'inline-block'
          }
          style={{
            transition: 'all 0.1s ease',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
