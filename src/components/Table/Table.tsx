import React, { useState } from "react";
import { PopupActionProps, TableProps } from "./types";
import MenuIcon from "../../assets/icons/more.png";
import "./styles.css";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

function TableComponent(props: TableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
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
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="table-wrapper">
        {props.searchIncluded && (
          <div>
            <DebouncedInput
              // type="text"
              placeholder="Search Name"
              value={globalFilter ?? ""}
              onChange={(value) => {
                setGlobalFilter(String(value));
                console.log("val", globalFilter);
              }}
              className="p-[15px] text-sm border-2 focus:outline-none focus:ring focus:border-blue-300 border-gray-400 m-[10px]"
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
                  <td key={cell.id}>
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
  };

  return (
    <>
      <div className="menu-wrapper" key={props.rowId}>
        <img
          src={MenuIcon}
          alt="dropdown menu icon"
          onClick={() => props.onSelected?.(props.rowId)}
        />
        {props.rowId === props.selectedId && (
          <>
            {props.selected && (
              <div className="menu-list">
                {Object.entries(props.dropdownActions).map(([key, action]) => {
                  const actionText = action.replace(/\s+/g, "-").toLowerCase();
                  return (
                    <p
                      key={key}
                      onClick={() =>
                        props.actionToPerform?.({
                          ...actions,
                          action: actionText,
                        })
                      }
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

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default TableComponent;
