import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  CircularProgress,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useTranslations, useModulesManager, NumberInput, AmountInput,
} from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';
import { formatValidationError } from '../utils/utils';

export const useStyles = makeStyles((theme) => ({
  primaryButton: { ...theme.dialog.primaryButton, padding: '6px 12px' },
  secondaryButton: theme.dialog.secondaryButton,
  item: theme.paper.item,
}));

function VoucherAssignmentConfirmModal({
  openState,
  onClose,
  onConfirm,
  isLoading,
  assignmentSummary,
  readOnly = true,
}) {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const [acceptAssignment, setAcceptAssignment] = useState(false);
  const assignButtonDisabled = !acceptAssignment || isLoading || assignmentSummary?.errors;

  const renderContent = () => {
    if (assignmentSummary?.errors) {
      return (
        <div>
          {assignmentSummary.errors.map(({ message, extensions }, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <Typography color="error">
                {`${index + 1}. ${formatValidationError(message, extensions, formatMessage, formatMessageWithValues)}`}
              </Typography>
              {extensions?.existing_vouchers && (
                <div style={{ marginTop: '8px', marginLeft: '16px' }}>
                  {extensions.existing_vouchers.map((voucher, voucherIndex) => (
                    <Typography key={voucherIndex} variant="body2" color="textSecondary" style={{ marginTop: '4px' }}>
                      • {voucher}
                    </Typography>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <Grid container>
        <Grid item xs={4} className={classes.item}>
          <NumberInput
            module="workerVoucher"
            label="workerVoucher.vouchersQuantity"
            value={assignmentSummary?.data?.assignVouchersValidation?.count}
            readOnly={readOnly}
          />
        </Grid>
        {/* <Grid item xs={4} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.pricePerVoucher"
            value={assignmentSummary?.data?.assignVouchersValidation?.pricePerVoucher}
            readOnly={readOnly}
            displayZero
          />
        </Grid>
        <Grid item xs={4} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.toBePaid"
            value={assignmentSummary?.data?.assignVouchersValidation?.price}
            readOnly={readOnly}
            displayZero
          />
        </Grid> */}
        <FormControlLabel
          style={{ margin: '12px 0 0 0' }}
          control={(
            <Checkbox
              color="primary"
              checked={acceptAssignment}
              onChange={(e) => setAcceptAssignment(e.target.checked)}
              disabled={isLoading}
            />
          )}
          label={formatMessage('workerVoucher.assign.confirmation')}
        />
      </Grid>
    );
  };

  return (
    <Dialog open={openState} onClose={onClose} disableBackdropClick={isLoading}>
      <DialogTitle>{formatMessage('workerVoucher.VoucherAssignmentConfirmModal.title')}</DialogTitle>
      <Divider />
      <DialogContent>{renderContent()}</DialogContent>
      <Divider style={{ margin: '12px 0' }} />
      <DialogActions>
        <Button onClick={onClose} className={classes.secondaryButton} disabled={isLoading}>
          {formatMessage('workerVoucher.close')}
        </Button>
        {assignButtonDisabled ? (
          <Tooltip title={formatMessage('workerVoucher.VoucherAssignmentConfirmModal.confirm.tooltip')}>
            <span>
              <Button
                startIcon={isLoading && <CircularProgress size={16} color="secondary" />}
                onClick={onConfirm}
                autoFocus
                className={classes.primaryButton}
                disabled={assignButtonDisabled}
              >
                {formatMessage('workerVoucher.VoucherAssignmentConfirmModal.confirm')}
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button onClick={onConfirm} autoFocus className={classes.primaryButton} disabled={assignButtonDisabled}>
            {formatMessage('workerVoucher.VoucherAssignmentConfirmModal.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default VoucherAssignmentConfirmModal;
