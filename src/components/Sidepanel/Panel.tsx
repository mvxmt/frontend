import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";

export default function Panel({ panelStatus, type }) {
  return (
    <div>
      <SlidingPanel type={type} isOpen={panelStatus} size={30}>
        <div>
          <div>My Panel</div>
          <button onClick={() => panelStatus(false)}>Close</button>
        </div>
      </SlidingPanel>
    </div>
  );
}
