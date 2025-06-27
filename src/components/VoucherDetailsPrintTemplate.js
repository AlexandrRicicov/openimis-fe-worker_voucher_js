import React, {
  forwardRef, useState, useEffect, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';

import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTranslations, useModulesManager } from '@openimis/fe-core';
import { EMPTY_STRING, MODULE_NAME, REF_GET_BILL_LINE_ITEM } from '../constants';
import { extractEmployerName, extractWorkerName, trimDate } from '../utils/utils';
import VoucherQRCode from './VoucherQRCode';

const useStyles = makeStyles((theme) => ({
  '@global': {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '580px',
    padding: '12px',
    justifyContent: 'space-between',
    borderLeft: `10px solid ${theme.palette.primary.main}`,
    borderRight: `10px solid ${theme.palette.primary.main}`,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  voucherValue: {
    fontSize: '48px',
    fontWeight: 900,
    letterSpacing: '-2px',
    textAlign: 'left',
  },
  annotation: {
    fontSize: '12px',
    fontStyle: 'italic',
  },
  voucherTitle: {
    fontSize: '28px',
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  voucherDetail: {
    fontSize: '16px',
    fontWeight: 400,
  },
  workerInfo: {
    fontSize: '16px',
    fontWeight: 500,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
  },
  manualFill: {
    gap: '16px',
  },
  assignedFields: {
    gap: '4px',
  },
}));

const VoucherDetailsPrintTemplate = forwardRef(({ workerVoucher, logo, isAssignedStatus }, ref) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues, formatDateTimeFromISO } = useTranslations(
    MODULE_NAME,
    modulesManager,
  );
  const [voucherValue, setVoucherValue] = useState(null);
  const getBillLineItem = useMemo(() => modulesManager.getRef(REF_GET_BILL_LINE_ITEM), [modulesManager]);

  // Function to format time from HH:MM:SS to HH:MM
  const formatTime = (timeString) => {
    if (!timeString) return '';
    // If it's already in HH:MM format, return as is
    if (timeString.length === 5 && timeString.includes(':')) return timeString;
    // If it's in HH:MM:SS format, extract HH:MM
    if (timeString.length === 8 && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  useEffect(() => {
    const fetchVoucherValue = async () => {
      try {
        const value = await dispatch(getBillLineItem([`lineId: "${workerVoucher.uuid}"`])).then(
          (response) => response?.payload?.data?.billItem?.edges?.[0]?.node?.unitPrice,
        );

        setVoucherValue(value);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching voucher value:', error);
      }
    };

    fetchVoucherValue();
  }, [dispatch, getBillLineItem, workerVoucher.uuid]);

  return (
    <div ref={ref} className={classes.container}>
      <div className={classes.section}>
        {isAssignedStatus ? (
          EMPTY_STRING
        ) : (
          <p className={classes.annotation}>{formatMessage('workerVoucher.template.validityAnnotation')}</p>
        )}

        <div>
          <p className={classes.voucherTitle}>{formatMessage('workerVoucher.template.employmentVoucher')}</p>
          <p className={classes.voucherDetail}>
            {formatMessageWithValues('workerVoucher.template.voucherIdNo', {
              idNo: workerVoucher.code,
            })}
          </p>
          <p className={classes.voucherDetail}>
            {formatMessageWithValues('workerVoucher.template.voucherEmployer', {
              employer: extractEmployerName(workerVoucher.policyholder),
            })}
          </p>
        </div>

        <div
          className={clsx({
            [classes.fields]: true,
            [classes.manualFill]: !isAssignedStatus,
            [classes.assignedFields]: isAssignedStatus,
          })}
        >
          <div>
            <p className={classes.workerInfo}>{extractWorkerName(workerVoucher.insuree, isAssignedStatus)}</p>
            <Divider />
            <p className={classes.annotation}>{formatMessage('workerVoucher.template.workerAnnotation')}</p>
          </div>
          <div>
            <p className={classes.workerInfo}>
              {isAssignedStatus && workerVoucher?.assignedDate ? trimDate(workerVoucher.assignedDate) : EMPTY_STRING}
            </p>
            <Divider />
            <p className={classes.annotation}>{formatMessage('workerVoucher.template.validOn')}</p>
          </div>
          <div>
            <p className={classes.workerInfo}>
              {isAssignedStatus && workerVoucher?.dateOfAssignment
                ? formatDateTimeFromISO(workerVoucher.dateOfAssignment)
                : EMPTY_STRING}
            </p>
            <Divider />
            <p className={classes.annotation}>{formatMessage('workerVoucher.template.dateOfAssignment')}</p>
          </div>

          {/* New fields section - arranged in two columns */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <div style={{ flex: 1 }}>
              <div>
                <p className={classes.workerInfo}>
                  {isAssignedStatus && workerVoucher?.startTime ? formatTime(workerVoucher.startTime) : 'precompletat'}
                </p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.startTime')}</p>
              </div>
              <div style={{ marginTop: '8px' }}>
                <p className={classes.workerInfo}>
                  {isAssignedStatus && workerVoucher?.workPlace ? workerVoucher.workPlace : 'precompletat'}
                </p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.workPlace')}</p>
              </div>
              <div style={{ marginTop: '8px' }}>
                <p className={classes.workerInfo}>
                  {isAssignedStatus && workerVoucher?.negotiated ? `${workerVoucher.negotiated} ${formatMessage('currency')}` : 'precompletat'}
                </p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.negotiated')}</p>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div>
                <p className={classes.workerInfo}>
                  {isAssignedStatus && workerVoucher?.endTime ? formatTime(workerVoucher.endTime) : 'precompletat'}
                </p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.endTime')}</p>
              </div>
              <div style={{ marginTop: '8px' }}>
                <p className={classes.workerInfo}>
                  {isAssignedStatus && workerVoucher?.activity ? workerVoucher.activity : 'precompletat'}
                </p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.activity')}</p>
              </div>
              <div style={{ marginTop: '8px' }}>
                <p className={classes.workerInfo}>
                  {isAssignedStatus && workerVoucher?.paid ? `${workerVoucher.paid} ${formatMessage('currency')}` : 'precompletat'}
                </p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.paid')}</p>
              </div>
            </div>
          </div>

          <p className={classes.voucherValue}>{`${voucherValue || 0} ${formatMessage('currency')}`}</p>

          {/* Signature fields section */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '40px' }}>
                <p className={classes.workerInfo}></p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.signatureStart')}</p>
              </div>
              <div>
                <p className={classes.workerInfo}></p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.signaturePayment')}</p>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '40px' }}>
                <p className={classes.workerInfo}></p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.signatureEnd')}</p>
              </div>
              <div>
                <p className={classes.workerInfo}></p>
                <Divider />
                <p className={classes.annotation}>{formatMessage('workerVoucher.template.stampBeneficiary')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.ministryLogo}>
          <img
            src={logo}
            style={{ width: '240px' }}
            alt="Logo of Ministerul Muncii și Protecţiei Sociale al Republicii Moldova"
          />
        </div>
        <div>
          <VoucherQRCode voucher={workerVoucher} bgColor="#FFFFFF" size={256} />
        </div>
      </div>
    </div>
  );
});

export default VoucherDetailsPrintTemplate;
