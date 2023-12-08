import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { ICellEditorParams } from 'ag-grid-community';

// backspace starts the editor on Windows
const KEY_BACKSPACE = 'Backspace';

const DateTimeCell = forwardRef((props: ICellEditorParams, ref) => {
  const createInitialState = () => {
    let startValue;

    if (props.eventKey === KEY_BACKSPACE) {
      // if backspace or delete pressed, we clear the cell
      startValue = '';
    } else if (props.charPress) {
      // if a letter was pressed, we start with the letter
      startValue = props.charPress;
    } else {
      // otherwise we start with the current value
      startValue = props.value;
    }

    return {
      value: startValue,
    };
  };

  const initialState = createInitialState();
  const [value, setValue] = useState(initialState.value);
  const refInput = useRef<HTMLInputElement>(null);

  // focus on the input
  useEffect(() => {
    // get ref from React component
    window.setTimeout(() => {
      if (refInput.current) {
        const eInput = refInput.current;
        eInput.focus();
      }
    });
  }, []);

  /* Utility Methods */
  const cancelBeforeStart = props.charPress && '1234567890'.indexOf(props.charPress) < 0;

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        return value;
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return cancelBeforeStart;
      },
    };
  });

  return (
    <div className="calender-cell">
      <input
        ref={refInput}
        type="date"
        className="grid-number-input"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
      />
    </div>
  );
});

DateTimeCell.displayName = 'DateTimeCell';
export default DateTimeCell;
