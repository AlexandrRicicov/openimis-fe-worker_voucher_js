import React from 'react';
import _debounce from 'lodash/debounce';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { PublishedComponent, TextInput } from '@openimis/fe-core';
import { CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';
import WorkerVoucherStatusPicker from '../pickers/WorkerVoucherStatusPicker';

export const useStyles = makeStyles((theme) => ({
  form: {
    padding: '0 0 10px 0',
    width: '100%',
  },
  item: {
    padding: theme.spacing(1),
  },
}));

function VoucherFilter({ filters, onChangeFilters, formatMessage }) {
  const classes = useStyles();

  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;
  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const onChangeStringFilter = (filterName, lookup = null) => (value) => {
    if (lookup) {
      debouncedOnChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}_${lookup}: "${value}"`,
        },
      ]);
    } else {
      onChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}: "${value}"`,
        },
      ]);
    }
  };

  const createDateTimeStamp = (key, value) => {
    if (!key || !value) return EMPTY_STRING;

    const startStamp = `${value}T00:00:00`;
    const endStamp = `${value}T23:59:59`;

    return `${key}_Gte: "${startStamp}", ${key}_Lte: "${endStamp}"`;
  };

  return (
    <Grid container className={classes.form}>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.code"
          value={filterTextFieldValue('code')}
          onChange={onChangeStringFilter('code', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <WorkerVoucherStatusPicker
          value={filterValue('status')}
          nullLabel={formatMessage('workerVoucher.placeholder.any')}
          withLabel
          withNull
          onChange={(status) => onChangeFilters([
            {
              id: 'status',
              value: status,
              filter: status ? `status: ${status}` : '',
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="workerVoucher"
          label="workerVoucher.assignedDate"
          value={filterValue('assignedDate')}
          onChange={(assignedDate) => onChangeFilters([
            {
              id: 'assignedDate',
              value: assignedDate,
              filter: createDateTimeStamp('assignedDate', assignedDate),
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="workerVoucher"
          label="workerVoucher.dateOfAssignment"
          value={filterValue('dateOfAssignment')}
          onChange={(dateOfAssignment) => onChangeFilters([
            {
              id: 'dateOfAssignment',
              value: dateOfAssignment,
              filter: createDateTimeStamp('dateOfAssignment', dateOfAssignment),
            },
          ])}
        />
      </Grid>
      {/* <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="workerVoucher"
          label="workerVoucher.expiryDate"
          value={filterValue('expiryDate')}
          onChange={(expiryDate) => onChangeFilters([
            {
              id: 'expiryDate',
              value: expiryDate,
              filter: createDateTimeStamp('expiryDate', expiryDate),
            },
          ])}
        />
      </Grid> */}
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.employer.code"
          value={filterTextFieldValue('policyholder_Code')}
          onChange={onChangeStringFilter('policyholder_Code', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.employer.tradename"
          value={filterTextFieldValue('policyholder_TradeName')}
          onChange={onChangeStringFilter('policyholder_TradeName', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.worker.code"
          value={filterTextFieldValue('insuree_ChfId')}
          onChange={onChangeStringFilter('insuree_ChfId', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.worker.lastName"
          value={filterTextFieldValue('insuree_LastName')}
          onChange={onChangeStringFilter('insuree_LastName', CONTAINS_LOOKUP)}
        />
      </Grid>
    </Grid>
  );
}

export default VoucherFilter;
