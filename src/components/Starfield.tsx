import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars: { x: number; y: number; z: number; size: number }[] = [];
        const numStars = 800; // Dense starfield

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width,
                size: Math.random() * 2
            });
        }

        let animationFrameId: number;

        const render = () => {
            // Clear with trail effect
            ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
            ctx.fillRect(0, 0, width, height);
 
            ctx.fillStyle = '#ffffff';

            stars.forEach((star) => {
                // Move star closer
                star.z -= 2;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                const k = 128.0 / star.z;
                const px = star.x * k + width / 2;
                const py = star.y * k + height / 2;

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    const size = (1 - star.z / width) * 2.5;
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, userSelect: 'none', zIndex: -1 }} />;
};

export default Starfield;
