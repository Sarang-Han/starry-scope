import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Asset } from 'expo-asset';
import * as ExpoTHREE from 'expo-three';
import { THREE } from 'expo-three';
import { useFrame } from '@react-three/fiber/native';
import { Models, Dates } from '../../constants/zodiacData';
import { TextBox } from './TextBox';

interface ZodiacModelProps {
  name: keyof typeof Models;
  position: [number, number, number];
  rotation: [number, number, number];
  angle: number;
}

export const ZodiacModel: React.FC<ZodiacModelProps> = ({
  name,
  position,
  rotation
}) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const modelRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const scale = useRef(1);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const asset = Asset.fromModule(Models[name]);
        await asset.downloadAsync();
        const gltf = await ExpoTHREE.loadAsync(asset.uri);
        setModel(gltf.scene);
      } catch (error) {
        console.error(`Error loading model ${name}:`, error);
      }
    };

    loadModel();
  }, [name]);

  useFrame((state, delta) => {
    if (!modelRef.current) return;
    
    if (isHovered) {
      scale.current = THREE.MathUtils.lerp(scale.current, 1.2, 0.1);
    } else {
      scale.current = THREE.MathUtils.lerp(scale.current, 1, 0.1);
    }
    
    modelRef.current.scale.setScalar(scale.current);
  });

  if (!model) return null;

  return (
    <>
      <primitive
        ref={modelRef}
        object={model}
        position={position}
        rotation={rotation}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={() => setIsClicked(!isClicked)}
      />
      {isClicked && (
        <TextBox 
          position={[position[0], position[1] + 2, position[2]]}
          text={`${name} ${Dates[name]}`}
          onClose={() => setIsClicked(false)}
        />
      )}
    </>
  );
};

// 스타일 확장
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000514',
  },
  button: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
  },
  textBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: 200,
    alignItems: 'center',
  },
  textBoxContent: {
    textAlign: 'center',
  },
  zodiacLabel: {
    alignItems: 'center',
  },
  zodiacName: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  zodiacDate: {
    color: 'white',
    fontSize: 13,
    marginTop: 2,
    minWidth: 120,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});