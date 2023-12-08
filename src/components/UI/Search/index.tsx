/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { salesForce } from "@/axios/actions/salesForce";
import { useAppDispatch } from "@/hooks/redux";
import { setRecords } from "@/redux/slices/salesForce";

import "./search.css";

function Search() {
  // use hooks
  const dispatch = useAppDispatch();
  const { viewId } = useParams();

  // refs
  const isMounted = useRef(false);
  const checkUserTyping = useRef<any>(null);

  // local states
  const [inputValue, setInputValue] = useState<string>("");
  // const [loading, setLoading] = useState(false);

  // lifecycle hook
  useEffect(() => {
    if (isMounted.current) {
      if (inputValue?.length >= 3) {
        if (checkUserTyping.current) {
          clearTimeout(checkUserTyping.current);
          checkUserTyping.current = null;
        }
        // setLoading(true);
        checkUserTyping.current = setTimeout(() => {
          salesForce({
            method: "POST",
            url: `platform/search`,
            params: {
              id: viewId,
              q: inputValue,
            },
          }).then((data: any) => {
            if (data?.data?.data?.searchRecords?.length > 0)
              dispatch(setRecords(data?.data?.data?.searchRecords));
            // setLoading(false);
          });
        }, 800);
      } else if (inputValue?.length === 1) {
        if (checkUserTyping.current) {
          clearTimeout(checkUserTyping.current);
          checkUserTyping.current = null;
        }
        salesForce({
          method: "GET",
          url: `sf/object/records`,
          params: { id: viewId },
        }).then((resp: any) =>
          dispatch(setRecords(resp?.data?.data?.data?.records))
        );
      }
    } else isMounted.current = true;
  }, [inputValue, viewId, dispatch]);

  return (
    <div className="main-search">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="form-group has-search">
              <span className="icons-search"></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputValue(e.target.value)
                }
              />
              {inputValue?.length > 0 && (
                <span
                  className="icons-cross"
                  onClick={() => setInputValue("")}
                ></span>
              )}
            </div>
            {/* {loading && inputValue?.length > 2 && (
              <div className="autofill-search-box">
                <h5>Loading...</h5>
              </div>
            )} */}
            {/* <div className="autofill-search-box">
              <h5>Related Search</h5>
              <ul>
                <li>Walmart TAAS</li>
                <li>Walmart (3845667)</li>
                <li>Walmart Data Center</li>
                <li>Walmart -/yr/CL 1Yr</li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
