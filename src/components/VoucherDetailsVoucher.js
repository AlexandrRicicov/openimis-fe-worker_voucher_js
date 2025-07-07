import React from 'react';

import { Grid, Divider } from '@material-ui/core';

import { PublishedComponent, TextInput, NumberInput } from '@openimis/fe-core';
import WorkerVoucherStatusPicker from '../pickers/WorkerVoucherStatusPicker';
import VoucherQRCode from './VoucherQRCode';
import { trimDate } from '../utils/utils';

function VoucherDetailsVoucher({
  workerVoucher, edited, onEditedChanged, classes, formatMessage, formatDateTimeFromISO,
}) {
  return (
    <>
      <Grid container style={{ marginTop: '12px' }}>
        <Grid item xs={3}>
          <VoucherQRCode voucher={workerVoucher} />
        </Grid>
        <Grid item container xs={9}>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.code"
              value={workerVoucher?.code}
              readOnly
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <WorkerVoucherStatusPicker
              nullLabel={formatMessage('workerVoucher.placeholder.any')}
              withLabel
              value={workerVoucher?.status}
              readOnly
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label="workerVoucher.assignedDate"
              value={trimDate(workerVoucher?.assignedDate)}
              readOnly
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label="workerVoucher.dateOfAssignment"
              value={formatDateTimeFromISO(workerVoucher?.dateOfAssignment)}
              readOnly
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Grid>
          {/* <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label="workerVoucher.createdDate"
              value={formatDateTimeFromISO(workerVoucher?.dateCreated)}
              readOnly
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label="workerVoucher.expiryDate"
              value={trimDate(workerVoucher?.expiryDate)}
              readOnly
            />
          </Grid> */}
          <Grid item xs={3} className={classes.item}>
            <TextInput
              type="time"
              module="workerVoucher"
              label="workerVoucher.startTime"
              value={workerVoucher?.startTime || ''}
              readOnly
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.workPlace"
              value={workerVoucher?.workPlace || ''}
              readOnly
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.activity"
              value={workerVoucher?.activity || ''}
              readOnly
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.negotiated"
              value={workerVoucher?.negotiated || ''}
              readOnly
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.endTime"
              value={edited?.endTime || workerVoucher?.endTime || ''}
              onChange={(endTime) => onEditedChanged({ ...edited, endTime })}
              readOnly={false}
              type="time"
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <NumberInput
              module="workerVoucher"
              label="workerVoucher.paid"
              value={edited?.paid || workerVoucher?.paid || ''}
              onChange={(paid) => onEditedChanged({ ...edited, paid })}
              readOnly={false}
              min={0}
              displayZero
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}

export default VoucherDetailsVoucher;
