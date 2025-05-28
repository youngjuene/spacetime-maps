import { ReactNode } from "react";
import { isTouchscreen } from "../useIsMobile";

const B = ({ children }: { children: ReactNode }) => {
  return <span className="font-bold">{children}</span>;
};

export const ExplanationText = () => {
  return (
    <>
      <p>
        <B>{isTouchscreen() ? "Touch" : "Click"} and hold</B> to switch to time
        mode.
      </p>
      <p>
        This is a map that can show <B>time</B> instead of space. Distances in
        the map reflect travel times for soft mobility: points that are close
        but take a long time to travel between (walking, running, or cycling)
        get pushed away from each other, and vice versa.
      </p>
    </>
  );
};
