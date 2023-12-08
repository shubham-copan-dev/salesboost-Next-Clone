/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';

// import { ColumnRowGroupChangedEvent } from 'ag-grid-community';
// the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css';
// // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import {
  ColDef,
  ICellEditorParams,
  ICellRendererParams,
  ValueSetterParams,
} from 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';

import { salesForce } from '@/axios/actions/salesForce';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setEditedFields, setSelectedRows, updateRecord } from '@/redux/slices/salesForce';
import { capsLetter } from '@/utilities';
import { fieldTypes } from '@/utilities/constants';

import {
  ActionView,
  BooleanView,
  CurrencyView,
  DateTimeView,
  PickListView,
} from './CustomColumnView';
import DateTimeCell from './GridCustomFields/DateTimeCell';
import NumberField from './GridCustomFields/NumberField';
import './gridView.css';

function GridView({ isFetching }: { isFetching: boolean }) {
  // use hooks
  const dispatch = useAppDispatch();

  // use refs
  const gridRef: any = useRef();

  // global states
  const { columnMeta, records, selectedViewBy, viewByMeta, fieldUpdateMode } = useAppSelector(
    (state) => state.sales
  );
  const { fullscreen } = useAppSelector((state) => state.common);
  // local states
  const [isGrouped, setIsGrouped] = useState<boolean>(false);

  // constants
  const viewBySelected = viewByMeta?.find((fil) => fil?.label === selectedViewBy);
  const viewByNames = viewBySelected?.query?.fields?.map((item) => item?.name);

  // handling cell edit
  const onFieldEditDone = async (params: any) => {
    await salesForce({
      method: 'PATCH',
      url: `sf/object/${params?.data?.attributes?.type}/record/${params?.data?.Id}`,
      data: {
        prop: {
          [params?.column?.colId]: params?.newValue,
        },
      },
    });
  };

  // DefaultColDef sets props common to all Columns
  const defaultColDef = {
    // sortable: true,
    // filter: true,
    // enableRowGroup: true,
    // floatingFilter: false,
    filterParams: {
      // it can be assign to a particular cell also
      debouceMs: 1000, // when filtering, it
      // buttons: ['apply', 'clear', 'cancel', 'reset'],
    },
    resizable: true,
    // editable: true,
    // stopEditingWhenCellsLoseFocus: true,
  };

  // side filter bar
  // const sideBar: any = {
  //   toolPanels: [
  //     {
  //       id: 'columns',
  //       labelDefault: 'Columns',
  //       labelKey: 'columns',
  //       iconKey: 'columns',
  //       toolPanel: 'agColumnsToolPanel',
  //       minWidth: 225,
  //       // maxWidth: 200,
  //       width: 225,
  //     },
  //     {
  //       id: 'filters',
  //       labelDefault: 'Filters',
  //       labelKey: 'filters',
  //       iconKey: 'filter',
  //       toolPanel: 'agFiltersToolPanel',
  //       minWidth: 180,
  //       // maxWidth: 200,
  //       width: 250,
  //     },
  //   ],
  //   // hiddenByDefault: true,
  //   position: 'right',
  //   // defaultToolPanel: 'filters',
  // };

  // handling cell view
  const cellRendererSelector = (params: ICellRendererParams) => {
    switch (params?.colDef?.type) {
      case fieldTypes?.PICKLIST:
        return {
          component: PickListView,
          // params: { values: '' },
        };
      case fieldTypes?.BOOLEAN:
        return {
          component: BooleanView,
        };
      case fieldTypes?.CURRENCY:
        return {
          component: CurrencyView,
        };
      case fieldTypes?.DATE:
      case fieldTypes?.DATETIME:
        return {
          component: DateTimeView,
        };
      default:
        return undefined;
    }
  };

  // handling editor cell
  const cellEditorSelector = (params: ICellEditorParams, pickList?: string[]) => {
    // console.log(params, 'params');
    switch (params?.colDef?.type) {
      case fieldTypes?.PICKLIST:
        return {
          component: 'agRichSelectCellEditor',
          params: { values: pickList },
          popup: true,
        };
      case fieldTypes?.TEXTAREA:
        console.log('textarea');
        return {
          component: 'agLargeTextCellEditor',
          params: {
            maxLength: 250,
            rows: 10,
            cols: 50,
          },
          popup: true,
        };
      // case fieldTypes?.BOOLEAN:
      //   return {
      //     component: BooleanView,
      //   };
      case fieldTypes?.CURRENCY:
      case fieldTypes?.DOUBLE:
      case fieldTypes?.INT:
        return {
          component: NumberField,
        };
      case fieldTypes?.DATE:
      case fieldTypes?.DATETIME:
        return {
          component: DateTimeCell,
        };
      default:
        return {
          component: 'agTextCellEditor',
          params: {
            maxLength: 56,
          },
        };
    }
  };

  // handling filter types
  const handleFilterType = (type: string, isFilterable: boolean) => {
    if (isFilterable) {
      switch (type) {
        case fieldTypes?.PICKLIST:
          return true;

        case fieldTypes?.CURRENCY:
        case fieldTypes?.DOUBLE:
        case fieldTypes?.INT:
          return 'agNumberColumnFilter';

        case fieldTypes?.STRING:
        case fieldTypes?.TEXTAREA:
        case fieldTypes?.REFERENCE:
          return 'agTextColumnFilter';

        case fieldTypes?.DATE:
        case fieldTypes?.DATETIME:
          return 'agDateColumnFilter';

        default:
          return false;
      }
    }
    return false;
  };

  // creating columns defs
  const handlingColumnDefs = (): ColDef[] | undefined => {
    if (columnMeta) {
      const newColumnMeta = columnMeta
        ?.filter?.((fil) =>
          selectedViewBy === 'all' ? fil?.uiMetadata?.isVisible : viewByNames?.includes(fil?.name)
        )
        ?.sort((a, b) => {
          return (a?.uiMetadata?.columnOrder ?? 0) - (b?.uiMetadata?.columnOrder ?? 0);
        })
        ?.map((item) => {
          return {
            field: item?.name,
            headerName: capsLetter(item?.label),
            editable: item?.updateable,
            filter: handleFilterType(item?.type, item?.filterable),
            filterParams:
              item?.type === fieldTypes?.DATE || item?.type === fieldTypes?.DATETIME
                ? {
                    comparator: (dateFromFilter: any, cellValue: any) => {
                      if (cellValue == null) {
                        return 0;
                      }

                      const dateParts = cellValue.split('-');
                      const year = Number(dateParts[0]);
                      const month = Number(dateParts[1]) - 1;
                      const day = Number(dateParts[2]);
                      const cellDate = new Date(year, month, day);

                      if (cellDate < dateFromFilter) return -1;
                      else if (cellDate > dateFromFilter) return 1;
                      return 0;
                    },
                  }
                : undefined,
            floatingFilter: true,
            sortable: item?.sortable,
            enableRowGroup: item?.groupable,
            maxWidth: item?.uiMetadata?.width,
            pinned: false,
            cellClass: 'custom-cell',
            cellRendererSelector: cellRendererSelector,
            cellEditorSelector: (params: ICellEditorParams) =>
              cellEditorSelector(
                params,
                item?.picklistValues?.map((pick) => pick?.label)
              ),
            enableCellChangeFlash: true,
            type: item?.type,
            valueSetter: (params: ValueSetterParams) => {
              const newObj = { ...params.data, [item?.name]: params.newValue };
              dispatch(updateRecord(newObj));
              if (fieldUpdateMode === 'submit') {
                dispatch(
                  setEditedFields({
                    id: params.data.Id,
                    attributes: {
                      type: params.data.attributes.type,
                    },
                    [item?.name]: params.newValue,
                  })
                );
              } else {
                toast.promise(onFieldEditDone(params), {
                  loading: 'Updating',
                  success: 'Record updated successfully',
                  error: 'An error occur while updating the record',
                });
              }
              params.data[item.name] = params.newValue;
              return true;
            },
          };
        });
      if (isGrouped) {
        return newColumnMeta;
      } else {
        return [
          {
            headerName: 'Action',
            cellClass: 'custom-cell',
            cellRenderer: ActionView,
            cellRendererParams: {
              allColumnData: columnMeta,
            },
            colId: 'action',
            editable: false,
            maxWidth: 100,
            filter: false,
            type: 'editForm',
            pinned: 'left',
            headerCheckboxSelection: true,
            checkboxSelection: true,
          },
          ...newColumnMeta,
        ];
      }
    }
  };

  // handling grouped
  const handleGrouped = (props: any) => {
    // eslint-disable-next-line react/prop-types
    setIsGrouped(props?.columns?.length > 0);
  };

  // handling row select
  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    dispatch(setSelectedRows(selectedRows));
  }, []);

  if (isFetching)
    return (
      <Spinner
        style={{ marginLeft: '50%', marginTop: '20%', marginBottom: '10%' }}
        animation="border"
        variant="dark"
      />
    );
  return (
    <div
      // className={`ag-theme-alpine${themeMode === 'dark' ? '-dark' : ''}`}
      className={`ag-theme-alpine`}
      style={{
        width: '100%',
        height: fullscreen ? '100vh' : 700,
      }}
    >
      <AgGridReact
        ref={gridRef} // Ref for accessing Grid's API
        rowGroupPanelShow="always"
        enableCellChangeFlash={true}
        stopEditingWhenCellsLoseFocus={true}
        // sideBar={sideBar}
        className="custom-ag-grid"
        rowClass="custom-row"
        // onCellValueChanged={onFieldEditDone}
        onColumnRowGroupChanged={handleGrouped}
        popupParent={document.body} // it will let the filter popup render properly, even if table height is less
        rowData={records} // Row Data for Rows
        columnDefs={handlingColumnDefs()} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection="multiple" // Options - allows click selection of rows
        suppressRowClickSelection={true}
        // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        // onDisplayedColumnsChanged={(event) => console.log(event, 'event')}
        onSelectionChanged={onSelectionChanged}
        singleClickEdit={true}
        // pagination={true}
        // paginationPageSize={10}
        // onPaginationChanged={(pa: any) => console.log(pa, 'pagination')}
      />
    </div>
  );
}

export default GridView;
