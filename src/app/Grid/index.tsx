import { SetStateAction, useEffect, useState } from 'react';
import { Spinner, Tab, Tabs } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { salesForce } from '@/axios/actions/salesForce';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  setColumnMeta,
  setGridTabs,
  setLimit,
  setRecords,
  setSelectedViewBy,
} from '@/redux/slices/salesForce';
import { TabInterface } from '@/redux/slices/salesForce/interface';

import AddNewTab from './AddNewTab';
import './grid.css';

export default function Grid() {
  // use hooks
  const { tabId, viewId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [, setSearchParams] = useSearchParams();

  // fetching tabs data
  const {
    data: tabData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['nav', tabId],
    queryFn: () => {
      return salesForce({
        method: 'GET',
        url: `object/${tabId}/views`,
        params: { view: 'grid' },
      }).then((resp) => {
        return resp?.data?.data;
      });
    },
    refetchOnWindowFocus: false,
  });

  // global states
  const { reFetchTabs } = useAppSelector((state) => state?.sales);

  // local states
  const [activeTab, setActiveTab] = useState<number | string>(0);
  const [addTabModal, setAddTabModal] = useState<boolean>(false);

  // handling tabs
  const renderTabData = () => {
    return tabData?.map((item: TabInterface, i: number) => {
      return (
        <Tab key={item?._id} eventKey={i} title={item?.label} className="custom-tab-content">
          <Outlet />
        </Tab>
      );
    });
  };

  // handling tab changes
  const handleChange = (tab: string | SetStateAction<number> | null) => {
    if (typeof tab === 'string' || typeof tab === 'number') {
      setActiveTab(tab);
      dispatch(setRecords(null));
      dispatch(setColumnMeta(null));
      dispatch(setSelectedViewBy('all'));
      dispatch(setLimit(tabData?.[Number(tab)]?.query?.limit ?? 20));
      navigate(
        `${tabData?.[Number(tab)]?._id}?page=1&limit=${tabData?.[Number(tab)]?.query?.limit ?? 20}`
      );
    }
  };

  // handling routes
  useEffect(() => {
    if (!viewId && tabData) {
      if (tabData?.[0]?.sfObject === tabId) {
        navigate(`${tabData?.[0]?._id}?page=1&limit=${tabData?.[0]?.query?.limit}`);
      }
    } else if (tabData) {
      const ind = tabData?.findIndex((item: TabInterface) => item?._id === viewId) ?? 0;
      setSearchParams((searchParams) => {
        searchParams.set('limit', tabData?.[ind]?.query?.limit?.toString());
        return searchParams;
      });
      setActiveTab(ind);
      dispatch(setGridTabs(tabData));
    }
  }, [viewId, navigate, tabData]);

  // handling reFetch tabs
  useEffect(() => {
    if (reFetchTabs > 1) {
      refetch();
    }
  }, [reFetchTabs]);

  // handling loading
  if (isLoading)
    return (
      <Spinner style={{ marginLeft: '50%', marginTop: '20%' }} animation="border" variant="dark" />
    );
  return (
    <>
      <div className="min-vh-100 dashboard-inner-wrapper" style={{ paddingTop: '0px' }}>
        <Tabs
          activeKey={activeTab}
          id="uncontrolled-tab-example"
          className="grid-tabbing"
          onSelect={handleChange}
        >
          {renderTabData()}
          {!tabData && (
            <Tab
              title={
                <Spinner
                  style={{ height: '15px', width: '15px' }}
                  animation="border"
                  variant="dark"
                />
              }
              className="custom-tab-content"
            />
          )}
          <Tab
            title="+"
            className="custom-tab-content"
            tabAttrs={{ onClick: () => setAddTabModal(true) }}
          />
        </Tabs>
      </div>
      {addTabModal && (
        <AddNewTab
          show={addTabModal}
          onHide={() => setAddTabModal(false)}
          refetch={() => refetch()}
        />
      )}
    </>
  );
}
