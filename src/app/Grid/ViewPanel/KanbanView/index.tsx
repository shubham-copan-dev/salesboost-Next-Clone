/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { salesForce } from '@/axios/actions/salesForce';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateRecord } from '@/redux/slices/salesForce';
import { RecordsInterface } from '@/redux/slices/salesForce/interface';
import { CurrencyFormatter } from '@/utilities';

import EditForm from '../EditForm';
import './kanbanView.css';

interface GroupedList {
  title: string;
  items: RecordsInterface[];
}
[];

interface StageChanged {
  stage: string;
  item: RecordsInterface;
}

function KanbanView() {
  // use hooks
  const { tabId } = useParams();
  const dispatch = useAppDispatch();

  // use refs
  const dragItem = useRef<any>();
  const dragItemNode = useRef<any>();

  // global states
  const { records, columnMeta } = useAppSelector((state) => state.sales);

  // local states
  const [list, setList] = useState<GroupedList[]>();
  const [dragging, setDragging] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [clickedItem, setClickedItem] = useState<RecordsInterface | null>(null);
  const [itemDraggedTo, setItemDraggedTo] = useState<StageChanged | null>(null);
  const [draggable, setDraggable] = useState<boolean>(true);

  // handling drag end
  const handleDragEnd = () => {
    setDragging(false);
    dragItemNode.current.removeEventListener('dragend', handleDragEnd);
  };

  // handling drag start
  const handleDragStart = (
    e: any,
    item: { grpI: number; itemI: number; item: RecordsInterface }
  ) => {
    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  // handling drag enter
  const handleDragEnter = (
    e: any,
    targetItem: { grpI: number; itemI: number; grpTitle: string }
  ) => {
    console.log(targetItem.itemI, 'itemI');
    if (dragItemNode.current !== e.target) {
      setList((oldList) => {
        if (oldList) {
          const newList = [...oldList];
          const draggedItemObj = newList[dragItem.current.grpI].items.splice(
            dragItem.current.itemI,
            1
          )[0];
          setItemDraggedTo({ stage: newList[targetItem.grpI]?.title, item: draggedItemObj });

          newList[targetItem.grpI].items.splice(targetItem.itemI, 0, draggedItemObj);
          dragItem.current = targetItem;
          return newList;
        }
      });
    }
  };

  // handling on drop
  const onDrop = async () => {
    setDragging(false);
    setDraggable(false);
    try {
      await salesForce({
        method: 'PATCH',
        url: `sf/object/${tabId}/record/${itemDraggedTo?.item?.Id}`,
        data: {
          prop: {
            StageName: itemDraggedTo?.stage,
          },
        },
      });
      dragItem.current = null;
      dragItemNode.current = null;
      const newObj = { ...itemDraggedTo?.item, StageName: itemDraggedTo?.stage };
      dispatch(updateRecord(newObj));
      setItemDraggedTo(null);
      setDraggable(true);
      toast(`Stage have been updates successfully`);
    } catch (error) {
      setDraggable(true);
      console.log(error);
    }
  };

  // handling style
  const getStyles = (item: { grpI: number; itemI: number }) => {
    if (dragItem.current.grpI === item.grpI && dragItem.current.itemI === item.itemI) {
      return 'dnd-item';
    }
    return 'dnd-item';
  };

  // initial stage grouping
  useEffect(() => {
    if (columnMeta && records) {
      // creating array with all the available stages form column meta
      const stageData = columnMeta?.find(
        (fi) => fi?.type === 'picklist' && fi?.name === 'StageName'
      );
      const groupedList = stageData?.picklistValues?.map((item) => {
        return {
          title: item?.label,
          items: [],
        };
      });

      // grouping records with stage
      const groupArrayObject = records.reduce((group: any, arr) => {
        const { StageName } = arr;
        group[StageName] = group[StageName] ?? [];
        group[StageName].push(arr);
        return group;
      }, {});

      // final array with stages and items
      const newArray = groupedList?.map((item) => {
        const items = (groupArrayObject[item?.title] ?? []).sort(function (
          a: RecordsInterface,
          b: RecordsInterface
        ) {
          const aDate: any = new Date(a.CloseDate);
          const bDate: any = new Date(b.CloseDate);
          return aDate - bDate;
        });
        console.log(item?.title, items, 'items');
        return {
          title: item?.title,
          items: items,
        };
      });
      setList(newArray); // setting list
    }
  }, [records, columnMeta]);

  return (
    <div className="kanban-main">
      <div className="drag-n-drop">
        {list &&
          list?.map((grp, grpI) => (
            <div
              key={grp.title}
              onDragEnter={
                dragging && !grp.items.length
                  ? (e) =>
                      handleDragEnter(e, {
                        grpI,
                        itemI: 0,
                        grpTitle: grp.title,
                      })
                  : undefined
              }
              onDrop={dragging && grp.items.length <= 1 ? () => onDrop() : undefined}
              onDragOver={(e) => e.preventDefault()}
              className="dnd-group"
            >
              <div className="dnd-header d-flex align-items-center">
                <h3>{grp?.title}</h3>
                <div className="count d-flex align-items-center justify-content-center">
                  {grp?.items?.length}
                </div>
              </div>
              {grp?.items?.map((item, itemI) => (
                <div
                  draggable={draggable}
                  key={item?.Id}
                  onDragStart={(e) => handleDragStart(e, { grpI, itemI, item })}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={
                    dragging
                      ? (e) => {
                          handleDragEnter(e, {
                            grpI,
                            itemI,
                            grpTitle: grp.title,
                          });
                        }
                      : undefined
                  }
                  onClick={() => {
                    setClickedItem(item);
                    setShow(true);
                  }}
                  onDrop={onDrop}
                  className={dragging ? getStyles({ grpI, itemI }) : 'dnd-item'}
                >
                  <div className="item-header">
                    <div className="item-icon blue">{item?.Name?.[0]}</div>
                    <div className="item-heading">
                      <h4>{item?.Name}</h4>
                      <h5>{item?.Description}</h5>
                    </div>
                  </div>
                  <div className="item-row">
                    <div className="item-row-inner d-flex inner-row-top">
                      <div className="inner-row-head">
                        <h6>Quantity</h6>
                      </div>
                      <div className="inner-row-head">
                        <h6>Closed Date</h6>
                      </div>
                    </div>
                    <div className="item-row-inner d-flex">
                      <div className="inner-row-detail">
                        <p>{item?.TotalOpportunityQuantity ?? 0}</p>
                      </div>
                      <div className="inner-row-detail">
                        <p>{item?.CloseDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="item-row">
                    <div className="item-row-inner d-flex inner-row-top inner-row-bottom align-items-center">
                      <div className="inner-row-head">
                        <h6>Total Amount</h6>
                      </div>
                      <div className="price">
                        <h6>{CurrencyFormatter({ value: item.Amount })}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      {show && columnMeta && clickedItem && (
        <EditForm
          allColumnData={columnMeta}
          data={clickedItem}
          show={show}
          handleClose={() => setShow(false)}
        />
      )}
    </div>
  );
}

export default KanbanView;
