import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  IconButton, Button, Tooltip, Dialog, DialogActions, DialogTitle, DialogContent,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import {
  Searcher,
  useHistory,
  useModulesManager,
  useTranslations,
  downloadExport,
  EXPORT_FILE_FORMATS,
} from '@openimis/fe-core';
import { fetchWorkerVouchers, downloadWorkerVoucher, clearWorkerVoucherExport } from '../actions';
import {
  ADMIN_RIGHT,
  DEFAULT_PAGE_SIZE,
  EMPTY_OBJECT,
  INSPECTOR_RIGHT,
  MODULE_NAME,
  REF_ROUTE_WORKER_VOUCHER,
  ROWS_PER_PAGE_OPTIONS,
  VOUCHER_RIGHT_SEARCH,
} from '../constants';
import VoucherFilter from './VoucherFilter';
import { trimDate } from '../utils/utils';

function VoucherSearcher({ downloadWorkerVoucher, fetchWorkerVouchers, clearWorkerVoucherExport }) {
  const history = useHistory();
  const modulesManager = useModulesManager();

  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const {
    fetchingWorkerVouchers,
    fetchedWorkerVouchers,
    errorWorkerVouchers,
    workerVouchers,
    workerVouchersPageInfo,
    workerVouchersTotalCount,
    workerVoucherExport,
    errorWorkerVoucherExport,
  } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const isAdminOrInspector = rights.includes(INSPECTOR_RIGHT) || rights.includes(ADMIN_RIGHT);

  const { formatMessage, formatMessageWithValues, formatDateTimeFromISO } = useTranslations(
    MODULE_NAME,
    modulesManager,
  );

  const [failedExport, setFailedExport] = useState(false);
  const [queryParams, setQueryParams] = useState([]);
  const [exportFileFormat, setExportFileFormat] = useState(EXPORT_FILE_FORMATS.csv);

  const exportConfiguration = {
    exportFields: ['status'],
    additionalExportFields: {
      policyholder_Code: economicUnit?.code,
    },
    exportFieldsColumns: {
      code: formatMessage('code'),
      policyholder__code: formatMessage('employer.code'),
      policyholder__trade_name: formatMessage('employer.tradename'),
      insuree__chf_id: formatMessage('worker.chfId'),
      insuree__other_names: formatMessage('worker.otherNames'),
      insuree__last_name: formatMessage('worker.lastName'),
      status: formatMessage('status'),
    },
    exportFileFormats: EXPORT_FILE_FORMATS,
  };

  const fetchVouchers = useCallback(
    (params) => {
      try {
        const actionParams = [...params];

        if (economicUnit?.code && !isAdminOrInspector) {
          actionParams.push(`policyholder_Code:"${economicUnit.code}"`);
        }

        fetchWorkerVouchers(modulesManager, actionParams);
      } catch (error) {
        throw new Error(`[VOUCHER_SEARCHER]: Fetching vouchers failed. ${error}`);
      }
    },
    [economicUnit],
  );

  const headers = () => [
    'workerVoucher.code',
    'workerVoucher.employer',
    'workerVoucher.worker',
    'workerVoucher.status',
    'workerVoucher.assignedDate',
    'workerVoucher.dateOfAssignment',
    'emptyLabel',
  ];

  const sorts = () => [
    ['code', true],
    ['policyholder', true],
    ['insuree', true],
    ['status', true],
    ['assignedDate', true],
    ['dateOfAssignment', true],
  ];

  const rowIdentifier = (workerVoucher) => workerVoucher.uuid;

  const openWorkerVoucher = (workerVoucher) => rights.includes(VOUCHER_RIGHT_SEARCH)
    && history.push(`/${modulesManager.getRef(REF_ROUTE_WORKER_VOUCHER)}/${workerVoucher?.uuid}`);

  const onDoubleClick = (workerVoucher) => openWorkerVoucher(workerVoucher);

  const itemFormatters = () => [
    (workerVoucher) => workerVoucher.code,
    (workerVoucher) => `${workerVoucher.policyholder.code} ${workerVoucher.policyholder.tradeName}`,
    (workerVoucher) => (workerVoucher.insuree
      ? `${workerVoucher.insuree?.chfId} ${workerVoucher.insuree?.lastName}`
      : formatMessage('workerVoucher.unassigned')),
    (workerVoucher) => formatMessage(`workerVoucher.status.${workerVoucher.status}`),
    (workerVoucher) => trimDate(workerVoucher.assignedDate),
    (workerVoucher) => formatDateTimeFromISO(workerVoucher.dateOfAssignment),
    (workerVoucher) => (
      <div style={{ textAlign: 'right' }}>
        <Tooltip title={formatMessage('workerVoucher.tooltip.details')}>
          <IconButton onClick={() => openWorkerVoucher(workerVoucher)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  ];

  useEffect(() => {
    if (errorWorkerVoucherExport) {
      setFailedExport(true);
    }
  }, [errorWorkerVoucherExport]);

  useEffect(() => {
    if (workerVoucherExport) {
      downloadExport(
        workerVoucherExport,
        `${formatMessage('export.filename')}.${exportFileFormat}`,
        exportFileFormat,
      )();
      clearWorkerVoucherExport();
    }

    return setFailedExport(false);
  }, [workerVoucherExport]);

  const handleExportErrorDialogClose = () => {
    setFailedExport(false);
  };

  const voucherFilter = ({ filters, onChangeFilters }) => (
    <VoucherFilter filters={filters} onChangeFilters={onChangeFilters} formatMessage={formatMessage} />
  );

  const filtersToQueryParams = ({
    filters, pageSize, beforeCursor, afterCursor, orderBy,
  }) => {
    const queryParams = Object.keys(filters)
      .filter((f) => !!filters[f].filter)
      .map((f) => filters[f].filter);
    if (!beforeCursor && !afterCursor) {
      queryParams.push(`first: ${pageSize}`);
    }
    if (afterCursor) {
      queryParams.push(`after: "${afterCursor}"`);
      queryParams.push(`first: ${pageSize}`);
    }
    if (beforeCursor) {
      queryParams.push(`before: "${beforeCursor}"`);
      queryParams.push(`last: ${pageSize}`);
    }
    if (orderBy) {
      queryParams.push(`orderBy: ["${orderBy}"]`);
    }
    setQueryParams(queryParams);
    return queryParams;
  };

  useEffect(() => {
    if (queryParams.length) {
      fetchVouchers(queryParams);
    }
  }, [economicUnit, queryParams]);

  return (
    <>
      <Searcher
        module="workerVoucher"
        FilterPane={voucherFilter}
        fetch={fetchVouchers}
        items={workerVouchers}
        itemsPageInfo={workerVouchersPageInfo}
        fetchedItems={fetchedWorkerVouchers}
        fetchingItems={fetchingWorkerVouchers}
        errorItems={errorWorkerVouchers}
        filtersToQueryParams={filtersToQueryParams}
        tableTitle={formatMessageWithValues('workerVoucher.searcherResultsTitle', { workerVouchersTotalCount })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        onDoubleClick={onDoubleClick}
        exportable={!!workerVouchers?.length}
        exportFetch={downloadWorkerVoucher}
        exportFields={exportConfiguration.exportFields}
        exportFieldsColumns={exportConfiguration.exportFieldsColumns}
        additionalExportFields={isAdminOrInspector ? EMPTY_OBJECT : exportConfiguration.additionalExportFields}
        exportFieldLabel={formatMessage('export.vouchers')}
        chooseExportableColumns
        chooseFileFormat
        exportFileFormats={EXPORT_FILE_FORMATS}
        exportFileFormat={exportFileFormat}
        setExportFileFormat={setExportFileFormat}
        downloadWithIconButton
        displayClearAllColsButton={false}
      />
      {failedExport && (
        <Dialog open={failedExport} fullWidth maxWidth="sm">
          <DialogTitle>{errorWorkerVoucherExport?.message}</DialogTitle>
          <DialogContent>
            <strong>{`${errorWorkerVoucherExport?.code}:`}</strong>
            {errorWorkerVoucherExport?.detail}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleExportErrorDialogClose} color="primary" variant="contained">
              {formatMessage('close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    downloadWorkerVoucher,
    fetchWorkerVouchers,
    clearWorkerVoucherExport,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(VoucherSearcher);
