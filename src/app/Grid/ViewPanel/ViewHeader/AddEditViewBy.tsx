/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import { salesForce } from '@/axios/actions/salesForce';
import CustomConfirmAlert from '@/components/UI/ConfirmAlert';
import { InputField, TextareaField } from '@/components/formFields';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  deleteViewByMeta,
  pushToViewBy,
  setReFetchViewBy,
  setSelectedViewBy,
  updateViewByMeta,
} from '@/redux/slices/salesForce';
import { AddNewTabInterface, ViewByInterface } from '@/redux/slices/salesForce/interface';

import '../../notes.css';

const handlingDefaultValues = (
  values: ViewByInterface | null,
  tabId: string
): AddNewTabInterface => {
  return {
    view: 'tab',
    label: values ? values?.label : '',
    description: values ? values?.description : '',
    query: {
      type: 'SELECT',
      fields: values
        ? values?.query?.fields?.map((item) => {
            return {
              name: item?.name,
              columnOrder: item?.columnOrder,
              isVisible: item?.isVisible,
            };
          })
        : [],
      object: tabId,
      filter: {
        type: 'AND',
        expression: [],
      },
      limit: 20,
    },
  };
};

function AddEditViewBy(props: {
  show: boolean;
  handleClose: () => void;
  defaultValues: ViewByInterface | null;
}) {
  //   use hooks
  const { tabId } = useParams();
  const dispatch = useAppDispatch();

  // global states
  const { viewByMeta, allFields, selectedViewBy } = useAppSelector((state) => state.sales);

  // local states
  const [selectedView, setSelectedView] = useState<ViewByInterface | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<{ label: string; value: string }[] | null>(
    null
  );
  const [values, setValues] = useState<AddNewTabInterface | undefined>();

  // hook form
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<AddNewTabInterface>({
    defaultValues: tabId ? handlingDefaultValues(props?.defaultValues ?? null, tabId) : undefined,
    values: values,
  });

  // handling hook form array fields
  const { fields, replace } = useFieldArray({ control, name: 'query.fields' });

  // onsubmit handler
  const onSubmit = async (formData: AddNewTabInterface) => {
    try {
      if (selectedView) {
        await salesForce({
          method: 'PATCH',
          url: `metadata/${selectedView?._id}`,
          data: formData,
        });
        dispatch(updateViewByMeta({ ...selectedView, ...formData }));
        dispatch(setReFetchViewBy());
      } else if (addingNew) {
        const resp = await salesForce({ method: 'POST', url: 'views', data: formData });
        setAddingNew(false);
        dispatch(pushToViewBy(resp?.data?.data));
        setSelectedView(resp?.data?.data);

        setValues(resp?.data?.data); // these values will be set to form
        dispatch(setReFetchViewBy());
      }
      toast.success(`View ${selectedView ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  // handling onSelectChange
  const onSelectChange = (values: any) => {
    setSelectedFields(values);
    const newArray = values?.map((item: { label: string; value: string }, i: number) => {
      return {
        name: item?.value,
        columnOrder: i + 1,
        isVisible: true,
      };
    });
    replace(newArray);
  };

  // handling note delete
  const handleDelete = async () => {
    await salesForce({
      method: 'DELETE',
      url: `metadata/${selectedView?._id}`,
    });
    dispatch(deleteViewByMeta(selectedView?._id));
    dispatch(setReFetchViewBy());
    handlingDiscardNewView();
    const deletedView = viewByMeta?.find((item) => item?._id === selectedView?._id);
    if (deletedView && deletedView?.label === selectedViewBy) {
      dispatch(setSelectedViewBy('all'));
    }
  };

  // handling add new view
  const handleAddNewView = () => {
    setSelectedView(null);
    setAddingNew(true);
    setSelectedFields(null);
    tabId && setValues(handlingDefaultValues(null, tabId));
  };

  // handling discard new view
  const handlingDiscardNewView = () => {
    if (viewByMeta?.length) {
      setAddingNew(false);
      setSelectedView(viewByMeta?.[0]);
      setSelectedFields(
        viewByMeta?.[0]?.query?.fields?.map((item) => {
          return {
            label: item?.name,
            value: item?.name,
          };
        })
      );
      tabId && setValues(handlingDefaultValues(viewByMeta?.[0], tabId));
    }
  };

  // handling default value in edit
  useEffect(() => {
    if (props?.defaultValues) {
      const values = props?.defaultValues?.query?.fields?.map((item) => {
        return {
          label: item?.name,
          value: item?.name,
        };
      });
      setSelectedFields(values);
      setSelectedView(props?.defaultValues);
    } else {
      setAddingNew(true);
    }
  }, [props?.defaultValues]);

  return (
    <>
      <Modal
        dialogClassName="custom-modal notes-modal dialog-md"
        show={props.show}
        onHide={props.handleClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="msform">
          <Modal.Body>
            <div className="main-wrapper d-flex">
              {/* - - Left navigation - - - */}
              <div className={`left-panel ${collapsed ? 'collapsed' : ''}`}>
                <a
                  href="#"
                  onClick={(e) => {
                    setCollapsed((prev) => !prev);
                    e.preventDefault();
                  }}
                  style={{ zIndex: 2 }}
                  className="icons-collapse"
                >
                  <span className="icons-drop-down"></span>
                </a>
                <div className="left-navigation">
                  <div className="nav-heading-top">
                    <div className="heading">
                      <h3>Views</h3>
                    </div>
                    <span
                      className="icons-add icon m-0"
                      style={{ cursor: 'pointer' }}
                      onClick={handleAddNewView}
                    ></span>
                  </div>
                  <ul className="navlist">
                    {addingNew && (
                      <li className="active">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          {watch('label') !== '' ? watch('label') : 'Unnamed'}
                        </a>
                        <span
                          className="icons-delete icon"
                          onClick={() => {
                            handlingDiscardNewView();
                          }}
                        ></span>
                      </li>
                    )}
                    {viewByMeta?.map((item) => {
                      return (
                        <li
                          key={item?._id}
                          className={selectedView?._id === item?._id ? 'active' : ''}
                        >
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setAddingNew(false);
                              setSelectedView(item);
                              setSelectedFields(
                                item?.query?.fields?.map((item) => {
                                  return {
                                    label: item?.name,
                                    value: item?.name,
                                  };
                                })
                              );
                              tabId && setValues(handlingDefaultValues(item, tabId));
                            }}
                          >
                            {item?.label}
                          </a>
                          <span
                            className="icons-delete icon"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              // props.handleClose();
                              CustomConfirmAlert({
                                yes: () => handleDelete(),
                                heading: 'Are you sure?',
                                message: `Do you really want to delete this View? This process cannot be undone.`,
                                noLabel: 'Cancel',
                                yesLabel: 'Delete',
                                loadingMessage: 'Deleting',
                                successMessage: 'View Deleted Successfully',
                                errorMessage: 'Error while Deleting View',
                              });
                            }}
                          />
                        </li>
                      );
                    })}
                    {!viewByMeta && (
                      <li>
                        <Spinner style={{ margin: '10%' }} animation="border" variant="dark" />
                      </li>
                    )}
                    {viewByMeta?.length === 0 && (
                      <li>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          No Records
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              {/* - - right content section - - - */}
              <div className="right-panel" style={{ width: '100px' }}>
                <div className="right-panel-top">
                  <div className="right-panel-header d-flex justify-content-between align-items-center">
                    <h3>{addingNew ? 'Add New' : `Editing ${selectedView?.label}`}</h3>
                    <span className="icons-cross"></span>
                  </div>
                  <div className="form-step-content">
                    <div className="form-wrapper">
                      <div className="row g-3">
                        <InputField
                          control={control}
                          label={'View Name'}
                          name={'label'}
                          mainClass="col-sm-12"
                          inputProps={{
                            placeholder: `Enter View Name`,
                          }}
                          rules={{
                            required: { value: true, message: '' },
                            maxLength: {
                              value: 56,
                              message: 'Maximum 56 characters are allowed',
                            },
                          }}
                        />
                        <TextareaField
                          control={control}
                          label={'Description'}
                          name={'description'}
                          mainClass="col-sm-12"
                          inputProps={{
                            placeholder: 'Enter Description',
                          }}
                          rules={{
                            required: { value: true, message: '' },
                            maxLength: {
                              value: 256,
                              message: 'Maximum 256 characters are allowed',
                            },
                          }}
                        />

                        <Select
                          value={selectedFields}
                          onChange={onSelectChange}
                          options={allFields?.map((item) => {
                            return {
                              label: item?.label,
                              value: item?.name,
                            };
                          })}
                          isMulti={true}
                          className={`simpledropdown  col-sm-12`}
                          classNamePrefix="custom-react-select"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          {/* - - Footer - - - */}
          <Modal.Footer>
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
              disabled={!fields?.length || isSubmitting}
              className="btn-salesboost"
            >
              Save View
              {isSubmitting && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginLeft: '10px' }}
                />
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default AddEditViewBy;
