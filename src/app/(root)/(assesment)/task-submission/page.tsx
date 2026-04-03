"use client";

import TaskSubmissionForm from "../assesment/[email]/components/task-submission";

function TaskSubmissionPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full bg-surface-container-lowest border border-outline rounded-2xl p-6 md:p-12 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">assignment</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-2 font-headline">
            Technical Task Submission
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Complete your technical task to proceed with your application
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-surface-container border border-outline rounded-xl p-4 md:p-6 mb-6">
          <h2 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            Instructions
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-on-surface-variant">
            <li>Complete the technical task sent to your email</li>
            <li>Upload your solution to a public repository (GitHub, GitLab, etc.)</li>
            <li>Submit the repository URL and optional live demo link below</li>
            <li>Ensure your repository is publicly accessible</li>
          </ul>
        </div>

        {/* Form */}
        <TaskSubmissionForm />
      </div>
    </div>
  );
}

export default TaskSubmissionPage;
