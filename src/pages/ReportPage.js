import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/styles';
import { Typography, Grid, Paper, Button } from '@material-ui/core';
import { useModulesManager, useTranslations, PublishedComponent, TextInput } from '@openimis/fe-core';
import { VOUCHER_RIGHT_SEARCH } from '../constants';
import AssessmentIcon from '@material-ui/icons/Assessment';

const useStyles = makeStyles((theme) => ({
    page: {
        ...theme.page,
        padding: theme.spacing(2),
    },
    paper: {
        ...theme.paper.paper,
        padding: theme.spacing(3),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
    form: {
        marginTop: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(3),
    },
    dateQuickButtons: {
        marginTop: theme.spacing(1),
        display: 'flex',
        gap: theme.spacing(1),
        flexWrap: 'wrap',
    },
    quickButton: {
        textTransform: 'none',
        fontSize: '0.75rem',
    },
}));

const MODULE_NAME = 'workerVoucher';

function ReportPage() {
    const modulesManager = useModulesManager();
    const classes = useStyles();
    const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
    const rights = useSelector((state) => (state.core?.user?.i_user?.rights ?? []));
    const { economicUnit } = useSelector((state) => state.policyHolder);

    const [filters, setFilters] = useState({
        dateFrom: null,
        dateTo: null,
        insureeChfId: '',
    });

    // Helper functions to get date ranges
    const formatDateForInput = (date) => {
        // Use local timezone to avoid timezone offset issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getThisMonthDates = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
            dateFrom: formatDateForInput(firstDay),
            dateTo: formatDateForInput(lastDay)
        };
    };

    const getLastMonthDates = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
            dateFrom: formatDateForInput(firstDay),
            dateTo: formatDateForInput(lastDay)
        };
    };

    const handleThisMonth = () => {
        const dates = getThisMonthDates();
        setFilters({ ...filters, dateFrom: dates.dateFrom, dateTo: dates.dateTo });
    };

    const handleLastMonth = () => {
        const dates = getLastMonthDates();
        setFilters({ ...filters, dateFrom: dates.dateFrom, dateTo: dates.dateTo });
    };

    const handleGenerateReport = () => {
        // Validate required fields
        if (!filters.dateFrom || !filters.dateTo) {
            alert(formatMessage('workerVoucher.vouchers.required'));
            return;
        }

        // Build query parameters
        const params = new URLSearchParams();
        params.set('date_from', filters.dateFrom);
        params.set('date_to', filters.dateTo);

        if (filters.insureeChfId) {
            params.set('insuree__chf_id', filters.insureeChfId);
        }

        // Get policyholderCode from economic unit context
        if (economicUnit?.code) {
            params.set('policyholder_code', economicUnit.code);
        }

        // Download file in the same tab
        const reportUrl = `/api/report/xlsx/worker_vouchers/?${params.toString()}`;
        console.log('Report download URL:', reportUrl);

        // Create temporary link and click it to download file
        const link = document.createElement('a');
        link.href = reportUrl;
        link.download = `worker_vouchers_${filters.dateFrom}_${filters.dateTo}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        rights.includes(VOUCHER_RIGHT_SEARCH) && (
            <div className={classes.page}>
                <Helmet title={formatMessage('workerVoucher.menu.report')} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <AssessmentIcon color="primary" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" className={classes.title}>
                                        {formatMessage('workerVoucher.menu.report')}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {economicUnit && (
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    <strong>{formatMessage('workerVoucher.report.selectedCompany')}:</strong> {economicUnit.code} - {economicUnit.tradeName}
                                </Typography>
                            )}

                            <div className={classes.form}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <PublishedComponent
                                            pubRef="core.DatePicker"
                                            value={filters.dateFrom}
                                            module="workerVoucher"
                                            required
                                            label="WorkerVoucherReport.dateFrom"
                                            onChange={(dateFrom) => setFilters({ ...filters, dateFrom })}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <PublishedComponent
                                            pubRef="core.DatePicker"
                                            value={filters.dateTo}
                                            module="workerVoucher"
                                            required
                                            label="WorkerVoucherReport.dateTo"
                                            onChange={(dateTo) => setFilters({ ...filters, dateTo })}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <div className={classes.dateQuickButtons}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                className={classes.quickButton}
                                                onClick={handleThisMonth}
                                            >
                                                {formatMessage('workerVoucher.report.thisMonth')}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                className={classes.quickButton}
                                                onClick={handleLastMonth}
                                            >
                                                {formatMessage('workerVoucher.report.lastMonth')}
                                            </Button>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextInput
                                            value={filters.insureeChfId}
                                            module="workerVoucher"
                                            label="WorkerVoucherReport.insureeChfId"
                                            type="number"
                                            onChange={(insureeChfId) => setFilters({ ...filters, insureeChfId })}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            startIcon={<AssessmentIcon />}
                                            onClick={handleGenerateReport}
                                            className={classes.button}
                                            disabled={!filters.dateFrom || !filters.dateTo}
                                        >
                                            {formatMessage('workerVoucher.generateReport')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    );
}

export default ReportPage; 