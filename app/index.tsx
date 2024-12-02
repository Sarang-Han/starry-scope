import { Canvas } from '@react-three/fiber';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense, useRef, useEffect, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Asset } from 'expo-asset';
import { Object3D, MeshPhysicalMaterial } from 'three';
import { StarField } from '../components/StarField';  // StarField 컴포넌트 import

function VirgoModel() {
  const [modelUri, setModelUri] = useState<string | null>(null);
  const modelRef = useRef<Object3D>();

  useEffect(() => {
    async function loadModel() {
      try {
        const asset = Asset.fromModule(require('../assets/models/Virgo.glb'));
        await asset.downloadAsync();
        setModelUri(asset.localUri || asset.uri);
      } catch (error) {
        console.error('model error:', error);
      }
    }
    loadModel();
  }, []);

  const gltf = modelUri ? useLoader(GLTFLoader, modelUri) : null;

  useEffect(() => {
    if (gltf) {
      const glassMaterial = new MeshPhysicalMaterial({
        // 기본 재질 설정
        roughness: 0.5,           // 약간 더 매끄럽게
        transmission: 0.9,        // 투명도 증가
        thickness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        ior: 1.5,
        envMapIntensity: 1.4,     // 환경 반사 증가
        metalness: 0.4,           // 메탈릭 효과 증가
        transparent: true,
        opacity: 0.65,

        // 색상 설정
        color: '#ECE0F8',         // 기본 색상
        emissive: '#ECE0F8',      // 하이라이트 색상
        emissiveIntensity: 0.1,   
        attenuationColor: '#193d7c', 
        attenuationDistance: 0.3, 
      });

      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material = glassMaterial;
        }
      });
    }
  }, [gltf]);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.16;
    }
  });

  if (!gltf) return null;
  return <primitive ref={modelRef} object={gltf.scene} />;
}

export default function App() {
  return (
    <Canvas
      shadows
      camera={{ 
        position: [0, 1, 4],
        fov: 45 
      }}
      style={{ width: '100%', height: '100%', background: '#000514' }}
    >
      {/* 배경 스타필드 추가 */}
      <StarField />

      <ambientLight intensity={6.6} color="#ffffff" />
      
      <directionalLight
        position={[3, 8, 4]}
        intensity={3.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#ffffff"
      >
        <orthographicCamera 
          attach="shadow-camera"
          left={-10}
          right={10}
          top={10}
          bottom={-10}
        />
      </directionalLight>

      {/* 반사 효과를 위한 추가 조명 */}
      <pointLight
        position={[0, 2, 6]}
        intensity={3}
        color="#ffffff"
      />
      
      {/* 반짝임 효과를 위한 스포트라이트 */}
      <spotLight
        position={[-5, 5, 0]}
        intensity={2}
        angle={0.5}
        penumbra={1}
      />

      <Suspense fallback={null}>
        <VirgoModel />
        <OrbitControls 
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          target={[0, 0, 0]}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  );
}