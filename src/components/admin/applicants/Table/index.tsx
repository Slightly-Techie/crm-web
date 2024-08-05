import React, { useState } from "react";
import { PopupActionProps, TableProps } from "./types";
import Search from "@/assets/icons/search.png";
import "./styles.css";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";

import { CiMenuKebab } from "react-icons/ci";

function TableComponent(props: TableProps) {
  const [selected, setSelected] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>("");
  const data = props.data || [];
  const columns = props.columns || [];

  function onSelected(id: string | undefined) {
    if (selectedId === id) {
      setSelected((prev) => !prev);
    } else {
      setSelected(true);
    }
    setSelectedId(id);
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div
        className="table-wrapper p-2"
        onClick={() => {
          if (selected) {
            setSelected((prev) => !prev);
            setSelectedId("");
          }
        }}
      >
        {props.searchIncluded && (
          <div className="flex border mt-12 gap-[5px] w-[50%] items-center mb-[20px] p-[10px] rounded-md border-neutral-700">
            <Image src={Search} alt="search Icon" />
            <input
              type="text"
              placeholder="Search Name or Email"
              value={props.value}
              onChange={props.onChange}
              className="text-sm border-none focus:outline-none bg-transparent dark:text-white w-full"
            />
          </div>
        )}
        <table className="">
          <thead className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className=" text-base py-2 bg-st-edge font-semibold dark:bg-[#232323] px-2 rounded-sm"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
                <th className=" text-base py-2 bg-st-edge font-bold dark:bg-[#232323] px-2 rounded-sm"></th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, j) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`p-2 dark:text-white text-base font-light`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {!props.noActions &&
                  typeof props.dropdownActions !== "undefined" && (
                    <PopupAction
                      selected={selected}
                      onSelected={onSelected}
                      rowId={row.id}
                      selectedId={selectedId}
                      dropdownActions={props.dropdownActions}
                      id={props.ids && props.ids[j]}
                      email={props.emails && props.emails[j]}
                      actionToPerform={props.actionsToPerform}
                    />
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function PopupAction(props: PopupActionProps) {
  const actions = {
    id: props.id,
    email: props.email,
  };

  return (
    <td className="menu-wrapper" key={props.rowId}>
      <CiMenuKebab
        size={20}
        className="menu-image"
        onClick={() => {
          if (props.selectedId === props.rowId) {
            props.onSelected?.("");
          }
          props.onSelected?.(props.rowId);
        }}
      />
      {props.rowId === props.selectedId && (
        <>
          {props.selected && (
            <div className="menu-list dark:bg-[#232323] dark:border-st-edgeDark dark:text-white bg-white">
              {Object.entries(props.dropdownActions).map(([key, action]) => {
                const actionText = action.replace(/\s+/g, "-").toLowerCase();
                return (
                  <p
                    className="dark:bg-[#232323] dark:hover:bg-st-edgeDark dark:border-st-edgeDark dark:text-white dark:hover:text-primary-light dark:hover:bg-secondary hover:bg-neutral-100"
                    key={key}
                    onClick={() => {
                      props.actionToPerform?.({
                        ...actions,
                        action: actionText,
                      });
                      props.onSelected?.("");
                    }}
                  >
                    {action}
                  </p>
                );
              })}
            </div>
          )}
        </>
      )}
    </td>
  );
}

export default TableComponent;
