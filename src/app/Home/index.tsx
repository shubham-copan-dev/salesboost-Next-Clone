import { useEffect, useState } from "react";

import moment from "moment";

// import WelcomeBg from "@/assets/images/welcome-bg.png";
import Search from "@/components/UI/Search";

import "./home.css";

function Welcome() {
  // local states
  const [dateState, setDateState] = useState<string>(moment().format("hh:mm"));

  // handling live time
  useEffect(() => {
    setInterval(() => setDateState(moment().format("hh:mm")), 30000);
  }, []);

  return (
    <div
      className="welcome-wrapper min-vh-100"
      // style={{ backgroundImage: `url(${WelcomeBg})` }}
    >
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="time-wishing">
              <h2>{dateState}</h2>
              <h4>Good morning, James</h4>
            </div>
          </div>
          <div className="col-md-6">
            <div className="quote-top text-lg-right">
              <h5>Quote of the Day</h5>
              <p>“We grow fearless when we do the things we fear.”</p>
            </div>
          </div>
        </div>
      </div>

      <Search />

      <div className="recent-search">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="recent-heading">
                <span className="icons-clock"></span> RECENT SEARCHES
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6">
              <button className="button">Walmart TAAS</button>
            </div>
            <div className="col-md-4 col-sm-6">
              <button className="button">Walmart TAAS</button>
            </div>
            <div className="col-md-4 col-sm-6">
              <button className="button">Walmart TAAS</button>
            </div>
            <div className="col-md-4 col-sm-6">
              <button className="button">Walmart TAAS</button>
            </div>
            <div className="col-md-4 col-sm-6">
              <button className="button">Walmart TAAS</button>
            </div>
            <div className="col-md-4 col-sm-6">
              <button className="button">Walmart TAAS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
