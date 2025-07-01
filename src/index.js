/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */

import React from 'react';


import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import People from '@material-ui/icons/People';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import AssessmentIcon from '@material-ui/icons/Assessment';

import { FormattedMessage } from '@openimis/fe-core';
import {
  ADMIN_RIGHT,
  EMPLOYER_RIGHT_SEARCH,
  INSPECTOR_RIGHT,
  RIGHT_GROUP_EDIT,
  RIGHT_GROUP_SEARCH,
  RIGHT_WORKER_ADD,
  RIGHT_WORKER_EDIT,
  RIGHT_WORKER_SEARCH,
  VOUCHER_PRICE_MANAGEMENT_RIGHT,
  VOUCHER_RIGHT_SEARCH,
} from './constants';
import VoucherAcquirementPage from './pages/VoucherAcquirementPage';
import VoucherAssignmentPage from './pages/VoucherAssignmentPage';
import VoucherDetailsPage from './pages/VoucherDetailsPage';
import VouchersPage from './pages/VouchersPage';
import WorkerVoucherStatusPicker from './pickers/WorkerVoucherStatusPicker';
import reducer from './reducer';
import messages_en from './translations/en.json';
import VoucherAcquirementMethodPicker from './pickers/VoucherAcquirementMethodPicker';
import WorkerMultiplePicker from './pickers/WorkerMultiplePicker';
import WorkerDateRangePicker from './pickers/WorkerDateRangePicker';
import VoucherPriceManagement from './pages/VoucherPriceManagement';
import MobileAppPasswordManagement from './pages/MobileAppPasswordManagement';
import BillVoucherHeadPanel from './components/BillVoucherHeadPanel';
import WorkersPage from './pages/WorkersPage';
import WorkerDetailsPage from './pages/WorkerDetailsPage';
import WorkerSearcherSelectActions from './components/WorkerSearcherSelectActions';
import GroupsPage from './pages/GroupsPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import PublicVoucherDetailsPage from './pages/PublicVoucherDetailsPage';
import DashboardPage from './pages/DashboardPage';
import MPassLoginButton from './components/MPassLoginButton';
import PublicGDPRPage from './pages/PublicGDPRPage';
import ReportPage from './pages/ReportPage';


const ROUTE_PUBLIC_WORKER_VOUCHER_PAGE = 'voucher/check';
const ROUTE_WORKER_VOUCHERS_LIST = 'voucher/vouchers';
const ROUTE_WORKER_VOUCHER = 'voucher/vouchers/voucher';
const ROUTE_WORKER_VOUCHER_ACQUIREMENT = 'voucher/acquirement';
const ROUTE_WORKER_VOUCHER_ASSIGNMENT = 'voucher/assignment';
const ROUTE_WORKER_VOUCHER_PRICE_MANAGEMENT = 'voucher/price';
const ROUTE_CHANGE_MOBILE_APP_PASSWORD = 'profile/mobile/password';
const ROUTE_WORKER_VOUCHER_WORKER_LIST = 'voucher/vouchers/workers';
const ROUTE_WORKER_VOUCHER_WORKER = 'voucher/vouchers/workers/worker';
const ROUTE_GROUP_LIST = 'voucher/groups';
const ROUTE_GROUP = 'voucher/groups/group';
const ROUTE_GDPR = 'voucher/gdpr';
const ROUTE_REPORT = 'voucher/report';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  reducers: [{ key: 'workerVoucher', reducer }],
  refs: [
    { key: 'workerVoucher.route.workerVouchers', ref: ROUTE_WORKER_VOUCHERS_LIST },
    { key: 'workerVoucher.route.workerVoucher', ref: ROUTE_WORKER_VOUCHER },
    { key: 'workerVoucher.route.workers', ref: ROUTE_WORKER_VOUCHER_WORKER_LIST },
    { key: 'workerVoucher.route.worker', ref: ROUTE_WORKER_VOUCHER_WORKER },
    { key: 'workerVoucher.route.groups', ref: ROUTE_GROUP_LIST },
    { key: 'workerVoucher.route.group', ref: ROUTE_GROUP },
    { key: 'workerVoucher.route.assignVoucher', ref: ROUTE_WORKER_VOUCHER_ASSIGNMENT },
    { key: 'workerVoucher.route.acquireVoucher', ref: ROUTE_WORKER_VOUCHER_ACQUIREMENT },
    { key: 'workerVoucher.route.gdpr', ref: ROUTE_GDPR },
    { key: 'workerVoucher.WorkerVoucherStatusPicker', ref: WorkerVoucherStatusPicker },
    { key: 'workerVoucher.VoucherAcquirementMethodPicker', ref: VoucherAcquirementMethodPicker },
    { key: 'workerVoucher.WorkerMultiplePicker', ref: WorkerMultiplePicker },
    { key: 'workerVoucher.WorkerDateRangePicker', ref: WorkerDateRangePicker },
  ],
  'worker.MainMenu': [
    {
      text: <FormattedMessage module="workerVoucher" id="menu.workersList" />,
      icon: <People />,
      route: `/${ROUTE_WORKER_VOUCHER_WORKER_LIST}`,
      filter: (rights) => [RIGHT_WORKER_SEARCH].some((right) => rights.includes(right)),
      id: 'worker.workersList',
    },
    {
      text: <FormattedMessage module="workerVoucher" id="menu.groupList" />,
      icon: <TransferWithinAStationIcon />,
      route: `/${ROUTE_GROUP_LIST}`,
      filter: (rights) => [RIGHT_GROUP_SEARCH].some((right) => rights.includes(right)),
      id: 'worker.groupList',
    },
    // {
    //   text: <FormattedMessage module="workerVoucher" id="menu.voucherAssignment" />,
    //   icon: <GroupAddIcon />,
    //   route: `/${ROUTE_WORKER_VOUCHER_ASSIGNMENT}`,
    //   filter: (rights, config) => config.genericVoucherEnabled
    //     && [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right))
    //     && ![INSPECTOR_RIGHT, ADMIN_RIGHT].some((right) => rights.includes(right)),
    //   id: 'worker.voucherAssignment',
    // },
    {
      text: <FormattedMessage module="workerVoucher" id="menu.voucherList" />,
      icon: <ListAltIcon />,
      route: `/${ROUTE_WORKER_VOUCHERS_LIST}`,
      filter: (rights) => [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right)),
      id: 'worker.voucherList',
    },
    {
      text: <FormattedMessage module="workerVoucher" id="menu.voucherAssignment" />,
      icon: <LocalAtmIcon />,
      route: `/${ROUTE_WORKER_VOUCHER_ASSIGNMENT}`,
      filter: (rights) => [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right))
        && ![INSPECTOR_RIGHT, ADMIN_RIGHT].some((right) => rights.includes(right)),
      id: 'worker.voucherAssignment',
    },
    {
      text: <FormattedMessage module="workerVoucher" id="menu.report" />,
      icon: <AssessmentIcon />,
      route: `/${ROUTE_REPORT}`,
      filter: (rights) => [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right)),
      id: 'worker.report',
    },
  ],
  'admin.voucher.MainMenu': [
    {
      text: <FormattedMessage module="workerVoucher" id="menu.priceManagement" />,
      icon: <MonetizationOnIcon />,
      route: `/${ROUTE_WORKER_VOUCHER_PRICE_MANAGEMENT}`,
      filter: (rights) => [VOUCHER_PRICE_MANAGEMENT_RIGHT].some((right) => rights.includes(right)),
    },
  ],
  'core.UnauthenticatedRouter': [
    {
      path: `${ROUTE_PUBLIC_WORKER_VOUCHER_PAGE}/:voucher_uuid?`,
      component: PublicVoucherDetailsPage,
    },
    {
      path: ROUTE_GDPR,
      component: PublicGDPRPage,
    },
  ],
  'core.Router': [
    {
      path: ROUTE_GROUP_LIST,
      component: GroupsPage,
      requiredRights: [RIGHT_GROUP_SEARCH],
    },
    {
      path: `${ROUTE_GROUP}/:group_uuid?`,
      component: GroupDetailsPage,
      requiredRights: [RIGHT_GROUP_SEARCH, RIGHT_GROUP_EDIT],
    },
    {
      path: ROUTE_WORKER_VOUCHERS_LIST,
      component: VouchersPage,
      requiredRights: [VOUCHER_RIGHT_SEARCH],
    },
    {
      path: `${ROUTE_WORKER_VOUCHER}/:voucher_uuid?`,
      component: VoucherDetailsPage,
      requiredRights: [VOUCHER_RIGHT_SEARCH],
    },
    {
      path: ROUTE_WORKER_VOUCHER_WORKER_LIST,
      component: WorkersPage,
      requiredRights: [RIGHT_WORKER_SEARCH],
    },
    {
      path: `${ROUTE_WORKER_VOUCHER_WORKER}/:worker_uuid?`,
      component: WorkerDetailsPage,
      requiredRights: [RIGHT_WORKER_ADD, RIGHT_WORKER_EDIT],
    },
    {
      path: ROUTE_WORKER_VOUCHER_ACQUIREMENT,
      component: VoucherAcquirementPage,
      requiredRights: [EMPLOYER_RIGHT_SEARCH],
    },
    {
      path: ROUTE_WORKER_VOUCHER_ASSIGNMENT,
      component: VoucherAssignmentPage,
      requiredRights: [VOUCHER_RIGHT_SEARCH],
    },
    {
      path: ROUTE_WORKER_VOUCHER_PRICE_MANAGEMENT,
      component: VoucherPriceManagement,
      requiredRights: [VOUCHER_PRICE_MANAGEMENT_RIGHT],
    },
    {
      path: ROUTE_CHANGE_MOBILE_APP_PASSWORD,
      component: MobileAppPasswordManagement,
      requiredRights: [INSPECTOR_RIGHT, ADMIN_RIGHT],
    },
    {
      path: ROUTE_REPORT,
      component: ReportPage,
      requiredRights: [VOUCHER_RIGHT_SEARCH],
    },
  ],
  'profile.MainMenu': [
    {
      text: <FormattedMessage module="workerVoucher" id="menu.mobileAppPassword" />,
      icon: <VpnLockIcon />,
      route: `/${ROUTE_CHANGE_MOBILE_APP_PASSWORD}`,
      filter: (rights) => [INSPECTOR_RIGHT, ADMIN_RIGHT].some((right) => rights.includes(right)),
    },
  ],
  'workerVoucher.VoucherHeadPanel': [BillVoucherHeadPanel],
  'workerVoucher.WorkerSearcherAction.select': WorkerSearcherSelectActions,
  'home.HomePage.customDashboard': DashboardPage,
  'workerVoucher.MPassLoginButton': MPassLoginButton,
};

export const WorkerVoucherModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
