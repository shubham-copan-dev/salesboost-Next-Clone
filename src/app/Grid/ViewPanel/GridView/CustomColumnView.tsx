import { useState } from 'react';
import { Button } from 'react-bootstrap';

import { ICellEditorParams } from 'ag-grid-community';

import { ColumnMetaInterface, RecordsInterface } from '@/redux/slices/salesForce/interface';
import { CurrencyFormatter } from '@/utilities';

import EditForm from '../EditForm';

export function CurrencyView(props: ICellEditorParams) {
  const isValueInt = Number(props.value);
  if (isValueInt)
    return <div className="text-right">{CurrencyFormatter({ value: isValueInt })}</div>;
  return props.value;
}

export function PickListView(props: ICellEditorParams) {
  return (
    <div className="">
      {/* error */}
      <div className="d-flex justify-content-between align-items-center">
        {props.value ?? 'Not Assigned'} <span className="icons-down-arrow-fill"></span>
      </div>
    </div>
  );
}

export function DateTimeView(props: ICellEditorParams) {
  return (
    <div className="d-flex justify-content-between align-items-center">
      {props.value} <span className="icons-calender"></span>
    </div>
  );
}

export function ActionView(props: {
  allColumnData: ColumnMetaInterface[];
  data: RecordsInterface;
}) {
  // local states
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <Button variant="light" onClick={() => setShow(true)}>
        <span className="icons icons-edit"></span>
      </Button>
      {show && (
        <EditForm
          allColumnData={props?.allColumnData}
          data={props.data}
          show={show}
          handleClose={() => setShow(false)}
        />
      )}
    </>
  );
}

export function BooleanView(props: ICellEditorParams) {
  if (props.value === true || props.value === 1 || props.value === 'true')
    return (
      <div className="form-group-checkbox">
        <input readOnly disabled checked type="checkbox" id={props?.data?.Id} />
        <label htmlFor={props?.data?.Id}></label>
      </div>
    );
  else if (!props.value || props.value === 'false')
    return (
      <div className="form-group-checkbox">
        <input readOnly disabled type="checkbox" id={props?.data?.Id} />
        <label htmlFor={props?.data?.Id}></label>
      </div>
    );
  return <p>{props.value}</p>;
}
