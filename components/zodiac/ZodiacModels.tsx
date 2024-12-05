// src/components/zodiac/ZodiacModels.tsx
import React from 'react';
import { ZodiacModel } from './ZodiacModel';

export default function ZodiacModels() {
    const zodiacSigns = Object.keys(ZodiacModels) as Array<keyof typeof ZodiacModels>;
  
    return (
      <>
        {zodiacSigns.map((sign, index) => (
          <ZodiacModel
            key={sign}
            name={sign}
            angle={index * 30}
            position={sign === 'Capricornus' ? [0, -1, 0] : [0, 0, 0]} // Capricornus만 y축으로 -1만큼 이동
            rotation={[0, 0, 0]}
          />
        ))}
      </>
    );
  }