import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  MenuItem, Tooltip, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import { SelectDialog, useTranslations, historyPush, useHistory, useModulesManager, useToast } from '@openimis/fe-core';
import { deleteWorkersFromEconomicUnit, downloadWorkers } from '../actions';
import { MODULE_NAME, RIGHT_WORKER_ADD, RIGHT_WORKER_UPLOAD } from '../constants';
import UploadWorkerModal from './UploadWorkerModal';
import { UploadWorkerProvider } from '../context/UploadWorkerContext';

const useStyles = makeStyles((theme) => ({
  uppercase: {
    textTransform: 'uppercase',
  },
  trigger: {
    marginLeft: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'nowrap',
  },
  actionButton: {
    minWidth: '120px',
    whiteSpace: 'nowrap',
    padding: theme.spacing(0.5, 1.5),
    textTransform: 'none',
    fontSize: '0.8rem',
    height: '36px',
  },
}));

function WorkerSearcherSelectActions({
  selection: selectedWorkers,
  refetch: refetchWorkers,
  clearSelected,
  withSelection,
  downloadWithIconButton = false,
}) {
  const prevEconomicUnitRef = useRef();
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME);
  const modulesManager = useModulesManager();
  const history = useHistory();
  const { showInfo } = useToast();
  const isWorkerSelected = !!selectedWorkers.length;

  const [uploadOpen, setUploadOpen] = useState(false);

  const onAddRedirect = () => {
    showInfo(formatMessage('addWorker.redirecting'));
    historyPush(modulesManager, history, 'workerVoucher.route.worker');
  };

  const onUploadOpen = () => {
    setUploadOpen(true);
  };

  const onUploadClose = () => {
    setUploadOpen(false);
  };

  const onExportWorkers = () => {
    dispatch(downloadWorkers(economicUnit));
  };

  const onBulkDeleteConfirm = async () => {
    try {
      await dispatch(deleteWorkersFromEconomicUnit(economicUnit, selectedWorkers, 'Bulk Delete Workers'));
      refetchWorkers();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('[WORKER_SEARCHER_SELECT_ACTIONS]: Bulk delete failed.', error);
    } finally {
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const onBulkDeleteClose = () => setIsBulkDeleteDialogOpen(false);

  useEffect(() => {
    if (prevEconomicUnitRef.current !== undefined && prevEconomicUnitRef.current !== economicUnit) {
      if (selectedWorkers.length) {
        clearSelected();
      }
    }

    prevEconomicUnitRef.current = economicUnit;
  }, [economicUnit, selectedWorkers, clearSelected]);

  if (!withSelection) {
    return null;
  }

  return (
    <>
      <div className={classes.buttonContainer}>
        {/* Export button */}
        {downloadWithIconButton && (
          <Tooltip title={formatMessage('workerVoucher.export.workers')}>
            <Button
              onClick={onExportWorkers}
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              className={classes.actionButton}
            >
              {formatMessage('workerVoucher.export.workers')}
            </Button>
          </Tooltip>
        )}

        {/* Upload button */}
        {rights.includes(RIGHT_WORKER_UPLOAD) && downloadWithIconButton && (
          <Tooltip title={formatMessage('workerVoucher.WorkersPage.uploadAction')}>
            <Button
              onClick={onUploadOpen}
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              className={classes.actionButton}
            >
              {formatMessage('workerVoucher.WorkersPage.uploadAction')}
            </Button>
          </Tooltip>
        )}

        {/* Add worker button */}
        {rights.includes(RIGHT_WORKER_ADD) && downloadWithIconButton && (
          <Tooltip title={formatMessage('workerVoucher.WorkersPage.addAction')}>
            <Button
              onClick={onAddRedirect}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.actionButton}
            >
              {formatMessage('workerVoucher.WorkersPage.addAction')}
            </Button>
          </Tooltip>
        )}

        {/* Delete button - only show when workers are selected */}
        {withSelection && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.bulkDelete')}>
            {downloadWithIconButton ? (
              <Button
                onClick={setIsBulkDeleteDialogOpen}
                disabled={!isWorkerSelected}
                variant="contained"
                color="primary"
                startIcon={<DeleteIcon />}
                className={classes.actionButton}
              >
                {formatMessage('workerVoucher.WorkerSearcherSelectActions.delete')}
              </Button>
            ) : (
              <MenuItem onClick={setIsBulkDeleteDialogOpen} disabled={!isWorkerSelected}>
                <span className={classes.uppercase}>
                  {formatMessage('workerVoucher.WorkerSearcherSelectActions.delete')}
                </span>
              </MenuItem>
            )}
          </Tooltip>
        )}
      </div>

      <SelectDialog
        module={MODULE_NAME}
        confirmState={isBulkDeleteDialogOpen}
        onConfirm={onBulkDeleteConfirm}
        onClose={onBulkDeleteClose}
        confirmTitle="workerVoucher.WorkerSearcherSelectActions.dialog.title"
        confirmMessageWithValues="workerVoucher.WorkerSearcherSelectActions.dialog.message"
        translationVariables={{ count: selectedWorkers.length }}
        confirmationButton="workerVoucher.WorkerSearcherSelectActions.dialog.confirm"
        rejectionButton="workerVoucher.WorkerSearcherSelectActions.dialog.abandon"
      />

      <UploadWorkerProvider>
        <UploadWorkerModal open={uploadOpen} onClose={onUploadClose} />
      </UploadWorkerProvider>
    </>
  );
}

export default WorkerSearcherSelectActions;
