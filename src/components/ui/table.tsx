import React from 'react';

interface TableProps {
  columns: {
    key: string;
    header: string;
    width?: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  data: any[];
  className?: string;
  onRowClick?: (row: any) => void;
}

export function Table({ columns, data, className = '', onRowClick }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.width ? `w-${column.width}` : ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                  {column.render 
                    ? column.render(row[column.key], row) 
                    : <div className="text-sm text-gray-900">{row[column.key]}</div>
                  }
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
