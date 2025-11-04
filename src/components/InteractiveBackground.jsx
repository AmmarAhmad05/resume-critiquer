import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const waves = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize waves
    const initWaves = () => {
      waves.current = [];
      for (let i = 0; i < 8; i++) {
        waves.current.push({
          y: Math.random() * canvas.height,
          speed: 0.5 + Math.random() * 1,
          amplitude: 20 + Math.random() * 40,
          frequency: 0.001 + Math.random() * 0.002,
          offset: Math.random() * Math.PI * 2,
          opacity: 0.03 + Math.random() * 0.07,
          targetY: Math.random() * canvas.height
        });
      }
    };
    initWaves();

    // Mouse move handler
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get theme color (check if dark mode is active)
      const isDark = document.documentElement.classList.contains('dark');
      const baseColor = isDark ? '168, 85, 247' : '147, 51, 234'; // purple-500 for dark, purple-600 for light
      const opacityMultiplier = isDark ? 1 : 2.5; // Increase opacity in light mode

      waves.current.forEach((wave, index) => {
        // Smoothly move wave towards mouse Y position
        const distanceToMouse = Math.abs(wave.y - mousePos.current.y);
        if (distanceToMouse < 200) {
          const attraction = (mousePos.current.y - wave.y) * 0.02;
          wave.y += attraction;
        } else {
          // Return to target position when mouse is far
          wave.y += (wave.targetY - wave.y) * 0.01;
        }

        // Update offset for wave animation
        wave.offset += wave.speed * 0.02;

        // Draw wave
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${baseColor}, ${wave.opacity * opacityMultiplier})`;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x += 5) {
          // Calculate wave with influence from mouse position
          const distanceX = Math.abs(x - mousePos.current.x);
          const mouseInfluence = Math.max(0, 1 - distanceX / 300);
          const amplitudeMod = wave.amplitude * (1 + mouseInfluence * 0.5);

          const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * amplitudeMod;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw particles along the wave
        if (index % 2 === 0) {
          for (let x = 0; x < canvas.width; x += 100) {
            const distanceX = Math.abs(x - mousePos.current.x);
            const mouseInfluence = Math.max(0, 1 - distanceX / 300);

            if (mouseInfluence > 0.3) {
              const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;

              ctx.beginPath();
              ctx.arc(x, y, 2 * (1 + mouseInfluence), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${baseColor}, ${wave.opacity * 3 * opacityMultiplier})`;
              ctx.fill();
            }
          }
        }
      });

      // Draw glow effect around mouse
      const gradient = ctx.createRadialGradient(
        mousePos.current.x, mousePos.current.y, 0,
        mousePos.current.x, mousePos.current.y, 150
      );
      gradient.addColorStop(0, `rgba(${baseColor}, ${0.1 * opacityMultiplier})`);
      gradient.addColorStop(0.5, `rgba(${baseColor}, ${0.03 * opacityMultiplier})`);
      gradient.addColorStop(1, `rgba(${baseColor}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(
        mousePos.current.x - 150,
        mousePos.current.y - 150,
        300,
        300
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
