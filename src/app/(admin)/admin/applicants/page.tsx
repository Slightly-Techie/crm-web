"use client";

import { ApplicantsTableColumns } from "@/components/admin/applicants/ApplicantsTableCols";
import TableComponent from "@/components/admin/applicants/Table";
import { useApplicantHooks } from "@/hooks/useApplicantsHook";
import Loading from "../../loading";
import PageTitle from "@/components/PageTitle";

export default function Applicants() {
  const {
    tableData,
    mutation,
    message,
    filter,
    setFilter,
    page,
    setPage,
    isLoading,
    pages,
  } = useApplicantHooks();
  const dropdownActions = {
    view: "View Applicant",
    activate: "Activate Applicant",
    email: "Send Email",
  };

  function actionToPerform(payload: {
    action?: string;
    id?: number;
    email?: string;
  }) {
    switch (payload?.action) {
      case "activate-applicant":
        mutation.mutate(payload?.id!);
        break;
      case "send-email":
        (window as Window).location = `mailto:${payload?.email}`;
    }
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilter(event.target.value);
  }

  return (
    <>
      {message && (
        <div className="toast absolute left-0 top-0 right-0 bg-[green] h-[50px] flex justify-center items-center z-50">
          <p className="text-[white]">{message}</p>
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="interviewee-wrapper h-full bg-[white] w-full dark:bg-primary-dark dark:text-white relative bottom-0 top-0">
          <PageTitle title="Applicants" />
          <TableComponent
            columns={ApplicantsTableColumns}
            data={tableData}
            dropdownActions={dropdownActions}
            actionsToPerform={actionToPerform}
            ids={tableData?.map((e) => e?.id)}
            emails={tableData?.map((e) => e?.email)}
            searchIncluded
            value={filter}
            onChange={onChange}
          />
          {tableData?.length === 0 && (
            <div className="flex justify-center items-center h-[400px]">
              <p>No data found</p>
            </div>
          )}
          {typeof tableData?.length !== "undefined" &&
            tableData?.length > 0 && (
              <div>
                <PaginationComponent
                  page={page}
                  pages={pages}
                  setPage={setPage}
                />
              </div>
            )}
        </div>
      )}
    </>
  );
}

function PaginationComponent(props: PaginationProps) {
  return (
    <>
      <div className="py-3 flex px-2 justify-between">
        <p>
          Showing page {props.page} of {props.pages} pages
        </p>
        <div className="flex gap-5">
          <button
            disabled={typeof props.pages !== "undefined" && props.page <= 1}
            onClick={() => props.setPage?.(props.page - 1)}
            className=" dark:bg-[#232323] px-6 py-2 rounded-sm"
          >
            prev
          </button>
          <button
            disabled={
              typeof props.pages !== "undefined" && props.page >= props.pages
            }
            onClick={() => props.setPage?.(props.page + 1)}
            className="dark:bg-[#232323] px-6 py-2 rounded-sm"
          >
            next
          </button>
        </div>
      </div>
    </>
  );
}

interface PaginationProps {
  page: number;
  pages?: number | undefined;
  setPage?: (e: number) => void;
}
