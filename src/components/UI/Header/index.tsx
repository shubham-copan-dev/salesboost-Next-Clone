import { useState } from "react";

import MainLogo from "@/assets/images/logo-salesboost.svg";
import MainLogoDark from "@/assets/images/salesboost-logo-dark.svg";
import { useAppDispatch } from "@/hooks/redux";
import AddEditNotes from "@/app/Grid/AddEditNotes";
import { setCreateRecordPopup } from "@/redux/slices/salesForce";

import Search from "../Search";
import "./header.css";

function Header() {
  // use hooks
  const dispatch = useAppDispatch();

  // local states
  const [notesMOdal, setNotesMOdal] = useState<boolean>(false);

  return (
    <div className="header">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <div className="logo">
              <img src={MainLogo} />
              <img src={MainLogoDark} />
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-md-end">
            <div className="top-panel d-inline-flex align-items-center flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setNotesMOdal(true);
                }}
                className="notes d-flex align-items-center"
              >
                <span className="icons-notes"></span> Notes
              </button>
              <Search />
              <button
                className="btn-salesboost"
                type="button"
                onClick={() => dispatch(setCreateRecordPopup(true))}
              >
                <span className="icons-add"></span> Create New
              </button>
            </div>
          </div>
        </div>
      </div>
      {notesMOdal && (
        <AddEditNotes
          show={notesMOdal}
          handleClose={() => setNotesMOdal(false)}
        />
      )}
    </div>
  );
}

export default Header;
