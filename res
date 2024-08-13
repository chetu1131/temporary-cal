/* eslint-disable react/jsx-boolean-value */
// ** import packages **
import {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  RowClickedEvent,
} from 'ag-grid-community';

import { AgGridReact } from 'ag-grid-react';
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';

// ** css **
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// ** components **

// ** others **
import { generateFilterParams } from './helpers/table.helper';
import {
  DATE_COLUMN_FILTER_OPTIONS,
  NUMBER_COLUMN_FILTER_OPTIONS,
  TEXT_COLUMN_FILTER_OPTIONS,
} from 'constant/table.constant';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEntityFilterState,
  setEntityFilter,
  setEntitySort,
} from 'redux/slices/tableFilterSlice';
import {
  getEntityLastOpenRecord,
  setEntityLastOpenRecord,
} from 'redux/slices/commonSlice';
import { ModuleNames } from 'constant/permissions.constant';

export type agGridSelectedProps = any[];

export interface AgGridTableRef {
  refreshData(): void;
  getSelectedRows(): void;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  setLastOpenedRecordInView: () => void;
}

export interface AgGridTablePropsWithPagination {
  setSelectedIds?: any;
  setSelectionList?: React.Dispatch<any>;
  dataInfo?: agGridSelectedProps;
  selectedIdsData?: any;
  total?: React.MutableRefObject<undefined>;
  setIsCheckAll?: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
  isCheckAllRef?: React.MutableRefObject<boolean>;
  columnData: ColDef[];
  defaultColParams: ColDef;
  searchColumns?: React.MutableRefObject<string[]>;
  rowDataLimit?: number;
  isWrapTxtUpdate?: boolean;
  isCheckAll?: boolean;
  setIsWrapTxtUpdate?: Dispatch<SetStateAction<boolean>>;
  getData: (params: PaginationParams) => Promise<{
    rowData: Array<any>;
    rowCount: number;
  }>;
  allowMultipleSelect?: boolean;
  onRowClick?: (event: RowClickedEvent<any>) => void;
  type?: string;
  modelName?: ModuleNames;
  setSearchText?: Dispatch<SetStateAction<string>>;
  setFilterData?: Dispatch<
    SetStateAction<{
      activityTypeFilterData: string[];
      activityDateFilterData: {
        start_date: Date | undefined;
        end_date: Date | undefined;
      };
      completed: boolean;
      all: boolean;
    }>
  >;
  spacing?: { height: number; class: string };
  onHandleColumnSizeUpdate?: (colId: string, width: number) => void;
  onHandleColumnMoved?: ({ columns }: { columns: string[] }) => void;
}

export interface PaginationParams {
  page?: number;
  sort?: string;
  limit?: number;
  search?: string;
  [key: string]: string | number | Date | boolean | undefined | null;
}

const TableInfiniteScroll = forwardRef<
  AgGridTableRef,
  AgGridTablePropsWithPagination
>((props, ref) => {
  const {
    setSelectionList,
    columnData,
    isCheckAllRef,
    dataInfo,
    total,
    selectedIdsData,
    setIsCheckAll,
    defaultColParams,
    allowMultipleSelect = true,
    searchColumns,
    rowDataLimit = 10,
    isWrapTxtUpdate,
    setIsWrapTxtUpdate,
    getData,
    isLoading = true,
    // skeleton = true,
    onRowClick,
    setSelectedIds,
    type = '',
    isCheckAll,
    setSearchText,
    setFilterData,
    setCurrentPage,
    onHandleColumnSizeUpdate,
    onHandleColumnMoved,
    modelName,
    spacing,
  } = props;

  // ** hooks **

  const dispatch = useDispatch();
  const selector = useSelector(getEntityFilterState);
  const previouslyOpenRecord = useSelector(getEntityLastOpenRecord);
  const agGridTableRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const defaultColDef: ColDef = useMemo(() => {
    return {
      // flex: 1,
      sortable: true,
      lockVisible: true,
      lockPinned: true,
      filter: true,
      filterParams: { buttons: ['clear', 'apply'], closeOnApply: true },
      suppressMenu: true,
      menuTabs: ['filterMenuTab'],
      suppressColumnsToolPanel: false,
      cellClass: 'ag__grid__cell__ellipse',
      ...(window.innerWidth > 425 && { minWidth: 120 }),
      ...defaultColParams,
    };
  }, [defaultColParams]);

  useEffect(() => {
    const handleBodyScroll = () => {
      const firstDisplayedRow = gridApi?.getFirstDisplayedRow();
      const lastDisplayedRow = gridApi?.getLastDisplayedRow();
      if (firstDisplayedRow !== undefined && lastDisplayedRow !== undefined) {
        const calculatedPage = Math.ceil((lastDisplayedRow + 1) / 15);
        setCurrentPage?.(calculatedPage);
      }
      setTimeout(() => {
        if (isCheckAllRef?.current === true) {
          gridApi?.forEachNode((node) => {
            node.setSelected(isCheckAllRef?.current);
          });
        }
      }, 200);
    };

    gridApi?.addEventListener('bodyScroll', handleBodyScroll);
    return () => {
      gridApi?.removeEventListener('bodyScroll', handleBodyScroll);
    };
  }, [gridApi]);
  useEffect(() => {
    if (isCheckAllRef?.current === true) {
      gridApi?.forEachNode((node) => {
        node.setSelected(isCheckAllRef?.current);
      });
    }
  }, [setCurrentPage]);

  useEffect(() => {
    gridApi?.forEachNode((node) => {
      if (isCheckAllRef) {
        isCheckAllRef.current = isCheckAll || false;
      }
      if (isCheckAll === true) {
        node.setSelected(isCheckAll);
      }
      if (
        isCheckAll === false &&
        dataInfo?.length === selectedIdsData?.length
      ) {
        node.setSelected(false);
      }
    });
  }, [isCheckAll]);

  const defaultGridOptions = (gridType = '') => {
    return {
      domLayout: 'normal',
      suppressMenuHide: true,
      suppressContextMenu: true,
      suppressMovableColumns: !onHandleColumnMoved, // change to make column moveable
      rowHeight: spacing?.height,
      popupParent: document.querySelector('body'),
      getRowClass: (params) => {
        return params?.data?.is_system &&
          gridType !== 'activity' &&
          gridType !== 'pipeline'
          ? 'pointer-events-none'
          : '';
      },
      onDragStopped: (params) => {
        if (
          onHandleColumnMoved &&
          params.target.className !== 'ag-header-cell-resize'
        ) {
          const columns = params.columnApi
            .getAllDisplayedColumns()
            .map((col: any) => col?.colId);
          onHandleColumnMoved({ columns });
        }
      },
    } as GridOptions;
  };
  /* Hidden Column added for Full Search */
  const columnDefs = useMemo(() => {
    return [
      ...columnData.map((column) => {
        switch (column.filter) {
          case 'agTextColumnFilter': {
            return {
              ...column,
              filterParams: {
                filterOptions: TEXT_COLUMN_FILTER_OPTIONS,
              },
            };
          }
          case 'agNumberColumnFilter': {
            return {
              ...column,
              filterParams: {
                filterOptions: NUMBER_COLUMN_FILTER_OPTIONS,
              },
            };
          }
          case 'agDateColumnFilter': {
            return {
              ...column,
              filterParams: {
                filterOptions: DATE_COLUMN_FILTER_OPTIONS,
              },
            };
          }
          default:
            return column;
        }
      }),
      {
        field: 'searchText',
        hide: true,
        lockVisible: true,
        filter: 'agTextColumnFilter',
        filterParams: { newRowsAction: 'keep' },
      },
    ];
  }, [columnData]);

  const getRowId = (params: GetRowIdParams) => params.data.id;

  let columnResizeTimer: ReturnType<typeof setTimeout>;

  const onGridReady = useCallback(
    async (onGridReadyParams: GridReadyEvent) => {
      // Get Default Filter In Table
      if (type !== '' && setFilterData) {
        setFilterData((prev) => ({
          ...prev,
          ...(selector.filterData.activityCustomDateFilter && {
            activityDateFilterData: {
              start_date:
                selector.filterData.activityCustomDateFilter?.startDate,
              end_date: selector.filterData.activityCustomDateFilter?.endDate,
            },
          }),
          ...(selector.filterData.activityCustomTypeFilter && {
            activityTypeFilterData:
              selector.filterData.activityCustomTypeFilter,
          }),
          ...(selector.filterData.activityCustomCompletedTypeFilter && {
            completed:
              selector.filterData.activityCustomCompletedTypeFilter.length !==
                2 &&
              selector.filterData.activityCustomCompletedTypeFilter.includes(
                'completed'
              ),
          }),
          ...(selector.filterData.activityCustomCompletedTypeFilter && {
            all:
              selector.filterData.activityCustomCompletedTypeFilter.length !==
                2 &&
              selector.filterData.activityCustomCompletedTypeFilter.includes(
                'all'
              ),
          }),
        }));
      }
      if (type !== '' && selector.filterData[type]) {
        agGridTableRef?.current?.api.setFilterModel(selector.filterData[type]);
        if (
          setSearchText &&
          selector.filterData[type].searchText &&
          selector.filterData[type].searchText.filter
        ) {
          setSearchText(selector.filterData[type].searchText.filter);
        }
      }
      // Get Default Sort In Table
      if (type !== '' && selector.sortData[type]) {
        agGridTableRef?.current?.columnApi.applyColumnState({
          state: selector.sortData[type],
          defaultState: { sort: null },
        });
      }
      const dataSource: IServerSideDatasource = {
        getRows: async (params: IServerSideGetRowsParams) => {
          setTimeout(async () => {
            let paginationParams: PaginationParams = {
              page: 1,
              limit: rowDataLimit,
            };

            /* Pagination */
            if (params?.request.endRow) {
              const page = params.request.endRow / rowDataLimit;
              paginationParams.page = page;
            }

            /* Sorting */
            if (params.request.sortModel.length) {
              const sortModel = params.request.sortModel[0];

              const direction = sortModel.sort === 'asc' ? '-' : '';
              if (sortModel.colId.includes('.')) {
                paginationParams.subQuery = false;
                const colNameArray = sortModel.colId.split('.');
                if (_.isArray(colNameArray)) {
                  paginationParams.sort = `${direction}${colNameArray[0]}.${colNameArray[1]}`;
                }
              } else {
                const sort = direction + sortModel.colId;
                if (sort) {
                  paginationParams.sort = sort;
                }
              }
            }

            /* Searching */
            if (params.request.filterModel?.searchText) {
              const { filter } = params.request.filterModel.searchText;
              if (filter && filter?.length) {
                const searchFields =
                  (searchColumns && searchColumns.current?.toString()) || '';
                paginationParams.searchFields = searchFields;
                paginationParams.searchText = filter;
              }
            }

            /* Filter */
            if (params.request.filterModel) {
              let parentOperatorIndex = 0;
              Object.entries(params.request.filterModel).forEach(
                ([colName, colData]) => {
                  if (colName === 'searchText') {
                    return;
                  }
                  const {
                    filterQueryParams,
                    operatorIndex,
                  }: {
                    filterQueryParams: {
                      [key: string]: string | boolean;
                    };
                    operatorIndex: number;
                  } = generateFilterParams(
                    colName,
                    colData,
                    parentOperatorIndex
                  );
                  paginationParams = {
                    ...paginationParams,
                    ...filterQueryParams,
                  };
                  parentOperatorIndex = operatorIndex;
                }
              );
            }

            const { rowData, rowCount } = await getData(paginationParams);
            params.success({ rowData, rowCount });
          }, 90);
        },
      };
      onGridReadyParams.api.setServerSideDatasource(dataSource);
      if (isCheckAllRef?.current === true) {
        onGridReadyParams.api?.forEachNode((node) => {
          // nodesToSelect.push(node);
          node.setSelected(isCheckAllRef?.current);
        });
      }
      setGridApi(onGridReadyParams.api);
    },
    // need to update scope of search columns coz it's varies on view change
    [searchColumns]
  );

  /* Get Selected Row */
  const getSelectedRows = useCallback(() => {
    if (gridApi) {
      return gridApi.getSelectedRows();
    }
    return [];
  }, [gridApi]);

  /* Refetch Data */
  const onRefresh = useCallback(() => {
    if (gridApi) {
      gridApi.refreshServerSide({ route: undefined, purge: true });
      gridApi.deselectAll();
      gridApi.refreshServerSide({ route: undefined, purge: true });
    }
  }, [gridApi]);

  useEffect(() => {
    if (isWrapTxtUpdate) {
      onRefresh();
      setIsWrapTxtUpdate?.(false);
    }
  }, [isWrapTxtUpdate]);

  /* Full Search */
  const applyFilter = useCallback(
    (filterVal: string) => {
      if (gridApi) {
        gridApi.setFilterModel({
          searchText: { filter: filterVal, type: 'contains' },
        });
      }
    },
    [gridApi]
  );
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchVal = e.target.value.trim();
    applyFilter(searchVal);
  };

  /* Show Skeleton */
  useEffect(() => {
    if (gridApi) {
      if (!isLoading) {
        gridApi.hideOverlay();
      } else {
        gridApi.showLoadingOverlay();
      }
    }
  }, [isLoading]);

  useImperativeHandle(ref, () => ({
    getSelectedRows,
    refreshData: onRefresh,
    onChange: (e) => onChange(e),
    setLastOpenedRecordInView,
  }));

  /* No Data Message */
  useMemo(() => {
    if (!isLoading && gridApi) {
      if (gridApi?.getDisplayedRowCount() === 0) {
        gridApi?.showNoRowsOverlay();
      } else {
        gridApi?.hideOverlay();
      }
    }
  }, [isLoading]);

  // Save Applied Filter In The State
  const saveAppliedFilter = () => {
    if (type !== '') {
      const state_data: any = {
        entity: type,
        data: agGridTableRef?.current?.api.getFilterModel(),
      };
      dispatch(setEntityFilter(state_data));
    }
  };

  // Save Applied Sorting In The State
  const saveSortingColumns = () => {
    if (type !== '') {
      const state_data: any = {
        entity: type,
        data: agGridTableRef?.current?.columnApi.getColumnState(),
      };
      dispatch(setEntitySort(state_data));
    }
  };

  const setLastOpenedRecordInView = useCallback(() => {
    if (modelName) {
      const rowIndex = previouslyOpenRecord?.[modelName]?.index;
      if (_.isNumber(rowIndex) && rowIndex !== -1) {
        setTimeout(() => {
          gridApi?.ensureIndexVisible(+rowIndex);
          const updatedData = {
            ..._.cloneDeep(previouslyOpenRecord),
            [modelName]: { ...previouslyOpenRecord?.[modelName], index: -1 },
          };

          if (previouslyOpenRecord?.[modelName]?.dataId) {
            setTimeout(() => {
              const elements = document.querySelectorAll(
                `.ag-row[row-id="${previouslyOpenRecord?.[modelName]?.dataId}"]`
              );

              elements?.forEach((item) => {
                item.classList.add('pre-node');
              });
            }, 500);
          }

          dispatch(
            setEntityLastOpenRecord({
              data: updatedData,
              isReplace: true,
            })
          );
        }, 500);
      }
    }
  }, [gridApi, modelName, previouslyOpenRecord]);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = agGridTableRef?.current?.api.getSelectedRows();

    if (setSelectionList) {
      setSelectionList(selectedRows);
    }
    if (setSelectedIds) {
      const ids = selectedRows?.map((item: { id: number }) => {
        return item?.id;
      });
      setSelectedIds(ids);
    }
    if (total?.current === selectedRows?.length && setIsCheckAll) {
      // setIsCheckAll(true);
    }
  }, []);
  const getSetTimeoutContent = () => {
    return (
      <div
        className="ag-custom-loading-cell"
        style={{
          paddingLeft: '10px',
          lineHeight: '25px',
        }}
      >
        <span> Loading </span>{' '}
      </div>
    );
  };
  return (
    <>
      <div
        className="ag__grid__infinite__scroll sm:hidden"
        id="ag__grid__infinite__scroll"
      >
        <div className="ag__grid__infinite__scroll__inner">
          <div
            style={{ height: '100%', width: '100%' }}
            className={`ag-theme-alpine ${spacing?.class}`}
          >
            <AgGridReact
              ref={agGridTableRef}
              suppressRowClickSelection
              suppressRowDeselection
              onSelectionChanged={onSelectionChanged}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowBuffer={0}
              rowSelection={allowMultipleSelect ? 'multiple' : 'single'}
              rowModelType="serverSide"
              cacheBlockSize={rowDataLimit}
              cacheOverflowSize={2}
              maxConcurrentDatasourceRequests={1}
              infiniteInitialRowCount={rowDataLimit}
              maxBlocksInCache={10}
              onGridReady={onGridReady}
              onFilterChanged={saveAppliedFilter}
              overlayNoRowsTemplate={`
                        <div class="no__data__wrapper">
                          <img class="image" src="/images/no-data-image.png">
                          <h2 class="title">No Result Found</h2>
                          <p class="text">We couldn't find what you searched for,</br>try searching again.</p>
                        </div>
                      `}
              getRowId={getRowId}
              serverSideInfiniteScroll
              onRowClicked={(e) => {
                if (isLoading) {
                  return;
                }

                if (onRowClick) {
                  onRowClick(e);
                }
              }}
              loadingCellRendererParams={{
                isLoading,
              }}
              loadingCellRenderer={(propsData: any) => {
                if (!propsData.isLoading) {
                  return '';
                }
                setTimeout(() => {
                  getSetTimeoutContent();
                }, 10);
                return undefined;
              }}
              gridOptions={defaultGridOptions(type)}
              ensureDomOrder
              onSortChanged={saveSortingColumns}
              onColumnResized={(params) => {
                if (
                  params?.column !== undefined &&
                  onHandleColumnSizeUpdate &&
                  params.source === 'uiColumnDragged' &&
                  params.finished
                ) {
                  const { colId, actualWidth } = (params?.column as any) || {
                    colId: '',
                    actualWidth: '',
                  };
                  if (columnResizeTimer) {
                    clearTimeout(columnResizeTimer);
                  }
                  columnResizeTimer = setTimeout(() => {
                    onHandleColumnSizeUpdate(colId || '', actualWidth || 0);
                    clearTimeout(columnResizeTimer);
                  }, 1000);
                }
              }}
              alwaysShowVerticalScroll={false}
            />
          </div>
        </div>
      </div>
      <div
        id="custom__tooltip"
        className="hidden z-[10] custom__tooltip fixed bg-sdBlack__bg rounded-[6px] px-[10px] pb-[3px] pt-[4px] before:content-[''] before:bottom-[-16px] before:absolute before:left-[50%] before:translate-x-[-50%] before:w-[0px] before:h-[0px] before:border-[10px] before:border-transparent before:border-t-[10px] before:border-t-sdBlack__bg"
      >
        <p className="text-[14px] font-biotif__Regular text-sdWhite__text">
          Simple Tooltip
        </p>
      </div>
    </>
  );
});

TableInfiniteScroll.displayName = 'TableInfiniteScroll';

export default memo(TableInfiniteScroll);
