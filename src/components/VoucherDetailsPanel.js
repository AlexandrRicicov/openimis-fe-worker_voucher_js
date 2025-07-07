import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

import {
  Button, Divider, Grid, Typography,
} from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/styles';

import {
  FormattedMessage, historyPush, useHistory, useModulesManager, SelectDialog,
} from '@openimis/fe-core';
import { changeGenericVoucherStatusAfterPrint, fetchWorkerVoucher, cancelVoucher } from '../actions';
import {
  PRINTABLE, CANCELABLE, REF_ROUTE_BILL, VOUCHER_RIGHT_SEARCH, WORKER_VOUCHER_STATUS,
} from '../constants';
import { canCancelVoucher, canPrintVoucher } from '../utils/utils';
import VoucherDetailsEmployer from './VoucherDetailsEmployer';
import VoucherDetailsPrintTemplate from './VoucherDetailsPrintTemplate';
import VoucherDetailsVoucher from './VoucherDetailsVoucher';
import VoucherDetailsWorker from './VoucherDetailsWorker';
import VoucherGenericPrintModal from './VoucherGenericPrintModal';

const useStyles = makeStyles((theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
}));

function VoucherDetailsPanel(props) {
  const { workerVoucher, edited, onEditedChanged, readOnly = true, formatMessage, rights, logo, formatDateTimeFromISO, canSaveVoucher, saveVoucher } = props;

  const modulesManager = useModulesManager();
  const history = useHistory();
  const dispatch = useDispatch();
  const voucherPrintTemplateRef = useRef(null);
  const classes = useStyles();
  const isAssignedStatus = workerVoucher.status === WORKER_VOUCHER_STATUS.ASSIGNED;
  const [isPrintConfirmationModalOpen, setIsPrintConfirmationModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handlePrint = useReactToPrint({
    documentTitle: `${workerVoucher.code}`,
  });

  const redirectToTheLinkedBill = () => historyPush(modulesManager, history, REF_ROUTE_BILL, [workerVoucher.billId]);

  const openPrintConfirmationModal = () => setIsPrintConfirmationModalOpen(true);

  const closePrintConfirmationModal = () => setIsPrintConfirmationModalOpen(false);

  const openCancelDialog = () => setIsCancelDialogOpen(true);

  const closeCancelDialog = () => setIsCancelDialogOpen(false);

  const onCancelVoucherConfirm = async () => {
    try {
      await dispatch(cancelVoucher(workerVoucher, 'Cancel Voucher'));
      dispatch(fetchWorkerVoucher(modulesManager, [`id: "${workerVoucher.uuid}"`]));
    } catch (error) {
      console.error('Cancel voucher failed:', error);
    } finally {
      setIsCancelDialogOpen(false);
    }
  };

  const onGenericVoucherPrint = () => {
    dispatch(changeGenericVoucherStatusAfterPrint(workerVoucher, 'Change Status After Print')).then(() => {
      closePrintConfirmationModal();
      dispatch(fetchWorkerVoucher(modulesManager, [`id: "${workerVoucher.uuid}"`]));
    });
    handlePrint(null, () => voucherPrintTemplateRef.current);
  };

  return (
    <div>
      <Grid container className={classes.tableTitle}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.fullHeight}
        >
          <Grid item>
            <Typography>
              <FormattedMessage module="workerVoucher" id="workerVoucher.VoucherDetailsPanel.subtitle" />
            </Typography>
          </Grid>
          {rights.includes(VOUCHER_RIGHT_SEARCH) && (
            <Grid item className={classes.actionButtons}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveVoucher}
                disabled={!canSaveVoucher || !canSaveVoucher()}
              >
                <Typography variant="body2">{formatMessage('workerVoucher.saveVoucher')}</Typography>
              </Button>
              {CANCELABLE.includes(workerVoucher.status) && canCancelVoucher(workerVoucher) && (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<CancelIcon />}
                  onClick={openCancelDialog}
                >
                  <Typography variant="body2">{formatMessage('workerVoucher.navigateToTheBill.cancelVoucher')}</Typography>
                </Button>
              )}
              {PRINTABLE.includes(workerVoucher.status) && canPrintVoucher(workerVoucher) && (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<PrintIcon />}
                  // disabled={!workerVoucher.billId || isTheVoucherExpired(workerVoucher)}
                  onClick={(e) => {
                    e.preventDefault();

                    if (isAssignedStatus) {
                      handlePrint(null, () => voucherPrintTemplateRef.current);
                      return;
                    }

                    openPrintConfirmationModal();
                  }}
                >
                  <Typography variant="body2">{formatMessage('workerVoucher.printVoucher')}</Typography>
                </Button>
              )}
              <Button
                size="small"
                variant="contained"
                color="primary"
                disabled={!workerVoucher.billId}
                startIcon={<ReceiptIcon />}
                onClick={redirectToTheLinkedBill}
              >
                <Typography variant="body2">{formatMessage('workerVoucher.navigateToTheBill.tooltip')}</Typography>
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Divider />
      <VoucherDetailsVoucher
        workerVoucher={workerVoucher}
        edited={edited}
        onEditedChanged={onEditedChanged}
        classes={classes}
        formatMessage={formatMessage}
        formatDateTimeFromISO={formatDateTimeFromISO}
      />
      <VoucherDetailsWorker workerVoucher={workerVoucher} readOnly={readOnly} classes={classes} />
      <VoucherDetailsEmployer workerVoucher={workerVoucher} readOnly={readOnly} classes={classes} />
      <VoucherGenericPrintModal
        open={isPrintConfirmationModalOpen}
        onClose={closePrintConfirmationModal}
        onConfirm={onGenericVoucherPrint}
      />
      <SelectDialog
        confirmState={isCancelDialogOpen}
        onConfirm={onCancelVoucherConfirm}
        onClose={closeCancelDialog}
        module="workerVoucher"
        confirmTitle="VoucherDetailsPanel.cancelDialog.title"
        confirmMessage="VoucherDetailsPanel.cancelDialog.message"
        confirmationButton="VoucherDetailsPanel.cancelDialog.confirm"
        rejectionButton="VoucherDetailsPanel.cancelDialog.cancel"
      />
      <div style={{ display: 'none' }}>
        <VoucherDetailsPrintTemplate
          ref={voucherPrintTemplateRef}
          logo={logo}
          workerVoucher={workerVoucher}
          isAssignedStatus={isAssignedStatus}
        />
      </div>
    </div>
  );
}

export default VoucherDetailsPanel;
