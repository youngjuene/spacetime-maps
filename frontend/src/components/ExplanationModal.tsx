// import touchAndHold from "../assets/touch-and-hold.svg";
import { ExplanationText } from "./ExplanationText";

interface ExplanationModalProps {
  onClose: () => void;
}

export const ExplanationModal = ({ onClose }: ExplanationModalProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🚶🏃🚴 Welcome to Soft Mobility Spacetime Maps!
        </h2>
        <div className="space-y-3 text-sm">
          <p>
            Watch as geographic space transforms into{" "}
            <strong>time-based space</strong> for pedestrians, runners, and
            cyclists where distances represent travel time, not physical
            distance.
          </p>
          <div className="bg-blue-50 p-3 rounded">
            <p className="font-semibold text-blue-800">🎮 Quick Start:</p>
            <ul className="text-blue-700 mt-1 space-y-1">
              <li>
                • <strong>Space bar</strong> - Toggle animation
              </li>
              <li>
                • <strong>Mouse/Touch</strong> - Drag to explore
              </li>
              <li>
                • <strong>M key</strong> - Open menu for more cities
              </li>
              <li>
                • <strong>C key</strong> - Compare NY vs Daejeon
              </li>
              <li>
                • <strong>? key</strong> - Show all shortcuts
              </li>
            </ul>
          </div>
          <p className="text-center text-gray-600">
            <strong>Animation is already running!</strong> Press anywhere to
            start exploring soft mobility.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
};
