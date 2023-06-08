import React, { useState } from "react";
import { PopupActionProps, TableProps } from "./types";
import MenuIcon from "@/assets/icons/more.png";
import Search from "@/assets/icons/search.png";
import "./styles.css";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";

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
        className="table-wrapper"
        onClick={() => {
          if (selected) {
            setSelected((prev) => !prev);
            setSelectedId("");
          }
        }}
      >
        {props.searchIncluded && (
          <div className="flex border-2 gap-[5px] w-[50%] items-center mb-[20px] p-[10px] rounded-xl border-secondary">
            <Image src={Search} alt="search Icon" />
            <input
              type="text"
              placeholder="Search Name or Email"
              value={props.value}
              onChange={props.onChange}
              className="p-[15px] text-sm border-none focus:outline-none dark:bg-[#232323] dark:text-white w-full"
            />
          </div>
        )}
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, j) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="dark:bg-[#232323] dark:text-white"
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
    <>
      <div className="menu-wrapper" key={props.rowId}>
        <Image
          src={MenuIcon}
          alt="dropdown menu icon"
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
              <div className="menu-list dark:bg-[#232323] dark:border-[#353535] dark:text-white bg-white">
                {Object.entries(props.dropdownActions).map(([key, action]) => {
                  const actionText = action.replace(/\s+/g, "-").toLowerCase();
                  return (
                    <p
                      className="dark:bg-[#232323] dark:border-[#353535] dark:text-white dark:hover:bg-secondary hover:bg-[#e2e8f0]"
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
      </div>
    </>
  );
}

export default TableComponent;
