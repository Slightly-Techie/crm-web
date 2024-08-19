type StatusCheckProps = {
  status?: string;
  project_type?: string;
  priority?: string;
};
function StatusCheck({ project_type, priority, status }: StatusCheckProps) {
  switch (project_type) {
    case "COMMUNITY":
      return (
        <section className="bg-[#9d4edd] rounded-full text-center text-white w-[110px] px-2 py-1 text-xs">
          COMMUNITY
        </section>
      );
    case "PAID":
      return (
        <section className="bg-[#e0aaff] rounded-full text-center text-black w-[110px] px-2 py-1 text-xs">
          PAID
        </section>
      );
  }
  switch (priority) {
    case "HIGH PRIORITY":
      return (
        <section className="bg-[#274c77] rounded-full text-center text-white w-[110px] px-2 py-1 text-xs">
          HIGH
        </section>
      );
    case "LOW PRIORITY":
      return (
        <section className="bg-[#c3dcf1] rounded-full text-center text-black w-[110px] px-2 py-1 text-xs">
          LOW
        </section>
      );
    case "MEDIUM PRIORITY":
      return (
        <section className="bg-[#6096ba] rounded-full text-center text-white w-[110px] px-2 py-1 text-xs">
          MEDIUM
        </section>
      );
  }
  switch (status) {
    case "IN PROGRESS":
      return (
        <section className="bg-[#fab92b] rounded-full text-center text-white w-[110px] px-2 py-1 text-xs">
          In progress
        </section>
      );
    case "  COMPLETED":
      return (
        <section className="bg-[#c3dcf1] rounded-full text-center text-black w-[110px] px-2 py-1 text-xs">
          Completed
        </section>
      );
    case "WITHELD":
      return (
        <section className="bg-[#6096ba] rounded-full text-center text-white w-[110px] px-2 py-1 text-xs">
          Witheld
        </section>
      );
  }
}

export default StatusCheck;
