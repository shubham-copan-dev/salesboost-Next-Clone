/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dropdown } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector } from '@/hooks/redux';
import { removeEmptyFields } from '@/utilities';

import { fieldSwitch } from '../EditForm';
import '../viewPanel.css';

function Filters({ onHide }: { onHide: () => void }) {
  // use hooks
  const [searchParams, setSearchParams] = useSearchParams();

  // global states
  const { columnMeta, selectedViewBy, viewByMeta } = useAppSelector((state) => state.sales);

  //   constants
  const viewBySelected = viewByMeta?.find((fil) => fil?.label === selectedViewBy);
  const viewByNames = viewBySelected?.query?.fields?.map((item) => item?.name);

  // use hook form
  const { handleSubmit, control, reset } = useForm({
    defaultValues: Object.fromEntries(searchParams),
    shouldUnregister: true,
    resetOptions: {
      keepDirtyValues: false,
      keepErrors: false,
      keepDefaultValues: false,
    },
  });

  // handling submit
  const onSubmit = (data: any) => {
    const values = removeEmptyFields(data);
    const queryParams = new URLSearchParams(values);
    setSearchParams(queryParams);
    onHide();
  };

  // handling query params and fields reset
  const resetFilter = () => {
    setSearchParams();
    const resetFields: { [key: string]: string } = {};
    columnMeta
      ?.filter?.((fil) => {
        return selectedViewBy === 'all'
          ? fil?.uiMetadata?.isVisible
          : viewByNames?.includes(fil?.name);
      })
      ?.map((item) => (resetFields[item?.name] = ''));
    reset(resetFields);
  };

  // handling form field rendering
  const renderFields = () => {
    return columnMeta
      ?.filter?.((fil: any) => {
        return selectedViewBy === 'all'
          ? fil?.uiMetadata?.isVisible
          : viewByNames?.includes(fil?.name);
      })
      ?.map((item: any) => fieldSwitch(item?.type, item, control, true));
  };

  return (
    <>
      <Dropdown.Menu className="custom-dropdown-menu filters" show>
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-heading-content">
              <h3 className="modal-title">Filters</h3>
              <p>Deep dive into data by setting up your perefrences.</p>
            </div>
            <button type="button" className="close" onClick={onHide}>
              <span className="icons-cross"></span>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="msform">
            <div className="modal-body">
              <div className="row">{renderFields()}</div>
            </div>
            <div className="modal-footer">
              <Button variant="outline-primary" type="button" onClick={resetFilter}>
                Reset
              </Button>
              <Button variant="primary" type="submit">
                Apply Filter
              </Button>
            </div>
          </form>
        </div>
      </Dropdown.Menu>
    </>
  );
}

export default Filters;
