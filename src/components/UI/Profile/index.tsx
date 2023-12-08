import React from "react";
import { Button, Modal } from "react-bootstrap";

import "./profile.css";

function Profile(props: { show: boolean; handleClose: () => void }) {
  return (
    <Modal
      dialogClassName="custom-modal dialog-md profile-modal"
      show={props.show}
      onHide={props.handleClose}
    >
      <form className="msform">
        <Modal.Header className="border-0 pb-0">
          <h3>Profile</h3>
          <span className="close icons-cross"></span>
        </Modal.Header>
        <Modal.Body>
          <div className="profile-content">
            <div className="table-responsive">
              <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                <h3 className="mb-0">Basic info</h3>
                <a href="#" className="editProfile">
                  Edit Profile
                </a>
              </div>
              <a href="#" className="upload-profilePic mb-4">
                <span className="profile-name">JW</span>{" "}
                <span className="icons-camera"></span>
              </a>

              <table className="table">
                <tbody>
                  <tr>
                    <td>First name</td>
                    <td>James</td>
                  </tr>
                  <tr>
                    <td>Last name</td>
                    <td>Williams</td>
                  </tr>
                  <tr>
                    <td>Nickname</td>
                    <td>james@7087</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="profile-content">
            <div className="table-responsive">
              <h3>Contact info</h3>

              <table className="table">
                <tbody>
                  <tr>
                    <td>Mobile phone</td>
                    <td>(201) 555-0123</td>
                  </tr>
                  <tr>
                    <td>Primary email</td>
                    <td>jameswilliams@cisco.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="profile-content mb-0">
            <div className="table-responsive">
              <h3>Address info</h3>

              <table className="table">
                <tbody>
                  <tr>
                    <td>Country</td>
                    <td>United States</td>
                  </tr>
                  <tr>
                    <td>State</td>
                    <td>New York</td>
                  </tr>
                  <tr>
                    <td>City</td>
                    <td>Manhattan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        {/* - - Footer - - - */}
        <Modal.Footer className="border-0 mt-0">
          <Button
            variant="secondary"
            type="button"
            onClick={props.handleClose}
            className="btn-bordered"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            type="submit"
            // disabled={isSubmitting}
            className="btn-salesboost disabled"
          >
            Save Changes
            {/* {selectedNote?.isTrash ? 'Move and Update' : 'Save Note'}
            {isSubmitting && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginLeft: '10px' }}
              /> */}
            {/* )} */}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default Profile;
