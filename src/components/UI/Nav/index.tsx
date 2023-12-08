import { useState, useEffect } from "react";
import { salesforce } from "@/axios/actions/salesforce";
import { NavInterface } from "@/redux/slices/common/interface";
import Link from "next/link";

import Profile from "../Profile";
import "./nav.css";
import { useQuery } from "react-query";

const handlingIcons = (type: string) => {
  switch (type) {
    case "Account":
      return <span className="nav-icon icons-account" />;
    case "Opportunity":
      return <span className="nav-icon icons-opportunity" />;

    default:
      return "";
  }
};

function Navigation() {
  // fetching tabs data
  const {
    isLoading,
    // error,
    data: navData,
  } = useQuery({
    queryKey: ["objects"],
    queryFn: () =>
      salesforce({ method: "GET", url: "objects" }).then(
        (resp) => resp?.data?.data
      ),
    refetchOnWindowFocus: false,
  });
  // local states
  const [profileModal, setProfileModal] = useState(false);

  // handling tab render
  const renderTabData = () => {
    return navData?.map((item: NavInterface) => {
      return (
        <li key={item?._id}>
          <Link href={`/dashboard/${item?.objectType}`}>
            {handlingIcons(item?.objectType)}
            <span>{item?.label}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <div className="leftnavigation">
      <a href="#" className="expand-button">
        <span></span>
      </a>
      <ul className="main-nav">
        <li>
          <Link href="/dashboard">
            <span className="nav-icon icons-home"></span>
            <span></span>
            <span>Home</span>
          </Link>
        </li>
        {isLoading ? <span>Loading...</span> : renderTabData()}
        <li>
          <Link href="/dashboard/lead">
            <span className="nav-icon icons-lead"></span>
            <span>Lead</span>
          </Link>
        </li>
        <li>
          <Link href="/dashboard/contact">
            <span className="nav-icon icons-contact"></span>
            <span>Contact</span>
          </Link>
        </li>
      </ul>
      {profileModal && (
        <Profile
          show={profileModal}
          handleClose={() => setProfileModal(false)}
        />
      )}
    </div>
  );
}

export default Navigation;
