import { AttendeeList } from "@/components/attendee-list";
import { AttendeeRegister } from "@/components/attendee-register";
import { Header } from "@/components/header";

export function Attendee() {
  return (
    <div className="attendee-page min-h-screen">
      <div className="max-w-[1216px] mx-auto px-4 py-5 flex flex-col gap-5">
        <Header />
        <hr />
        <AttendeeRegister eventId="a8882107-de98-4d09-924b-d728beb59822" />
        <hr />
        <AttendeeList eventId="a8882107-de98-4d09-924b-d728beb59822" />
      </div>
    </div>
  );
}
