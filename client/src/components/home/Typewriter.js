import React from "react";
import Typed from "typed.js";

function Typewriter() {
  return React.useEffect(() => {
    const typed = new Typed(".multiple-text", {
      strings: ["projects."],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
}
export default Typewriter;
