export const VOUCHER_RIGHT_SEARCH = 204001;
export const VOUCHER_RIGHT_UPDATE = 204002;
export const EMPLOYER_RIGHT_SEARCH = 203000;
export const VOUCHER_PRICE_MANAGEMENT_RIGHT = 205001;
export const INSPECTOR_RIGHT = 204005;
export const ADMIN_RIGHT = 204004;
export const RIGHT_WORKER_UPLOAD = 101102;
export const RIGHT_WORKER_SEARCH = 101101;
export const RIGHT_WORKER_ADD = 101102;
export const RIGHT_WORKER_EDIT = 101103;
export const RIGHT_WORKER_DELETE = 101104;
export const RIGHT_GROUP_SEARCH = 206001;
export const RIGHT_GROUP_ADD = 206002;
export const RIGHT_GROUP_EDIT = 206003;
export const RIGHT_GROUP_DELETE = 206004;
export const MODULE_NAME = 'workerVoucher';
export const MAX_CELLS = 8;

export const REF_ROUTE_GROUP_LIST = 'workerVoucher.route.groups';
export const REF_ROUTE_WORKER_VOUCHER = 'workerVoucher.route.workerVoucher';
export const REF_ROUTE_WORKER_VOUCHERS = 'workerVoucher.route.workerVouchers';
export const REF_ROUTE_BILL = 'bill.route.bill';
export const REF_ROUTE_WORKER_ADD = 'workerVoucher.route.worker';
export const REF_ROUTE_VOUCHER_REPORT = 'voucher.report';
export const REF_ROUTE_ASSIGN_VOUCHER = 'workerVoucher.route.assignVoucher';
export const REF_ROUTE_ACQUIRE_VOUCHER = 'workerVoucher.route.acquireVoucher';
export const REF_GET_BILL_LINE_ITEM = 'bill.action.fetchBillLineItems';
export const ECONOMIC_UNIT_STORAGE_KEY = 'userEconomicUnit';

export const MPAY_BILL_URL = '/msystems/mpay_payment/';
export const BILL_PAID_STATUS = '2';
export const DEFAULT_DEBOUNCE_TIME = 800;
export const DEFAULT_PAGE_SIZE = 10;
export const VOUCHER_PRICE_DEFAULT_PAGE_SIZE = 5;
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const VOUCHER_PRICE_ROWS_PER_PAGE = [5, 10, 20, 50];
export const EMPTY_STRING = '';
export const EMPTY_OBJECT = {};
export const CONTAINS_LOOKUP = 'Icontains';
export const STARTS_WITH_LOOKUP = 'Istartswith';
export const WORKER_THRESHOLD = 3;
export const VOUCHER_QUANTITY_THRESHOLD = 10000;
export const USER_ECONOMIC_UNIT_STORAGE_KEY = 'userEconomicUnit';
export const VOUCHER_PRICE_MANAGEMENT_BUSINESS_KEY = 'VOUCHER_PRICE_MANAGEMENT_KEY';
export const DATE_TIME_SUFFIX = 'T00:00:00';
export const DEFAULT_VOUCHER_PRICE_FILTERS = [
  'first: 5',
  'orderBy: ["value"]',
];

export const WORKER_VOUCHER_STATUS = {
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED',
};

export const ACQUIREMENT_METHOD = {
  GENERIC_VOUCHER: 'GENERIC_VOUCHER',
  SPECIFIC_WORKER: 'SPECIFIC_WORKER',
};

export const ACQUIREMENT_METHOD_LIST = [
  ACQUIREMENT_METHOD.GENERIC_VOUCHER, ACQUIREMENT_METHOD.SPECIFIC_WORKER,
];

export const PRINTABLE = [
  WORKER_VOUCHER_STATUS.ASSIGNED,
  WORKER_VOUCHER_STATUS.CANCELED,
];

export const CANCELABLE = [
  WORKER_VOUCHER_STATUS.AWAITING_PAYMENT,
  WORKER_VOUCHER_STATUS.ASSIGNED,
];

export const WORKER_VOUCHER_STATUS_LIST = [
  WORKER_VOUCHER_STATUS.UNASSIGNED,
  WORKER_VOUCHER_STATUS.ASSIGNED,
  WORKER_VOUCHER_STATUS.EXPIRED,
  WORKER_VOUCHER_STATUS.CANCELED,
];

export const DEFAULT = {
  GENERIC_VOUCHER_ENABLED: false,
  IS_WORKER: false,
  WORKER_VOUCHER_COUNT_LIMIT: 120,
};

export const WORKER_IMPORT_ALL_WORKERS = 'allWorkers';
export const WORKER_IMPORT_PREVIOUS_WORKERS = 'previousWorkers';
export const WORKER_IMPORT_PREVIOUS_DAY = 'previousDay';
export const WORKER_IMPORT_GROUP_OF_WORKERS = 'groupOfWorkers';

export const WORKER_IMPORT_PLANS = [
  {
    value: WORKER_IMPORT_ALL_WORKERS,
    labelKey: 'workerVoucher.workerImport.allWorkers',
  },
  {
    value: WORKER_IMPORT_PREVIOUS_WORKERS,
    labelKey: 'workerVoucher.workerImport.previousWorkers',
  },
  {
    value: WORKER_IMPORT_PREVIOUS_DAY,
    labelKey: 'workerVoucher.workerImport.previousDay',
  },
  {
    value: WORKER_IMPORT_GROUP_OF_WORKERS,
    labelKey: 'workerVoucher.workerImport.groupOfWorkers',
  },
];

// There are 2 worker upload stages. Depending on the stage, the UI will show different fields/buttons.
// 1. FILE_UPLOAD: When the user uploads a file
// 2. WORKER_UPLOAD: When the user confirms the upload (after validation workers are uploaded)
export const UPLOAD_STAGE = {
  FILE_UPLOAD: 'FILE_UPLOAD',
  WORKER_UPLOAD: 'WORKER_UPLOAD',
};

export const DRAFT_FORM_TYPE = {
  ASSIGNMENT: 'ASSIGNMENT',
};
