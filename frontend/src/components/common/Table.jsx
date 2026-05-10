import React, { useState } from 'react';
import './Table.css';
import Button from './Button';
import { PAGINATION_OPTIONS } from '../../utils/constants';

const Table = ({
  columns,
  data,
  keyExtractor,
  sortable = false,
  pagination = false,
  pageSize: initialPageSize = 10,
  emptyState,
  extra
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handleSort = (key) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortable) return data;
    const sorted = [...data];
    sorted.sort((a, b) => {
      const aVal = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((obj, k) => obj?.[k], a)
        : a[sortConfig.key];
      const bVal = sortConfig.key.includes('.')
        ? sortConfig.key.split('.').reduce((obj, k) => obj?.[k], b)
        : b[sortConfig.key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal > bVal ? -1 : 1;
    });
    return sorted;
  }, [data, sortConfig, sortable]);

  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 1;

  const getSortIcon = (columnKey) => {
    if (!sortable) return null;
    if (sortConfig.key !== columnKey) {
      return <span className="table__sort-icon">↕</span>;
    }
    return <span className="table__sort-icon table__sort-icon--active">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  if (data.length === 0 && emptyState) {
    return emptyState;
  }

  return (
    <div className="table-wrapper">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`table__th ${sortable && col.sortable !== false ? 'table__th--sortable' : ''} ${col.align === 'right' ? 'table__th--right' : ''} ${col.width ? 'table__th--width' : ''}`}
                  style={col.width ? { width: col.width } : {}}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="table__th-content">
                    {col.title}
                    {sortable && col.sortable !== false && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={keyExtractor(row)} className="table__tr">
                {columns.map((col) => (
                  <td
                    key={`${keyExtractor(row)}-${col.key}`}
                    className={`table__td ${col.align === 'right' ? 'table__td--right' : ''}`}
                  >
                    {col.render ? col.render(row, paginatedData, extra) : col.key.includes('.')
                      ? col.key.split('.').reduce((obj, k) => obj?.[k], row) || '-'
                      : row[col.key] || '-'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="table__pagination">
          <div className="table__pagination-info">
            Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, data.length)} sur {data.length}
          </div>
          <div className="table__pagination-controls">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="table__pagination-select"
            >
              {PAGINATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt} / page</option>
              ))}
            </select>
            <div className="table__pagination-buttons">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </Button>
              <span className="table__pagination-page">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
