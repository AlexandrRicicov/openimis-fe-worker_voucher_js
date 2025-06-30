import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  IconButton, Button, Tooltip, Dialog, DialogActions, DialogTitle, DialogContent,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  Searcher,
  useHistory,
  useModulesManager,
  useTranslations,
  downloadExport,
  SelectDialog,
  EXPORT_FILE_FORMATS,
  useToast,
} from '@openimis/fe-core';
import {
  fetchWorkers, downloadWorkers, clearWorkersExport, deleteWorkerFromEconomicUnit,
} from '../actions';
import {
  ADMIN_RIGHT,
  DEFAULT_PAGE_SIZE,
  EMPTY_OBJECT,
  EMPTY_STRING,
  INSPECTOR_RIGHT,
  MODULE_NAME,
  RIGHT_WORKER_DELETE,
  RIGHT_WORKER_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import WorkerFilter from './WorkerFilter';
import { useUploadWorkerContext } from '../context/UploadWorkerContext';
import { getLastMutationLog } from '../utils/utils';

const WORKER_SEARCHER_ACTION_CONTRIBUTION_KEY = 'workerVoucher.WorkerSearcherAction.select';

function WorkerSearcher({
  downloadWorkers,
  fetchWorkers: fetchWorkersAction,
  clearWorkersExport,
  searcherActions = [],
  enableActionButtons,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const prevSubmittingMutationRef = useRef();

  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const {
    fetchingWorkers,
    fetchedWorkers,
    errorWorkers,
    workers,
    workersPageInfo,
    workersTotalCount,
    workersExport,
    errorWorkersExport,
    mutation,
    submittingMutation,
  } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const isAdminOrInspector = rights.includes(INSPECTOR_RIGHT) || rights.includes(ADMIN_RIGHT);
  const isAuthorized = rights.includes(RIGHT_WORKER_DELETE)
    && (rights.includes(ADMIN_RIGHT)
      || !rights.includes(INSPECTOR_RIGHT));

  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const { showError, showSuccess } = useToast();

  const [failedExport, setFailedExport] = useState(false);
  const [queryParams, setQueryParams] = useState([]);
  const [deleteWorkerDialogOpen, setDeleteWorkerDialogOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [exportFileFormat, setExportFileFormat] = useState(EXPORT_FILE_FORMATS.csv);

  const { validationSuccess, validationWarning } = useUploadWorkerContext();

  const exportConfiguration = {
    exportFields: ['chf_id', 'last_name', 'other_names'],
    additionalExportFields: {
      economicUnitCode: economicUnit?.code,
    },
    exportFieldsColumns: {
      chf_id: formatMessage('worker.chfId'),
      last_name: formatMessage('worker.lastName'),
      other_names: formatMessage('worker.otherNames'),
    },
    exportFileFormats: EXPORT_FILE_FORMATS,
  };

  const fetchWorkers = useCallback(
    (params) => {
      try {
        const actionParams = [...params];

        if (economicUnit?.code && !isAdminOrInspector) {
          actionParams.push(`economicUnitCode:"${economicUnit.code}"`);
        }

        fetchWorkersAction(modulesManager, actionParams);
      } catch (error) {
        throw new Error(`[WORKER_SEARCHER]: Fetching workers failed. ${error}`);
      }
    },
    [economicUnit],
  );

  const headers = () => [
    'workerVoucher.worker.chfId',
    'workerVoucher.worker.lastName',
    'workerVoucher.worker.otherNames',
    'emptyLabel',
  ];

  const sorts = () => [
    ['chfId', true],
    ['lastName', true],
    ['otherNames', true],
  ];

  const rowIdentifier = (worker) => worker.uuid;

  const openWorker = (worker) => rights.includes(RIGHT_WORKER_SEARCH)
    && history.push(`/${modulesManager.getRef('workerVoucher.route.worker')}/${worker?.uuid}`);

  const onDoubleClick = (worker) => openWorker(worker);

  const onDeleteWorkerDialogOpen = (worker) => {
    setDeleteWorkerDialogOpen((prevState) => !prevState);
    setWorkerToDelete(worker);
  };

  const onDeleteWorkerDialogClose = () => {
    setDeleteWorkerDialogOpen((prevState) => !prevState);
    setWorkerToDelete(null);
  };

  const onDeleteWorkerConfirm = async () => {
    try {
      await dispatch(deleteWorkerFromEconomicUnit(economicUnit, workerToDelete, 'Delete Worker'));
      fetchWorkers(queryParams);
    } catch (error) {
      throw new Error(`[WORKER_SEARCHER]: Deletion failed. ${error}`);
    } finally {
      setDeleteWorkerDialogOpen((prevState) => !prevState);
    }
  };

  const itemFormatters = () => [
    (worker) => worker.chfId,
    (worker) => worker.lastName,
    (worker) => worker.otherNames,
    (worker) => (
      <div style={{ textAlign: 'right' }}>
        {rights.includes(RIGHT_WORKER_SEARCH) && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.details')}>
            <IconButton onClick={() => openWorker(worker)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        )}
        {rights.includes(RIGHT_WORKER_DELETE) && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.delete')}>
            <IconButton onClick={() => onDeleteWorkerDialogOpen(worker)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  ];

  useEffect(() => {
    if (errorWorkersExport) {
      setFailedExport(true);
    }
  }, [errorWorkersExport]);

  useEffect(() => {
    if (workersExport) {
      downloadExport(
        workersExport,
        `${formatMessage('export.workers.filename')}.${exportFileFormat}`,
        exportFileFormat,
      )();
      clearWorkersExport();
    }

    return setFailedExport(false);
  }, [workersExport]);

  const handleExportErrorDialogClose = () => {
    setFailedExport(false);
  };

  const workerFilters = ({ filters, onChangeFilters }) => (
    <WorkerFilter filters={filters} onChangeFilters={onChangeFilters} />
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
      fetchWorkers(queryParams);
    }
  }, [economicUnit, queryParams]);

  useEffect(() => {
    if (validationWarning || validationSuccess) {
      fetchWorkers(queryParams);
    }
  }, [validationSuccess, validationWarning]);

  useEffect(async () => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      const mutationLog = await getLastMutationLog(dispatch, mutation?.clientMutationId || EMPTY_STRING);

      if (mutationLog?.error) {
        const parsedMutationError = JSON.parse(mutationLog.error);

        showError(
          formatMessageWithValues('deleteWorker.error', {
            detail: formatMessage(parsedMutationError[0]?.detail) || EMPTY_STRING,
          }),
        );
        return;
      }

      showSuccess(formatMessage('deleteWorker.success'));
      fetchWorkers(queryParams);
    }
  }, [submittingMutation, mutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  return (
    <>
      <Searcher
        withSelection={isAuthorized ? 'multiple' : false}
        selectWithCheckbox={!!isAuthorized}
        actionsContributionKey={isAuthorized ? WORKER_SEARCHER_ACTION_CONTRIBUTION_KEY : EMPTY_STRING}
        selectionMessage="workerVoucher.WorkerSearcher.selection"
        module="workerVoucher"
        FilterPane={workerFilters}
        fetch={fetchWorkers}
        items={workers}
        itemsPageInfo={workersPageInfo}
        fetchedItems={fetchedWorkers}
        fetchingItems={fetchingWorkers}
        errorItems={errorWorkers}
        filtersToQueryParams={filtersToQueryParams}
        tableTitle={formatMessageWithValues('workerVoucher.WorkerSearcher.resultsTitle', { workersTotalCount })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={[...ROWS_PER_PAGE_OPTIONS, 250, 500]}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        onDoubleClick={onDoubleClick}
        exportable={false}
        additionalExportFields={isAdminOrInspector ? EMPTY_OBJECT : exportConfiguration.additionalExportFields}
        exportFields={exportConfiguration.exportFields}
        exportFieldsColumns={exportConfiguration.exportFieldsColumns}
        exportFieldLabel={formatMessage('export.workers')}
        chooseExportableColumns
        chooseFileFormat
        exportFileFormats={EXPORT_FILE_FORMATS}
        exportFileFormat={exportFileFormat}
        setExportFileFormat={setExportFileFormat}
        enableActionButtons={enableActionButtons}
        searcherActions={searcherActions}
        downloadWithIconButton
        displayClearAllColsButton={false}
      />
      {failedExport && (
        <Dialog open={failedExport} fullWidth maxWidth="sm">
          <DialogTitle>{errorWorkersExport?.message}</DialogTitle>
          <DialogContent>
            <strong>{`${errorWorkersExport?.code}:`}</strong>
            {errorWorkersExport?.detail}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleExportErrorDialogClose()} color="primary" variant="contained">
              {formatMessage('workerVoucher.WorkerSearcher.exportClose')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <SelectDialog
        confirmState={deleteWorkerDialogOpen}
        onConfirm={() => onDeleteWorkerConfirm()}
        onClose={() => onDeleteWorkerDialogClose()}
        module="workerVoucher"
        confirmTitle="WorkerSearcher.dialog.title"
        confirmMessage="WorkerSearcher.dialog.message"
        confirmationButton="WorkerSearcher.dialog.confirm"
        rejectionButton="WorkerSearcher.dialog.abandon"
      />
    </>
  );
}

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    downloadWorkers,
    fetchWorkers,
    clearWorkersExport,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(WorkerSearcher);
