import React from "react";
import TableComponent from "../../components/Table/Table";
import { ApplicantsTableColumns } from "./ApplicantsTableCols";
import { useApplicantHooks } from "./hooks";

function Applicants() {
  const { tableData, mutation, message } = useApplicantHooks();
  const dropdownActions = {
    view: "View Applicant",
    activate: "Activate Applicant",
  };

  function actionToPerform(payload: any) {
    switch (payload?.action) {
      case "view-applicant":
        console.log("viewing", payload?.id);
        break;
      case "activate-applicant":
        mutation.mutate(payload?.id);
    }
  }

  return (
    <>
      {message && (
        <div className="toast absolute left-0 top-0 right-0 bg-[green] h-[50px] opacity-50 flex justify-center items-center">
          <p className="text-[white]">{message}</p>
        </div>
      )}
      <div className="interviewee-wrapper bg-[white] w-[90%] p-[20px]">
        <h1 className="text-[#3D4450] font-normal text-xl">Applicants</h1>
        <TableComponent
          columns={ApplicantsTableColumns}
          data={tableData}
          searchIncluded
          dropdownActions={dropdownActions}
          actionsToPerform={actionToPerform}
          ids={tableData?.map((e) => e?.id)}
        />
        {tableData?.length === 0 && (
          <div className="flex justify-center items-center h-[400px]">
            <p>No data yet</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Applicants;
