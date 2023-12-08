/* eslint-disable @typescript-eslint/no-explicit-any */
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// Import css
import toast from 'react-hot-toast';

import './confirm-alert.css';

/**
 * @property types
 */
interface Props {
  yes: any;
  no?: () => void;
  message: string;
  yesLabel: string;
  noLabel: string;
  heading: string;
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
}

function CustomConfirmAlert({
  yes,
  no,
  message,
  yesLabel,
  noLabel,
  heading,
  loadingMessage,
  successMessage,
  errorMessage,
}: Props) {
  // handling yes
  const handleYes = async (onClose: () => void) => {
    toast.promise(yes(), {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
    onClose();
  };

  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="modal-content width-200">
          <div className="modal-header" style={{ border: 'none' }}>
            <h3>{heading}</h3>
            <span onClick={() => onClose()} className="icons-cross" aria-label="Close"></span>
          </div>
          <div className="modal-body alert-message-body remove-message-alert">
            <div className="alert-icon alert-remove" />
            <p>{message}</p>
            <div className="alert-message-btn">
              <button
                type="button"
                onClick={no ? () => no() : () => onClose()}
                className="btn-bordered"
                style={{ marginRight: 10 }}
              >
                {noLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleYes(onClose);
                }}
                className="btn-salesboost btn-red"
              >
                {yesLabel} {/* {loading ? <i className="fa fa-spinner fa-spin" /> : null} */}
              </button>
            </div>
          </div>
        </div>
      );
    },
  });
}

export default CustomConfirmAlert;
