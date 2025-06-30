import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import {
  Helmet, historyPush, useHistory, useModulesManager, useTranslations, useToast,
} from '@openimis/fe-core';
import WorkerSearcher from '../components/WorkerSearcher';
import {
  MODULE_NAME, RIGHT_WORKER_ADD, RIGHT_WORKER_SEARCH, RIGHT_WORKER_UPLOAD,
} from '../constants';
import { UploadWorkerProvider } from '../context/UploadWorkerContext';
import UploadWorkerModal from '../components/UploadWorkerModal';

export const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  bottomActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
  actionButton: {
    textTransform: 'none',
  },
}));

function WorkersPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const modulesManager = useModulesManager();
  const history = useHistory();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const { showInfo } = useToast();
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);

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

  return (
    rights.includes(RIGHT_WORKER_SEARCH) && (
      <UploadWorkerProvider>
        <UploadWorkerModal open={uploadOpen} onClose={onUploadClose} />
        <div className={classes.page}>
          <Helmet title={formatMessage('workerVoucher.menu.workersList')} />
          <WorkerSearcher
            onUploadOpen={onUploadOpen}
          />
        </div>
      </UploadWorkerProvider>
    )
  );
}

export default WorkersPage;
