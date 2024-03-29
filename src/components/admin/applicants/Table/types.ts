import { ColumnDef } from "@tanstack/react-table";

export interface TableProps {
  columns: ColumnDef<any, any>[];
  data: undefined | any[];
  searchIncluded?: boolean;
  searchAccessor?: string;
  noActions?: boolean;
  dropdownActions?: { [key: string]: string };
  emails?: string[];
  ids?: number[];
  actionsToPerform?: (payload: { action?: string; id?: number }) => void;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PopupActionProps {
  dropdownActions: { [key: string]: string };
  actionToPerform?: (par: { action?: string; id?: number }) => void;
  email?: string;
  selected?: boolean;
  onSelected?: (id: string | undefined) => void;
  id?: number;
  rowId?: string;
  selectedId?: string;
}
