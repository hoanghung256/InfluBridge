import { HiArrowNarrowUp } from "react-icons/hi";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
    return (
        <div className="">
            <button onClick={() => window.scrollTo(0, 0)} className="btn-go-to-top">
                {/* <HiArrowNarrowUp className="narrow-up" /> */}
            </button>
            <div className="main-content w-100 bg-white" style={{ height: "100vh" }}>
                {/* <NavbarLayout /> */}
                <div className="d-inline position-relative w-100">
                    <div className="">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
