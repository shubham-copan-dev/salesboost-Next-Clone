import React, { useState } from 'react';
import { Dropdown, ListGroup } from 'react-bootstrap';

import { salesForce } from '@/axios/actions/salesForce';
import CustomConfirmAlert from '@/components/UI/ConfirmAlert';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { deleteViewByMeta, setReFetchViewBy, setSelectedViewBy } from '@/redux/slices/salesForce';
import { ViewByInterface } from '@/redux/slices/salesForce/interface';

import AddEditViewBy from './AddEditViewBy';

function ViewBy() {
  // use hooks
  const dispatch = useAppDispatch();

  // local states
  const [addEditModal, setAddEditModal] = useState<boolean>(false);
  const [defaultValues, setDefaultValues] = useState<ViewByInterface | null>(null);

  // global states
  const { selectedViewBy, viewByMeta } = useAppSelector((state) => state.sales);

  // handling view edit
  const handleEdit = (obj: ViewByInterface) => {
    setDefaultValues(obj);
    setAddEditModal(true);
  };

  // handling delete
  const handleDelete = async (id: string) => {
    await salesForce({
      method: 'DELETE',
      url: `metadata/${id}`,
    });
    dispatch(deleteViewByMeta(id));
    dispatch(setReFetchViewBy());
    const deletedView = viewByMeta?.find((item) => item?._id === id);
    if (deletedView && deletedView?.label === selectedViewBy) {
      dispatch(setSelectedViewBy('all'));
    }
  };

  return (
    <>
      <ListGroup.Item>
        <Dropdown className="view-by-dropdown">
          <Dropdown.Toggle id="dropdown-basic">
            View by : {selectedViewBy?.toUpperCase()}{' '}
            <span className="icons icons-drop-down" style={{ margin: '10px' }}></span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <ListGroup>
              <ListGroup.Item>
                <Dropdown.Item
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setSelectedViewBy('all'));
                  }}
                  className="d-flex justify-content-between"
                  style={{ color: selectedViewBy === 'all' ? '#3478f6' : '' }}
                >
                  ALL
                </Dropdown.Item>
              </ListGroup.Item>
              {viewByMeta?.map((item) => {
                return (
                  <ListGroup.Item key={item?._id}>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(setSelectedViewBy(item?.label));
                      }}
                      className="d-flex justify-content-between"
                      style={{ color: selectedViewBy === item.label ? '#3478f6' : '' }}
                    >
                      {item?.label}
                    </Dropdown.Item>
                    <div className="icons-wrapper">
                      <Dropdown.Item
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          CustomConfirmAlert({
                            yes: () => handleDelete(item?._id),
                            heading: 'Are you sure?',
                            message: `Do you really want to delete this View? This process cannot be undone.`,
                            noLabel: 'Cancel',
                            yesLabel: 'Delete',
                            loadingMessage: 'Deleting',
                            successMessage: 'View Deleted Successfully',
                            errorMessage: 'Error while Deleting View',
                          });
                        }}
                        className="icons-delete"
                      ></Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(item);
                        }}
                        className="icons-edit"
                      ></Dropdown.Item>
                    </div>
                  </ListGroup.Item>
                );
              })}

              <ListGroup.Item>
                <Dropdown.Item
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setAddEditModal(true);
                  }}
                  className="d-flex align-items-center"
                >
                  <span className="icons-add"></span>New Contract
                </Dropdown.Item>
              </ListGroup.Item>
            </ListGroup>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
      {addEditModal && (
        <AddEditViewBy
          show={addEditModal}
          handleClose={() => {
            setAddEditModal(false);
            setDefaultValues(null);
          }}
          defaultValues={defaultValues}
        />
      )}
    </>
  );
}

export default ViewBy;
