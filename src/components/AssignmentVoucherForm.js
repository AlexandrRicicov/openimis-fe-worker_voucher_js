import React, { useState, useEffect } from 'react';

import { Grid, Divider, Typography } from '@material-ui/core';

import { PublishedComponent, TextInput } from '@openimis/fe-core';
import WorkerRowForm from './WorkerRowForm';

function AssignmentVoucherForm({
  classes, readOnly = false, edited, onEditedChange, formatMessage,
}) {
  const [workerRowsData, setWorkerRowsData] = useState({});

  // Sync worker rows data with selected workers
  useEffect(() => {
    const workers = edited?.workers || [];
    const currentWorkerIds = new Set(workers.map(w => w.uuid));
    const existingWorkerIds = new Set(Object.keys(workerRowsData));

    // Check if workers have changed
    const workersChanged = currentWorkerIds.size !== existingWorkerIds.size ||
      [...currentWorkerIds].some(id => !existingWorkerIds.has(id));

    if (workersChanged) {
      const newWorkerRowsData = {};

      // Add workers with default or existing data
      workers.forEach(worker => {
        newWorkerRowsData[worker.uuid] = workerRowsData[worker.uuid] || {
          workerId: worker.uuid,
          worker: worker,
          startTime: '07:00',
          workPlace: '',
          activity: '',
          negotiated: 0,
        };
      });

      setWorkerRowsData(newWorkerRowsData);
    }
  }, [edited?.workers]);

  // Send workersData to parent component whenever workerRowsData changes
  useEffect(() => {
    if (Object.keys(workerRowsData).length > 0) {
      onEditedChange({
        ...edited,
        workersData: workerRowsData
      });
    }
  }, [workerRowsData]);

  const handleWorkerDataChange = (workerId, workerData) => {
    const updatedWorkerRowsData = {
      ...workerRowsData,
      [workerId]: workerData,
    };

    setWorkerRowsData(updatedWorkerRowsData);
    // workersData will be automatically sent to parent via useEffect
  };

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12} className={classes.item}>
          <PublishedComponent
            module="workerVoucher"
            pubRef="workerVoucher.WorkerMultiplePicker"
            readOnly={readOnly}
            required
            classes={classes}
            value={edited?.workers ?? []}
            onChange={(_, workers) => {
              onEditedChange({ ...edited, workers });
            }}
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />

      {/* Worker Rows Section */}
      {edited?.workers && edited.workers.length > 0 && (
        <div style={{ margin: '0 16px' }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginBottom: '16px', marginTop: '8px' }}>
                {formatMessage('workerVoucher.workerAssignmentDetails')}
              </Typography>
            </Grid>
          </Grid>

          {edited.workers.map((worker) => (
            <WorkerRowForm
              key={worker.uuid}
              worker={worker}
              workerData={workerRowsData[worker.uuid]}
              onWorkerDataChange={handleWorkerDataChange}
              readOnly={readOnly}
              formatMessage={formatMessage}
            />
          ))}

          <Divider style={{ margin: '12px 0' }} />
        </div>
      )}

      <Grid item container xs={12}>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.employer.code"
            value={edited?.employer?.code ?? formatMessage('workerVoucher.WorkerDateRangePicker.notAvailable')}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.employer.tradename"
            value={edited?.employer?.tradeName ?? formatMessage('workerVoucher.WorkerDateRangePicker.notAvailable')}
            readOnly
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
      <Grid item container xs={12}>
        <PublishedComponent
          module="workerVoucher"
          pubRef="workerVoucher.WorkerDateRangePicker"
          readOnly={readOnly}
          required
          classes={classes}
          value={edited?.dateRanges ?? []}
          onChange={(dateRanges) => onEditedChange({ ...edited, dateRanges })}
        />
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}

export default AssignmentVoucherForm;
