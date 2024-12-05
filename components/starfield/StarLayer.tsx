import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Points, PointsMaterial, BufferGeometry, Float32BufferAttribute } from 'three';

interface StarLayerProps {
  phase?: number;
}

export const StarLayer: React.FC<StarLayerProps> = ({ phase = 0 }) => {
    
    const NUM_STARS = 150; // Number of stars to render
    const pointsRef = useRef<Points>(null);
  
    // 별들의 초기 위치를 모델 주변으로 분포
    const positions = useMemo(() => {
      const arr = new Float32Array(NUM_STARS * 3);
      for (let i = 0; i < NUM_STARS * 3; i += 3) {
        // 구형 좌표계로 별들을 배치
        const radius = 5 + Math.random() * 15; // 5~20 사이의 반경
        const theta = Math.random() * Math.PI * 2; // 0~2π
        const phi = Math.random() * Math.PI; // 0~π
        
        // 구면 좌표를 직교 좌표로 변환
        arr[i] = radius * Math.sin(phi) * Math.cos(theta);     // x
        arr[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
        arr[i + 2] = radius * Math.cos(phi);                   // z
      }
      return arr;
    }, []);
  
    const geometry = useMemo(() => {
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      return geometry;
    }, [positions]);
  
    useFrame((state) => {
      if (pointsRef.current) {
        // 제자리에서 천천히 회전
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
        
        const material = pointsRef.current.material as PointsMaterial;
        // 깜빡이는 효과
        material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.3;
      }
    });
  
    return (
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.05}          // 더 작은 별 크기
          sizeAttenuation={true}
          color={new Color('#ffffff').multiplyScalar(2)}  // 더 밝은 색상
          transparent={true}
          opacity={0.8}
          depthWrite={false}
        />
      </points>
    );
};