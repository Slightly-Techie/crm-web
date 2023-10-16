type StatusCheckProps = {
  status: string;
};
function StatusCheck({ status }: StatusCheckProps) {
  if (status === "In Progress") {
    return (
      <section className="bg-status-check-yellow rounded-full text-center text-white w-[110px] lg:w-fit px-2 text-xs">
        In Progress
      </section>
    );
  }
}

export default StatusCheck;
