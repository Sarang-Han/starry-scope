import React from 'react';
import { StarLayer } from './StarLayer';

const NUM_LAYERS = 10;

export const StarField: React.FC = () => {
  return (
    <>
      {Array(NUM_LAYERS).fill(0).map((_, idx) => (
        <StarLayer key={idx} phase={idx / NUM_LAYERS} />
      ))}
    </>
  );
};