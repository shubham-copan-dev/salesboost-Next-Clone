/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';

import { salesForce } from '@/axios/actions/salesForce';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  setAllFields,
  setColumnMeta,
  setCreateRecordPopup,
  setRecords,
  setViewByMeta,
} from '@/redux/slices/salesForce';

import EditForm from './EditForm';
import GridView from './GridView';
import KanbanView from './KanbanView';
import ViewHeader from './ViewHeader';
import './viewPanel.css';

function ViewPanel() {
  // use hooks
  const { tabId, viewId } = useParams();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // local states
  const [reSetValues, setReSetValues] = useState<number>(1);

  // constants
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  // global states
  const { panelView, createRecordPopup } = useAppSelector((state) => state.sales);

  // column data
  const {
    isLoading: columnIsLoading,
    data: columnData,
    refetch: columnRefetch,
  } = useQuery({
    queryKey: ['column', viewId, page, limit],
    queryFn: () =>
      salesForce({
        method: 'GET',
        url: `sf/object/metadata`,
        params: { id: viewId, filter: true },
      }).then((resp) => resp?.data?.data?.data?.columns),
    refetchOnWindowFocus: false,
  });

  // fetching view by data
  const { data: viewBy } = useQuery({
    queryKey: ['viewBy', tabId],
    queryFn: () =>
      salesForce({
        method: 'GET',
        url: `object/${tabId}/views`,
        params: { view: 'tab' },
      }).then((resp) => resp?.data?.data),
    refetchOnWindowFocus: false,
  });

  // column data
  const { data: allFields } = useQuery({
    queryKey: ['columnFilters', viewId],
    queryFn: () =>
      salesForce({
        method: 'GET',
        url: `sf/object/metadata`,
        params: { id: viewId, object: tabId, filter: false },
      }).then((resp) => resp?.data?.data?.data?.fields),
    refetchOnWindowFocus: false,
  });

  // records
  const {
    data: recordData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['fetchingRecords', viewId, page, limit],
    queryFn: () => {
      return salesForce({
        method: 'POST',
        url: `sf/object/records`,
        params: { id: viewId, page, perPage: limit },
      }).then((resp) => {
        return resp?.data?.data;
      });
    },
    refetchOnWindowFocus: false,
  });

  // handling view type render
  const handleViewRender = (view: string) => {
    switch (view) {
      case 'grid':
        return <GridView isFetching={isFetching} />;
      case 'kanban':
        return <KanbanView />;
      default:
        return null;
    }
  };

  // handling page change
  const handlePageChange = ({ selected }: { selected: number }) => {
    const page: any = selected + 1;
    // const queryParams = new URLSearchParams({
    //   page,
    // });

    // setSearchParams(queryParams);
    setSearchParams((searchPar) => {
      searchPar.set('page', page);
      return searchPar;
    });
    return selected;
  };

  // handling initial page
  const handlingInitial = () => {
    const page = searchParams.get('page');
    if (page) {
      return Number(page) - 1;
    } else return 0;
  };

  const handlingShowingRecords = () => {
    if (Number(page) === recordData?.totalPage) {
      const re2 = Number(limit) * Number(page);
      console.log(re2, 're2');
      const remain = re2 - recordData?.totalData;
      console.log(remain, 'remain');
      return re2 - remain;
    } else {
      return Number(limit) * Number(page);
    }
  };

  // handling table data rendering
  useEffect(() => {
    if (columnData) {
      dispatch(setColumnMeta(columnData));
    }
    if (recordData) {
      dispatch(setRecords(recordData?.data?.records));
    }
    if (allFields) {
      dispatch(setAllFields(allFields));
    }
    if (viewBy) {
      dispatch(setViewByMeta(viewBy));
    }
  }, [columnData, allFields, recordData, dispatch, reSetValues]);

  if (columnIsLoading && !viewId)
    return (
      <Spinner style={{ marginLeft: '50%', marginTop: '20%' }} animation="border" variant="dark" />
    );
  return (
    <>
      <div>
        <ViewHeader
          reFetch={() => {
            refetch();
            columnRefetch();
          }}
          reSetValues={() => setReSetValues((prev) => prev + 1)}
        />
        {handleViewRender(panelView)}
        <div className="pagination-wrap">
          <div className="field-limiter">
            <span>Show</span>
            <div className="control">
              <select
                value={limit ?? recordData?.perPage}
                onChange={(e) => {
                  setSearchParams((searchPar) => {
                    searchPar.set('limit', e?.target?.value);
                    searchPar.set('page', '1');
                    return searchPar;
                  });
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={60}>60</option>
                <option value={70}>70</option>
                <option value={80}>80</option>
                <option value={90}>90</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span className="limiter-text">items per page</span>
          </div>

          <div className="pagination-content">
            {recordData && (
              <div className="toolbar-number">
                Showing {Number(limit) * Number(page) - Number(limit) + 1} to{' '}
                {handlingShowingRecords()} of {recordData?.totalData} entries
              </div>
            )}
            <ReactPaginate
              className="custom-pagination pagination"
              previousLabel="< Prev"
              nextLabel="Next >"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              pageCount={recordData?.totalPage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
              forcePage={handlingInitial()}
            />
          </div>
        </div>
      </div>
      {columnData && (
        <EditForm
          allColumnData={columnData}
          show={createRecordPopup}
          handleClose={() => dispatch(setCreateRecordPopup(false))}
          add
          refetch={() => refetch()}
        />
      )}
    </>
  );
}

export default ViewPanel;
