import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminEvents from "@/components/Events/AdminEvents";
// import AdminEvents from "@/components/event";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Gaibandha Students Association, SUST",
  description:
    "This is the events page of Gaibandha Students Association, SUST",
};

const EventsPage = () => {
  return (
    <>
      {/* <Breadcrumb pageName="Tables" /> */}

      <div className="flex flex-col gap-10">
        {/* <AdminEvents/> */}
        <AdminEvents />
      </div>
    </>
  );
};

export default EventsPage;
