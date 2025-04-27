import { useMap } from 'react-leaflet';
import ReactDOM from 'react-dom';
import { useEffect, useRef } from 'react';

const CustomControl = ({ position, children }) => {
  const map = useMap();
  const controlRef = useRef(null); // Create a ref for the custom control

  useEffect(() => {
    // Define the custom control using L.control
    const control = L.control({ position });

    // Define the onAdd method for the control
    control.onAdd = function () {
      // Create the div for the control
      const div = L.DomUtil.create('div', 'leaflet-control-custom');
      controlRef.current = div; // Save the reference to the div

      // Render the React component inside the div using ReactDOM.createPortal
      ReactDOM.createPortal(children, div);

      return div;
    };

    // Add the control to the map
    control.addTo(map);

    // Cleanup when the component is unmounted
    return () => {
      map.removeControl(control);
    };
  }, [map, position, children]);

  return null; // This component does not render anything itself
};

export default CustomControl;


