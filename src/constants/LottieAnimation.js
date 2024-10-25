import { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieAnimation = ({ lottieJson, width = "100%", height = "100%" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: lottieJson,
    });

    return () => {
      anim.destroy();
    };
  }, [lottieJson]);

  return <div ref={containerRef} style={{ width, height }} />;
};

export default LottieAnimation;
