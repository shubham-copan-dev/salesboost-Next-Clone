/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useRef, useState } from 'react';
import { Dropdown, Form, ListGroup, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { salesForce } from '@/axios/actions/salesForce';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setColumnMeta, updateColumnMeta, updateGridTabs } from '@/redux/slices/salesForce';

function ManageColumns({ onHide }: { onHide: () => void }) {
  // use hooks
  const { viewId } = useParams();
  const dispatch = useAppDispatch();

  // use refs
  const dragItemNode = useRef<any>();
  const dragItem = useRef<any>();

  // global states
  const { columnMeta, selectedViewBy, viewByMeta, gridTabs } = useAppSelector(
    (state) => state.sales
  );

  // constants
  const currentTab = gridTabs?.find((fi) => fi?._id === viewId);
  let labels: { [key: string]: string } = {};
  columnMeta?.map((item) => {
    labels = { ...labels, [item.name]: item?.label };
  });

  const viewBySelected = viewByMeta?.find((fil) => fil?.label === selectedViewBy);
  const viewByNames = viewBySelected?.query?.fields?.map((item) => item?.name);

  // local states
  const [onGoingRequests, setOnGoingRequests] = useState<string[]>([]);
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragEnteredPosition, setDragEnteredPosition] = useState<number | null>(null);

  // handling column
  const handleColumn = async (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;
    const copyObj = columnMeta?.find((fi) => fi?.name === name);
    if (copyObj) {
      if (currentTab && !onGoingRequests?.includes(name)) {
        const newFields = currentTab?.query?.fields?.map((item) => {
          if (copyObj?.name === item?.name) {
            return {
              ...item,
              isVisible: checked,
            };
          }
          return item;
        });
        dispatch(
          updateGridTabs({ ...currentTab, query: { ...currentTab.query, fields: newFields } })
        );
        setOnGoingRequests((prev) => [...prev, name]);
        await salesForce({
          method: 'PATCH',
          url: `metadata/field/${viewId}`,
          data: {
            query: {
              fields: newFields,
            },
          },
        });
        setOnGoingRequests((prev) => {
          const copy = [...prev];
          const index = copy?.findIndex((fi) => fi === name);
          copy?.splice(index, 1);
          return copy;
        });
      }
      dispatch(
        updateColumnMeta({ ...copyObj, uiMetadata: { ...copyObj.uiMetadata, isVisible: checked } })
      );
    }
  };

  // handling checked
  const handleChecked = (name: string) => {
    const copyObj = columnMeta?.find((fi) => fi?.name === name);
    return copyObj?.uiMetadata?.isVisible;
  };

  // handling drag end
  const handleDragEnd = () => {
    setDragging(false);
    setDragEnteredPosition(null);
    dragItemNode.current.removeEventListener('dragend', handleDragEnd);
  };

  // handling dragging
  const handleDragStart = (e: any, item: { itemI: number }) => {
    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  // handling drag enter
  const handleDragEnter = (e: any, targetItem: { itemI: number }) => {
    if (dragItemNode.current !== e.target) {
      setDragEnteredPosition(targetItem?.itemI);
    }
  };

  // handling on drop
  const onDrop = async (e: any, targetItem: { itemI: number }) => {
    setDragging(false);
    if (dragItemNode.current !== e.target) {
      if (currentTab) {
        const name = currentTab.query.fields?.[dragItem?.current?.itemI]?.name;
        const copyFields = [...currentTab.query.fields];
        const moveElements = (index1: number, index2: number) => {
          // [copyFields[index1], copyFields[index2]] = [copyFields[index2], copyFields[index1]]; // this to switch
          copyFields.splice(index2, 0, copyFields.splice(index1, 1)[0]); // this is to move
        };
        moveElements(dragItem?.current?.itemI, targetItem?.itemI);
        const newFields = copyFields?.map((item, i: number) => {
          return {
            ...item,
            columnOrder: i + 1,
          };
        });

        dispatch(
          updateGridTabs({ ...currentTab, query: { ...currentTab.query, fields: newFields } })
        );
        setOnGoingRequests((prev) => [...prev, name]);
        await salesForce({
          method: 'PATCH',
          url: `metadata/field/${viewId}`,
          data: {
            query: {
              fields: newFields,
            },
          },
        });
        setOnGoingRequests((prev) => {
          const copy = [...prev];
          const index = copy?.findIndex((fi) => fi === name);
          copy?.splice(index, 1);
          return copy;
        });

        let newOrder: { [key: string]: number } = {};
        newFields?.map((item) => {
          newOrder = { ...newOrder, [item.name]: item.columnOrder };
        });

        const newColumnMeta = columnMeta?.map((item) => {
          if (newOrder?.[item.name] >= 0) {
            return {
              ...item,
              uiMetadata: {
                ...item?.uiMetadata,
                columnOrder: newOrder?.[item.name],
              },
            };
          }
          return item;
        });

        dispatch(setColumnMeta(newColumnMeta));

        dragItem.current = null;
        dragItemNode.current = null;
        setDragEnteredPosition(null);
      }
    }
  };

  // handling render list
  const renderList = () => {
    return currentTab?.query?.fields
      ?.filter?.((fil) => (selectedViewBy === 'all' ? fil : viewByNames?.includes(fil?.name)))
      ?.sort((a, b) => {
        return (a?.columnOrder ?? 0) - (b?.columnOrder ?? 0);
      })
      .map((item, itemI: number) => {
        return (
          <ListGroup.Item
            key={item?.name}
            draggable={selectedViewBy === 'all'}
            onDragStart={(e) => handleDragStart(e, { itemI })}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragEnter={
              dragging
                ? (e) => {
                    handleDragEnter(e, {
                      itemI,
                    });
                  }
                : undefined
            }
            onDrop={(e) => {
              onDrop(e, {
                itemI,
              });
            }}
          >
            <span className="icons-dots"></span>
            <Form.Check
              className="form-group-checkbox"
              type="checkbox"
              id={item?.name}
              name={item?.name}
              style={{ marginRight: '10px' }}
              checked={handleChecked(item?.name)}
              onChange={handleColumn}
              label={labels?.[item.name]}
            />
            {dragEnteredPosition === itemI && <p className="dragging-line"></p>}
            {onGoingRequests?.includes(item.name) && (
              <Spinner
                style={{ height: '10px', width: '10px' }}
                animation="border"
                variant="dark"
              />
            )}
          </ListGroup.Item>
        );
      });
  };

  return (
    <>
      <Dropdown.Menu className="custom-dropdown-menu" show>
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-heading-content">
              <h3 className="modal-title">Manage Columns</h3>
              {/* <p>Deep dive into data by setting up your perefrences.</p> */}
            </div>
            <button type="button" className="close" onClick={onHide}>
              <span className="icons-cross"></span>
            </button>
          </div>
        </div>
        <ListGroup>{renderList()}</ListGroup>
      </Dropdown.Menu>
    </>
  );
}

export default ManageColumns;
