import React from 'react';

import {
  Paper, Grid, Typography, Divider,
} from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';

import {
  FormattedMessage,
  PublishedComponent,
  FormPanel,
  TextInput,
  NumberInput,
  withModulesManager,
  createFieldsBasedOnJSON,
  renderInputComponent,
  WarningBox,
  formatMessage,
  formatMessageWithValues,
} from '@openimis/fe-core';
import { MODULE_NAME, DEFAULT, EMPTY_STRING } from '../constants';

const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
});

class WorkerMasterPanel extends FormPanel {
  constructor(props) {
    super(props);
    this.workerVoucherCountLimit = props.modulesManager.getConf(
      'fe-worker_voucher',
      'workerVoucherCountLimit',
      DEFAULT.WORKER_VOUCHER_COUNT_LIMIT,
    );
  }

  render() {
    const {
      classes,
      edited,
      title = 'worker',
      titleParams = { label: '' },
      readOnly = !!edited?.uuid,
      intl,
      workerVoucherCount = 0,
    } = this.props;

    const createdFields = createFieldsBasedOnJSON(
      typeof edited?.jsonExt === 'object' || !edited?.jsonExt ? '' : edited.jsonExt,
      'additional_fields',
    );

    const limitReached = workerVoucherCount >= this.workerVoucherCountLimit;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container className={classes.tableTitle}>
              <Grid item xs={3} container alignItems="center" className={classes.item}>
                <Typography variant="h5">
                  {edited?.regularId ? (
                    <FormattedMessage
                      module="workerVoucher"
                      id="workerVoucher.worker.regularIdHeader"
                      values={{ regularId: edited.regularId }}
                    />
                  ) : (
                    <FormattedMessage module="workerVoucher" id={title} values={titleParams} />
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            {limitReached && (
              <>
                <Grid container className={classes.item}>
                  <WarningBox
                    title={formatMessage(intl, MODULE_NAME, 'workerVoucher.worker.warning.limit')}
                    description={formatMessageWithValues(
                      intl,
                      MODULE_NAME,
                      'workerVoucher.worker.warning.limitReached',
                      {
                        limit: this.workerVoucherCountLimit,
                      },
                    )}
                    xs={12}
                  />
                </Grid>
                <Divider />
              </>
            )}
            {edited?.uuid && (
              <>
                <Grid container className={classes.item}>
                  <Grid item xs={4} className={classes.item}>
                    <PublishedComponent
                      pubRef="insuree.Avatar"
                      photo={edited?.photo}
                      readOnly
                      withMeta={false}
                    />
                  </Grid>
                </Grid>
                <Divider />
              </>
            )}
            <Grid container className={classes.item}>
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="insuree.InsureeNumberInput"
                  module="workerVoucher"
                  label="workerVoucher.worker.chfId"
                  required
                  readOnly={readOnly}
                  value={edited?.chfId ?? EMPTY_STRING}
                  editedId={edited?.uuid}
                  onChange={(v) => this.updateAttribute('chfId', v)}
                />
              </Grid>
              <Grid item xs={4} className={classes.item}>
                <TextInput
                  module="workerVoucher"
                  label="workerVoucher.worker.lastName"
                  required
                  readOnly={readOnly}
                  value={edited?.lastName ?? EMPTY_STRING}
                  onChange={(v) => this.updateAttribute('lastName', v)}
                />
              </Grid>
              <Grid item xs={4} className={classes.item}>
                <TextInput
                  module="workerVoucher"
                  label="workerVoucher.worker.otherNames"
                  required
                  readOnly={readOnly}
                  value={edited?.otherNames ?? EMPTY_STRING}
                  onChange={(v) => this.updateAttribute('otherNames', v)}
                />
              </Grid>
              {edited?.uuid && (
                <Grid item xs={4} className={classes.item}>
                  <NumberInput
                    module="workerVoucher"
                    label="workerVoucher.worker.assignedVouchers"
                    displayZero
                    readOnly
                    value={workerVoucherCount}
                  />
                </Grid>
              )}
              {edited?.uuid
                && createdFields.map((field, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid item xs={4} className={classes.item} key={index}>
                    {renderInputComponent(MODULE_NAME, field, true)}
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(WorkerMasterPanel)));
