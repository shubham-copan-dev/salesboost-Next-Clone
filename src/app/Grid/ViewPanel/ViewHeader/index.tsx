/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ListIcon from '@/assets/images/list.png';
import { salesForce } from '@/axios/actions/salesForce';
import CustomConfirmAlert from '@/components/UI/ConfirmAlert';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFullscreen } from '@/redux/slices/common';
import {
  deleteGridTabs,
  setEditedFields,
  setFieldUpdateMode,
  setPanelView,
  setReFetchTabs,
} from '@/redux/slices/salesForce';
import { AddNewTabInterface } from '@/redux/slices/salesForce/interface';

import AddNewTab from '../../AddNewTab';
import EditForm from '../EditForm';
import Filters from './Filters';
import ManageColumns from './ManageColumns';
import ViewBy from './ViewBy';

function ViewHeader({ reFetch, reSetValues }: { reFetch: () => void; reSetValues: () => void }) {
  // use hooks
  const dispatch = useAppDispatch();
  const { tabId, viewId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // global states
  const { fullscreen } = useAppSelector((state) => state.common);
  const { panelView, columnMeta, selectedRows, gridTabs, fieldUpdateMode, editedFields } =
    useAppSelector((state) => state.sales);

  // local states
  const [show, setShow] = useState<boolean>(false);
  const [editTabModal, setEditTabModal] = useState<boolean>(false);
  const [tabData, setTabData] = useState<AddNewTabInterface | null>(null);
  const [filterPopup, setFilterPopup] = useState<boolean>(false);
  const [manageColumnPopup, setManageColumnPopup] = useState<boolean>(false);

  // handle panel view button
  const panelViewButton = (view: string) => {
    switch (view) {
      case 'grid':
        return (
          <button
            type="button"
            onClick={() => {
              setSearchParams((searchParams) => {
                searchParams.set('view', 'kanban');
                return searchParams;
              });
              dispatch(setPanelView('kanban'));
            }}
          >
            <span className="icons-template"></span>
          </button>
        );
      case 'kanban':
        return (
          <button
            type="button"
            onClick={() => {
              setSearchParams((searchParams) => {
                searchParams.set('view', 'grid');
                return searchParams;
              });
              dispatch(setPanelView('grid'));
            }}
          >
            <img src={ListIcon} style={{ width: '20px', height: '20px' }} />
          </button>
        );

      default:
        return null;
    }
  };

  // handling tab edit
  const handleTabEdit = () => {
    const tab = gridTabs?.find((fi) => fi?._id === viewId);
    if (tab) {
      const defaultValues: any = {
        view: tab?.view,
        label: tab?.label,
        description: tab?.description,
        query: {
          type: tab?.query?.type,
          fields: tab?.query?.fields,
          object: tab?.query?.object,
          filter: {
            type: tab?.query?.filter?.type,
            expression: tab?.query?.filter?.expression?.map((item) => {
              return { ...item, value: item?.value?.replaceAll("'", '') };
            }),
          },
          limit: tab?.query?.limit,
        },
      };
      setTabData(defaultValues);
      setEditTabModal(true);
    }
  };

  // handling tab delete
  const handleTabDelete = async () => {
    await salesForce({
      method: 'DELETE',
      url: `metadata/${viewId}`,
    });
    dispatch(deleteGridTabs(viewId));
    dispatch(setReFetchTabs());
    navigate(`/${tabId}`);
  };

  // handling save
  const handleSave = async () => {
    await toast.promise(
      salesForce({
        method: 'PATCH',
        url: `bulkUpdate/records`,
        data: {
          allOrNone: true,
          records: editedFields,
        },
      }),
      {
        loading: 'Updating',
        success: 'Record updated successfully',
        error: 'An error occur while updating the record',
      }
    );
    reFetch();
    dispatch(setEditedFields(null));
  };

  // handling field updating mode buttons
  const handlingFieldUpdateModeButton = (mode: string) => {
    switch (mode) {
      case 'instant':
        return (
          <button
            className="btn list-btn"
            type="button"
            onClick={() => dispatch(setFieldUpdateMode('submit'))}
          >
            <span className="icons-switch-mode"></span>
          </button>
        );
      case 'submit':
        return (
          <>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                dispatch(setFieldUpdateMode('instant'));
                dispatch(setEditedFields(null));
                reSetValues();
              }}
              className="btn-bordered"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSave}
              disabled={!editedFields?.length}
              className="btn-salesboost"
            >
              Save
            </Button>
            {editedFields?.length && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  reSetValues();
                  dispatch(setEditedFields(null));
                }}
                className="btn-bordered"
              >
                Discard
              </Button>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // handling Download CSV
  const downloadCsv = async () => {
    const downloadFile = ({ data, fileName, fileType }: any) => {
      const blob = new Blob([data], { type: fileType });

      const a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      a.dispatchEvent(clickEvt);
      a.remove();
    };

    const tab = gridTabs?.find((fi) => fi?._id === viewId);

    toast.promise(
      salesForce({
        method: 'POST',
        url: `sf/object/metadata/CSV`,
        params: {
          id: viewId,
        },
      }).then((resp) => {
        downloadFile({
          data: resp?.data,
          fileName: `${tab?.label}.csv`,
          fileType: 'text/csv',
        });
      }),
      {
        loading: 'Downloading',
        success: 'Download successful',
        error: 'Error while downloading',
      }
    );
  };

  // resetting states on url change
  useEffect(() => {
    setFilterPopup(false);
    setManageColumnPopup(false);
    const view = searchParams?.get('view');
    if (view?.length) {
      dispatch(setPanelView(view));
    }
  }, [viewId, searchParams]);

  return (
    <>
      <div className="view-header d-flex flex-wrap align-items-center justify-content-between">
        <ListGroup className="view-header-links d-flex flex-row flex-wrap">
          {/* - - Filters - - - */}
          <ListGroup.Item>
            <Dropdown show={filterPopup}>
              <Dropdown.Toggle onClick={() => setFilterPopup((prev) => !prev)} className="list-btn">
                <span className="icons-filter"></span> Filters
              </Dropdown.Toggle>
              {filterPopup && <Filters onHide={() => setFilterPopup((prev) => !prev)} />}
            </Dropdown>
          </ListGroup.Item>

          {/* - - Manage columns - - - */}
          <ListGroup.Item>
            <Dropdown show={manageColumnPopup}>
              <Dropdown.Toggle
                onClick={() => setManageColumnPopup((prev) => !prev)}
                className="list-btn"
              >
                <span className="icons-settings"></span> Manage Columns
              </Dropdown.Toggle>
              {manageColumnPopup && (
                <ManageColumns onHide={() => setManageColumnPopup((prev) => !prev)} />
              )}
            </Dropdown>
          </ListGroup.Item>

          {/* - - Show Metrics - - - */}
          <ListGroup.Item>
            <a href="#">
              <span className="icons icons-line-graph"></span> Show Metrics
            </a>
          </ListGroup.Item>

          {/* - - More View Edit/Delete - - - */}
          <ListGroup.Item>
            <Dropdown className="moredropdown">
              <Dropdown.Toggle id="dropdown-autoclose-true">
                <span className="icons-three-dots"></span> more{' '}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleTabEdit}>Edit </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    CustomConfirmAlert({
                      yes: () => handleTabDelete(),
                      heading: 'Are you sure?',
                      message: `Do you really want to delete this view? This process cannot be undone.`,
                      noLabel: 'Cancel',
                      yesLabel: 'Delete',
                      loadingMessage: 'Deleting',
                      successMessage: 'View Deleted Successfully',
                      errorMessage: 'Error while Deleting View',
                    });
                  }}
                  className="colorred"
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ListGroup.Item>
        </ListGroup>

        <ListGroup className="view-header-links d-flex flex-row flex-wrap right">
          {/* - - Grid Edit mode instant/submit - - - */}
          <ListGroup.Item>{handlingFieldUpdateModeButton(fieldUpdateMode)}</ListGroup.Item>

          {/* - - panel view Grid/Kanban - - - */}
          <ListGroup.Item>{panelViewButton(panelView)}</ListGroup.Item>

          {/* - - Fullscreen - - - */}
          <ListGroup.Item>
            <OverlayTrigger
              placement={'top'}
              overlay={<Tooltip id={`tooltip-${'top'}`}>Expand</Tooltip>}
            >
              <a
                href="javascript:void(0)"
                className="btn list-btn"
                type="button"
                onClick={() => dispatch(setFullscreen(!fullscreen))}
              >
                {fullscreen ? (
                  <span className="icons icons-expand"></span>
                ) : (
                  <span className="icons icons-expand"></span>
                )}
              </a>
            </OverlayTrigger>
          </ListGroup.Item>

          {/* - - Download CSV - - - */}
          <ListGroup.Item>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                downloadCsv();
              }}
            >
              <span className="icons icons-download"></span>
            </a>
          </ListGroup.Item>

          {/* - - ReFetch records - - - */}
          <ListGroup.Item>
            <button type="button" onClick={() => reFetch()}>
              <span className="icons-reload"></span>
            </button>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="vr"></div>
          </ListGroup.Item>
          {/* - - View By - - - */}
          <ViewBy />

          {/* - - Bulk update - - - */}
          <ListGroup.Item>
            <div className="vr"></div>
          </ListGroup.Item>
          <ListGroup.Item>
            <Button
              variant="primary"
              className="btn-sm"
              onClick={() => setShow(true)}
              disabled={(selectedRows?.length ?? 1) <= 1}
            >
              Bulk Update
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </div>

      {/* - - Modals - - - */}
      {show && columnMeta && (
        <EditForm allColumnData={columnMeta} show={show} handleClose={() => setShow(false)} bulk />
      )}
      {editTabModal && tabData && (
        <AddNewTab
          show={editTabModal}
          onHide={() => setEditTabModal(false)}
          defaultValues={tabData}
          refetch={reFetch}
        />
      )}
    </>
  );
}

export default ViewHeader;
