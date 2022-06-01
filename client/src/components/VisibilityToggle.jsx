import { forwardRef, useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const VisibilityToggle = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} data-cy="togglevis-show-button">
          {props.buttonLabel}
        </button>
      </div>

      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} data-cy="togglevis-hide-button">
          cancel
        </button>
      </div>
    </>
  );
});

VisibilityToggle.displayName = "VisibilityToggle";

VisibilityToggle.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default VisibilityToggle;
