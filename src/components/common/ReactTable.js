import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination, useRowSelect, Row } from 'react-table';


const GlobalFilter = ({ filter, setFilter }) => {
  return (<input value={filter || ""} onChange={(e) => setFilter(e.target.value)} placeholder="Search.." />)
};

function ReactTable(props) {
  let { columns, data, rowsPerPage } = props;
  let {
    globalSearch,
    hiddenColumns,
    manualFilters,
    paginationPageChange,
    totalRecords,
    getSelectedRows,
    onSort,
  } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    setPageSize, // This is used to change the page size
    prepareRow,
    state,
    setGlobalFilter,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      manualFilters: manualFilters ? manualFilters : false,
      initialState: {
        hiddenColumns: hiddenColumns ? hiddenColumns : []
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
  );

  const { globalFilter, pageIndex, pageSize, sortBy } = state;

  useEffect(() => {
    if (getSelectedRows) {
      getSelectedRows(selectedFlatRows);
    }
  }, [selectedFlatRows]);

  useEffect(() => {
    setPageSize(rowsPerPage)
  }, [rowsPerPage]);



  return (
    <>
      {globalSearch ? (
        <div className='pl-table-search text-end'>
          <GlobalFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}
          />
        </div>
      ) : (
        ""
      )}
      <div >
        <table {...getTableProps()} className='pl-table'>
          <thead>
            {headerGroups.map((headerGroup, hgIndex) => {
              return (
                <>
                  <tr {...headerGroup.getHeaderGroupProps()} key={hgIndex}>
                    {headerGroup.headers.map((column, hgHIndex) => {
                      return (
                        <th
                          className={`pl-rt-header-th pl-rt-header-th-${hgHIndex}`}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          key={hgHIndex}
                          onClick={() => onSort ? onSort({ id: column.id, disableSortBy: column.disableSortBy }) : null}
                        >
                          <span className='headerLabel'>
                            {column.render("Header")}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </>
              );
            })}
          </thead>
          {
            (data.length > 0) && (<tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr className='plTableRow' {...row.getRowProps()} key={i}>
                    {row.cells.map((cell, index) => {
                      return (
                        <td
                          className="pl-rt-table-cell"
                          {...cell.getCellProps()}
                          key={index}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>)
          }
        </table>
      </div>
    </>
  );
}
export default ReactTable;
