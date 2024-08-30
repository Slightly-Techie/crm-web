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
        <h4 className="mt-10 text-gray-600 font-bold text-lg">
          Thank you for Completing & Submitting your Project. Please wait as
          your Project is being Evaluated. You will be contacted on your
          Acceptance Status. Thank you
        </h4>
      </div>
    </div>
  );
}

export default AssesmentPage;
