// src/components/zodiac/TextBox.tsx
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber/native';

interface TextBoxProps {
  position: [number, number, number];
  text: string;
  onClose?: () => void;
}

export const TextBox: React.FC<TextBoxProps> = ({ 
  position,
  text,
  onClose 
}) => {
  const { camera, size } = useThree();
  const vec = new Vector3(...position);
  
  // 3D 위치를 2D 스크린 좌표로 변환
  vec.project(camera);
  const x = (vec.x + 1) * size.width / 2;
  const y = (-vec.y + 1) * size.height / 2;

  return (
    <View style={[
      styles.container,
      {
        position: 'absolute',
        left: x - styles.container.width / 2,
        top: y - styles.container.height,
        transform: [{ scale: camera.position.z < 10 ? 1 : 10 / camera.position.z }]
      }
    ]}>
      <View style={styles.textBox}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 80,
    zIndex: 1000,
  },
  textBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#000514',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  }
});