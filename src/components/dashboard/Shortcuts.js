/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';

import { Typography } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import People from '@material-ui/icons/People';
import { makeStyles } from '@material-ui/styles';

import { useHistory, useModulesManager, useTranslations } from '@openimis/fe-core';

import AssessmentIcon from '@material-ui/icons/Assessment';
import {
  MODULE_NAME,
  REF_ROUTE_ASSIGN_VOUCHER,
  REF_ROUTE_VOUCHER_REPORT,
  REF_ROUTE_WORKER_ADD,
} from '../../constants';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(4),
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    padding: theme.spacing(2),
  },
  shortcut: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    color: theme.palette.secondary.main,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '270px',
    borderRadius: '10px',
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(3),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

const SHORTCUT_LIST = [
  {
    content: 'workerVoucher.Shortcuts.addWorker',
    link: REF_ROUTE_WORKER_ADD,
    icon: People,
  },
  {
    content: 'workerVoucher.Shortcuts.report',
    link: REF_ROUTE_VOUCHER_REPORT,
    icon: AssessmentIcon,
  },
  {
    content: 'workerVoucher.Shortcuts.assignVoucher',
    link: REF_ROUTE_ASSIGN_VOUCHER,
    icon: GroupAddIcon,
  },
];

function Shortcut({ link, content, icon: Icon }) {
  const classes = useStyles();
  const history = useHistory();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const onClick = () => {
    history.push(`/${modulesManager.getRef(link)}`);
  };

  return (
    <button type="button" className={classes.shortcut} onClick={onClick}>
      <Icon />
      <Typography>{formatMessage(content)}</Typography>
    </button>
  );
}

function Shortcuts() {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      {SHORTCUT_LIST.map(({ content, link, icon }) => (
        <Shortcut key={link} link={link} content={content} icon={icon} />
      ))}
    </div>
  );
}

export default Shortcuts;
