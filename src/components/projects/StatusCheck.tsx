type StatusCheckProps = {
  status?: string;
  project_type?: string;
  priority?: string;
};
function StatusCheck({ project_type, priority }: StatusCheckProps) {
  switch (project_type) {
    case "COMMUNITY":
      return (
        <section className="bg-status-check-yellow rounded-full text-center text-white w-[110px] lg:w-fit px-2 text-xs">
          COMMUNITY
        </section>
      );
  }
  switch (priority) {
    case "HIGH PRIORITY":
      return (
        <section className="bg-status-check-danger rounded-full text-center text-white w-[110px] lg:w-fit px-2 text-xs">
          HIGH PRIORITY
        </section>
      );
  }
}

export default StatusCheck;
