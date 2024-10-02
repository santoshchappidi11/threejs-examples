import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

// Scooter component to load the 3D model and animate the tires
const Scooter = () => {
  const { scene, nodes } = useGLTF("/models/scooter.glb"); // Make sure the path is correct
  const scooterRef = useRef();

  // Find tire nodes
  const frontTire = nodes?.FrontTire;
  const backTire = nodes?.BackTire;

  // Animate tire rotation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (frontTire) frontTire.rotation.x = t * 2; // Adjust speed if needed
    if (backTire) backTire.rotation.x = t * 2;
  });

  return (
    <primitive
      ref={scooterRef}
      object={scene}
      scale={0.5} // Adjust scale if the model is too large or small
      position={[0, 0, 0]} // Adjust position to lift/lower the scooter as needed
      rotation={[0, 52, 0]} // Rotate around Y-axis to make it front-facing
      castShadow
      receiveShadow
    />
  );
};

const FlyingScooterScene = () => {
  return (
    <div className="h-full w-1/4">
      {" "}
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        {" "}
        {/* Adjust camera position */}
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {/* Ground plane */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        {/* Load scooter */}
        <Suspense fallback={null}>
          <Scooter />
        </Suspense>
        {/* Orbit controls to allow user interaction */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default FlyingScooterScene;
