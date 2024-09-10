export type CellValueFunction = (header: string, value: any) => string | undefined;

export type DataTableSearchInfo = {
  query: string;
  pageNumber: number;
};
