import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";

export default function Panel({ isOpen, setIsOpen}) {
  return (
    <div>
      <SlidingPanel type={"left"} isOpen={isOpen} size={30}>
        <div>
          <div>My Panel</div>
          <button onClick={() => setIsOpen(!isOpen)}>Close</button>
        </div>
      </SlidingPanel>
    </div>
  );
}
