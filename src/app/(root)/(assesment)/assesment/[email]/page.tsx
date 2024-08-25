import TaskSubmissionForm from "./components/task-submission";

function AssesmentPage() {
  return (
    <div className="w-full h-full p-8">
      <div className="max-w-screen-sm mx-auto">
        <div>
          <h3 className="mt-5">CRM Task Submission</h3>
        </div>
        <hr className="my-5" />
        <div>
          <TaskSubmissionForm />
        </div>
      </div>
    </div>
  );
}

export default AssesmentPage;
