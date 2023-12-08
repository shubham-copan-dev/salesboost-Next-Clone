import {
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { ICellEditorParams } from 'ag-grid-community';

// backspace starts the editor on Windows
const KEY_BACKSPACE = 'Backspace';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

const NumberField = forwardRef((props: ICellEditorParams, ref) => {
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

  const isLeftOrRight = (event: KeyboardEvent<HTMLInputElement>) => {
    return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1;
  };

  const isCharNumeric = (charStr: string) => {
    return !!/\d/.test(charStr);
  };

  const isKeyPressedNumeric = (event: KeyboardEvent<HTMLInputElement>) => {
    const charStr = event.key;
    return isCharNumeric(charStr);
  };

  const isBackspace = (event: KeyboardEvent<HTMLInputElement>) => {
    return event.key === KEY_BACKSPACE;
  };

  const finishedEditingPressed = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    return key === KEY_ENTER || key === KEY_TAB;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isLeftOrRight(event) || isBackspace(event)) {
      event.stopPropagation();
      return;
    }

    if (!finishedEditingPressed(event) && !isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
  };

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

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      // isCancelAfterEnd() {
      //   // will reject the number if it greater than 1,000,000
      //   // not very practical, but demonstrates the method.
      //   return value > 1000000;
      // },
    };
  });

  return (
    <div className="custom-ag-number-cell">
      <input
        ref={refInput}
        className="grid-number-input"
        value={value}
        maxLength={16}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
});

NumberField.displayName = 'NumberField';
export default NumberField;
