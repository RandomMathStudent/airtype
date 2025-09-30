import { useEffect, useRef } from "react";


let HandLandmarker : any; 

let FilesetResolver : any; 



export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let rafId = 0;
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          const v = videoRef.current!; 
          const c = canvasRef.current; 
          if (!c) return;
          const dpr = window.devicePixelRatio || 1; 
          const vw = v.videoWidth
          const vh = v.videoHeight 
          c.width =  Math.floor(vw*dpr);
          c.height = Math.floor(vh*dpr);
          c.style.width = "100%";
          c.style.height = "100%"; 
          
          const ctx = c.getContext("2d")!; 
          if (!ctx) return; 
          ctx.setTransform(dpr,0,0,dpr,0,0); 
          console.log("video:",vw,vh,"canvas px:",c.width,c.height, "dpr", dpr );

          const vision = await import("@mediapipe/tasks-vision")
          FilesetResolver = vision.FilesetResolver;
          HandLandmarker = vision.HandLandmarker;

          const fileset = await FilesetResolver.forVisionTasks(
              "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"

          )
          const handLandmarker = await HandLandmarker.createFromOptions(
            fileset,{
              baseOptions:{
                 modelAssetPath: "/models/hand_landmarker.task",
            },
            runningMode: "VIDEO",
            numHands : 2, 
        });

          function draw() {

            const c = canvasRef.current!;
            const ctx = c.getContext("2d")!;
            const dpr = window.devicePixelRatio || 1;
            const cssW = c.width / dpr;
            const cssH = c.height / dpr;

            // Debug: Log video and canvas sizes
            console.log("[DEBUG] Video size:", v.videoWidth, v.videoHeight, "Canvas size:", c.width, c.height, "dpr:", dpr);

            // 0) Clear
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.restore();

            // 1) Run the hand landmarker for this video frame
            const ts = performance.now(); // milliseconds
            console.log("[DEBUG] Calling detectForVideo at ts:", ts);
            const result = handLandmarker.detectForVideo(v, ts);
            console.log("[DEBUG] Detection result:", result);

            // 2) Draw landmarks if a hand is found
            if (result?.landmarks?.length) {
              console.log("[DEBUG] Landmarks detected:", result.landmarks[0]);
              // we asked for numHands:1, so take the first hand
              const lm = result.landmarks[0]; // array of 21 {x,y,z} in [0..1]
              // loop through all points and draw small circles
              ctx.fillStyle = "lime";
              for (const p of lm) {
                // p.x, p.y are normalized to the video frame (0..1)
                // our video is visually MIRRORED by CSS (scaleX(-1)),
                // so flip the x so dots align with what you see:
                const x = cssW * (1 - p.x);
                const y = cssH * p.y;

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
              }

              // (optional) highlight index fingertip (landmark index 8) bigger
              const tip = lm[8];
              const tipX = cssW * (1 - tip.x);
              const tipY = cssH * tip.y;
              ctx.beginPath();
              ctx.arc(tipX, tipY, 8, 0, Math.PI * 2);
              ctx.strokeStyle = "yellow";
              ctx.lineWidth = 2;
              ctx.stroke();

              rafId = requestAnimationFrame(draw);
            } else {
              // Debug: No hand detected
              console.log("[DEBUG] No hand detected in this frame.");
              rafId = requestAnimationFrame(draw);
            }
          }
          draw();
        



        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Could not access camera. Check permissions.");
      }
    }

    setupCamera();
    return () => {
       if (rafId) cancelAnimationFrame(rafId);
       const stream = videoRef.current?.srcObject as MediaStream | null;
       stream?.getTracks().forEach(t => t.stop());
     };
  }, []);


  return (
  <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
    <div style={{ position: "relative", width: "80vw", maxWidth: 900 }}>
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          transform: "scaleX(-1)",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,              // top/right/bottom/left: 0
          pointerEvents: "none", // make it a non-blocking overlay
        }}
      />
    </div>
  </div>
);

}

