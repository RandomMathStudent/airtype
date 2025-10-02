import { useEffect, useRef } from "react";




export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
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
          const dpr = window.devicePixelRatio || 1; 

          const vw = v.videoWidth
          const vh = v.videoHeight 

          c.width =  Math.floor(vw*dpr);
          c.height = Math.floor(vh.dpr);

          c.style.width = "100%";
          c.style.height = "100%"; 
          

          const ctx = c?.getContext("2d")!; 
          ctx.setTransform(dpr,0,0,dpr,0,0); 


          console.log("video:",vw,vh,"canvas px:",c.width,c.height, "dpr", dpr )
          


                }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Could not access camera. Check permissions.");
      }
    }

    setupCamera();
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

