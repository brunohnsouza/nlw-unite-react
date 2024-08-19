import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Attendee } from "./pages/attendee/attendee";
import { Ticket } from "./pages/ticket/ticket";
import { GetTicket } from "./pages/ticket/steps/get-ticket";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Attendee />,
  },
  {
    path: "/ticket",
    element: <GetTicket />,
  },
  {
    path: "/ticket/:ticketId",
    element: <Ticket />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
