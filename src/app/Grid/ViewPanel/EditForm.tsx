/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { salesForce } from '@/axios/actions/salesForce';
import CustomConfirmAlert from '@/components/UI/ConfirmAlert';
import { InputField, ReactSelectField, TextareaField } from '@/components/formFields';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  deleteRecord,
  setSelectedViewBy,
  updateMultipleRecords,
  updateRecord,
} from '@/redux/slices/salesForce';
import { ColumnMetaInterface, RecordsInterface } from '@/redux/slices/salesForce/interface';
import { getDirtyFields } from '@/utilities';
import { fieldTypes } from '@/utilities/constants';

import './viewPanel.css';

// import { NumberFormatter } from './CustomFields';

// handling filed switch
export const fieldSwitch = (
  type: string,
  item: ColumnMetaInterface,
  control: any,
  filter?: boolean
) => {
  const required = filter ? false : item?.updateable;
  const disabled = filter ? false : !item?.updateable;
  switch (type) {
    case fieldTypes?.PICKLIST:
      return (
        <ReactSelectField
          key={item?.name}
          control={control}
          label={item?.label}
          name={item?.name}
          mainClass="col-md-12 form-group"
          options={item?.picklistValues?.map((pick: any) => {
            return { label: pick?.label, value: pick?.label, id: item?.name };
          })}
          selectProps={{
            isDisabled: disabled,
          }}
          rules={{
            required: { value: required, message: '' },
          }}
        />
      );
    case fieldTypes?.BOOLEAN:
      return (
        <ReactSelectField
          key={item?.name}
          control={control}
          label={item?.label}
          name={item?.name}
          mainClass="col-md-12"
          options={[
            { id: 1, label: 'True', value: 'true' },
            { id: 1, label: 'False', value: 'false' },
          ]}
          selectProps={{
            isDisabled: disabled,
          }}
          rules={{
            required: { value: required, message: '' },
          }}
        />
      );
    case fieldTypes?.TEXTAREA:
      return (
        <TextareaField
          key={item?.name}
          control={control}
          label={item?.label}
          name={item?.name}
          mainClass="col-sm-12 form-group"
          inputProps={{
            placeholder: item?.label,
            disabled: disabled,
          }}
          rules={{
            required: { value: required, message: '' },
            maxLength: {
              value: 256,
              message: 'Maximum 256 characters are allowed',
            },
          }}
        />
      );
    case fieldTypes?.CURRENCY:
    case fieldTypes?.DOUBLE:
    case fieldTypes?.INT:
      return (
        <InputField
          key={item?.name}
          control={control}
          label={item?.label}
          name={item?.name}
          type="number"
          mainClass="col-sm-6 form-group"
          inputProps={{
            placeholder: item?.label,
            disabled: disabled,
          }}
          rules={{
            required: { value: required, message: '' },
            maxLength: {
              value: 16,
              message: 'Maximum 16 characters are allowed',
            },
          }}
        />
      );
    case fieldTypes?.DATE:
    case fieldTypes?.DATETIME:
      return (
        <InputField
          key={item?.name}
          control={control}
          label={item?.label}
          name={item?.name}
          type={type}
          inputProps={{
            placeholder: item?.label,
            disabled: disabled,
          }}
          mainClass="col-sm-6 form-group"
          rules={{
            required: { value: required, message: '' },
          }}
        />
      );
    default:
      return (
        <InputField
          key={item?.name}
          control={control}
          label={item?.label}
          name={item?.name}
          mainClass="col-sm-6 form-group"
          inputProps={{
            placeholder: item?.label,
            disabled: disabled,
          }}
          rules={{
            required: { value: required, message: '' },
            maxLength: {
              value: 56,
              message: 'Maximum 56 characters are allowed',
            },
          }}
        />
      );
  }
};

function EditForm(props: {
  allColumnData: ColumnMetaInterface[];
  data?: RecordsInterface;
  show: boolean;
  handleClose: () => void;
  bulk?: boolean;
  add?: boolean;
  refetch?: () => void;
}) {
  //   use hooks
  const dispatch = useAppDispatch();
  const { tabId } = useParams();

  // local states
  const [showAlert, setShowAlert] = useState(false);

  // global states
  const { viewByMeta, selectedViewBy, selectedRows } = useAppSelector((state) => state.sales);

  //   constants
  const columns = props?.allColumnData;
  const viewBySelected = viewByMeta?.find((fil) => fil?.label === selectedViewBy);
  const viewByNames = viewBySelected?.query?.fields?.map((item) => item?.name);

  // hook form
  const {
    control,
    handleSubmit,
    // setError,
    formState: { isSubmitting, dirtyFields },
  } = useForm<any>({
    shouldUnregister: true,
    defaultValues: props?.data,
  });

  //   onsubmit handler
  const onSubmit = async (formData: RecordsInterface) => {
    const fields = getDirtyFields(formData, dirtyFields);

    if (Object.keys(fields)?.length) {
      try {
        if (props?.bulk) {
          await salesForce({
            method: 'PATCH',
            url: `bulkUpdate/records`,
            data: {
              allOrNone: true,
              records: selectedRows?.map((item) => {
                return {
                  attributes: {
                    type: item?.attributes?.type,
                  },
                  id: item?.Id,
                  ...fields,
                };
              }),
            },
          });
          dispatch(updateMultipleRecords({ ids: selectedRows?.map((item) => item?.Id), fields }));
          toast(
            `${Object?.keys(fields)
              ?.map((ke) => ke)
              ?.toString()} fields have been updates successfully`
          );
        } else if (props?.add) {
          await salesForce({
            method: 'POST',
            url: `sf/object/${tabId}/record`,
            data: {
              prop: fields,
            },
          });
          if (props.refetch) props.refetch();
          toast(`New record have been created successfully`);
        } else {
          await salesForce({
            method: 'PATCH',
            url: `sf/object/${props?.data?.attributes?.type}/record/${props?.data?.Id}`,
            data: {
              prop: fields,
            },
          });
          const newObj = { ...props.data, ...formData };
          dispatch(updateRecord(newObj));
          toast(
            `${Object?.keys(fields)
              ?.map((ke) => ke)
              ?.toString()} fields have been updates successfully`
          );
        }
        props.handleClose();
      } catch (error) {
        console.log(error, 'error');
      }
    } else {
      toast('Form submitted with default values');
      props.handleClose();
    }
  };

  // handling form field rendering
  const renderFields = () => {
    return columns
      ?.filter?.((fil) => {
        if (props?.bulk) {
          return fil?.uiMetadata?.isBulkEditable;
        } else {
          return selectedViewBy === 'all'
            ? fil?.uiMetadata?.isVisible
            : viewByNames?.includes(fil?.name);
        }
      })
      ?.map((item: any) => fieldSwitch(item?.type, item, control, false));
  };

  // handling record delete
  const handleDelete = async () => {
    await salesForce({
      method: 'DELETE',
      url: `sf/object/${tabId}/record/${props?.data?.Id}`,
    });
    dispatch(deleteRecord(props?.data?.Id));
  };

  useEffect(() => {
    if (props?.bulk) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  }, [props]);

  return (
    <>
      <Modal dialogClassName="custom-modal dialog-md" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {props?.bulk ? 'Bulk Update' : 'Edit'} {props?.data?.Name}
          </Modal.Title>
          <div className="firm-name">{props?.data?.Description}</div>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)} className="msform">
          <Modal.Body>
            <div className="form-step-content">
              <div className="form-wrapper">
                {props?.bulk && showAlert && (
                  <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                    <Alert.Heading>Note</Alert.Heading>
                    <p>This will update the field for all the selected records</p>
                  </Alert>
                )}
                <div className="row">
                  <div className="col">
                    {!props.bulk && (
                      <div className="view-by">
                        <ul className="custom-radio-tabs d-flex">
                          <li>
                            <input
                              type="radio"
                              id="all"
                              name="ViewBy"
                              value={'all'}
                              checked={selectedViewBy === 'all'}
                              onChange={(e) => dispatch(setSelectedViewBy(e.target.value))}
                            />
                            <label htmlFor="all">All</label>
                          </li>
                          {viewByMeta?.map((item) => {
                            return (
                              <li key={item?._id}>
                                <input
                                  type="radio"
                                  id={item?.label}
                                  value={item?.label}
                                  name="ViewBy"
                                  checked={selectedViewBy === item?.label}
                                  onClick={() => dispatch(setSelectedViewBy(item?.label))}
                                />
                                <label htmlFor={item?.label}>{item?.label}</label>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">{renderFields()}</div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!props?.bulk && !props?.add && props?.data && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  props.handleClose();
                  CustomConfirmAlert({
                    yes: () => handleDelete(),
                    heading: 'Are you sure?',
                    message: `Do you really want to delete this ${props?.data?.Name} record? This process cannot be undone.`,
                    noLabel: 'Cancel',
                    yesLabel: 'Delete',
                    loadingMessage: 'Deleting',
                    successMessage: `${props?.data?.Name} Deleted Successfully`,
                    errorMessage: `Error while Deleting ${props?.data?.Name}`,
                  });
                }}
                className="btn-bordered"
              >
                Delete
              </Button>
            )}
            <Button
              variant="secondary"
              type="button"
              onClick={props.handleClose}
              className="btn-bordered"
            >
              Close
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="btn-salesboost"
            >
              {props?.bulk ? 'Update' : 'Save Changes'}
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

export default EditForm;
