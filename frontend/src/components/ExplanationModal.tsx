// import touchAndHold from "../assets/touch-and-hold.svg";
import { ExplanationText } from "./ExplanationText";

export const ExplanationModal = () => {
  return (
    <div className="absolute flex flex-col justify-center items-center w-screen lg:w-full h-full">
      <div>
        {/* <img src={touchAndHold} alt="Touch and hold" className="w-36 m-4" /> */}
        <div className="w-36 h-36 m-4 bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-600">
          Touch & Hold
        </div>
      </div>
      <div className="bg-primary text-white text-lg bg-opacity-80 p-4 w-[32rem] flex flex-col gap-2">
        <ExplanationText />
      </div>
    </div>
  );
};
