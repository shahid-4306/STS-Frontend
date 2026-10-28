export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

export interface Admin {
  id: string;
  email: string;
}

export interface Customer {
  _id: string;
  displayId: string;
  fullName: string;
  city: string;
  phone: string;
  createdAt: string;
  outstanding?: number;
}

export interface Product {
  _id: string;
  customerId: string;
  countNumber: string;
  type: string;
  description: string;
  qtyPerPacket: string;
  rate: number;
  createdAt: string;
}

export interface BillItem {
  productId: string;
  productName: string;
  qtyPerPacket: string;
  type: string;
  unitPrice: number;
  packets: number;
  /** packets x qty-per-packet, stored with the bill. Absent on bills saved before this existed. */
  totalQty?: number;
  total: number;
  /** Id of the named person group this line belongs to ('' / absent = no group). */
  groupId?: string;
}

/** A named person that a set of bill lines is grouped under. */
export interface BillGroup {
  groupId: string;
  personName: string;
}

export interface Bill {
  _id: string;
  displayId: string;
  customerId: Customer | string;
  biltiNumber: string;
  driverName: string;
  driverPhone: string;
  date: string;
  items: BillItem[];
  /** Named person groups; absent/empty on bills saved before groups existed. */
  groups?: BillGroup[];
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  rentCharges: number;
  extraCharges: number;
  previousArrears: number;
  advanceUsed: number;
  grandTotal: number;
  receivedAmount: number;
  remainingBalance: number;
  paymentMethod: string;
  remarks: string;
  absorbedIntoBillId?: string | null;
  createdAt: string;
}

export interface Payment {
  _id: string;
  displayId: string;
  customerId: Customer | string;
  billId: Bill | string;
  receivedAmount: number;
  paymentDate: string;
  method: string;
  remarks: string;
}

export interface Advance {
  _id: string;
  displayId: string;
  customerId: Customer | string;
  amount: number;
  remainingAdvance: number;
  date: string;
}

export interface Arrears {
  _id: string;
  displayId: string;
  customerId: Customer | string;
  amount: number;
  remainingArrears: number;
  date: string;
  remarks: string;
}

export interface AppNotification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface InvoiceImage {
  _id: string;
  billId: string;
  customerId: string;
  fileName: string;
  storedFileName: string;
  relativePath: string;
  contentType: string;
  sizeBytes: number;
  url: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalCustomers: number;
  totalProducts: number;
  totalBills: number;
  totalSales: number;
  totalOutstanding: number;
  todaySales: number;
  monthlySales: number;
  recentBills: Bill[];
  recentCustomers: Customer[];
}

export type LedgerEntryKind = 'payment' | 'advance_deposit' | 'advance_applied' | 'arrears_adjustment';

export interface LedgerEntry {
  id: string;
  kind: LedgerEntryKind;
  date: string;
  billId: string | null;
  billRef: string | null;
  paymentAmount: number;
  advanceAmount: number;
  adjustmentAmount: number;
  method: string;
  remarks: string;
  remainingBalance: number | null;
}

export interface CustomerPaymentHistory {
  customer: Pick<Customer, '_id' | 'displayId' | 'fullName' | 'city' | 'phone'>;
  range: { startDate: string | null; endDate: string | null };
  summary: {
    payments: number;
    advancesDeposited: number;
    advancesApplied: number;
    adjustments: number;
    currentOutstanding: number;
    currentAdvanceBalance: number;
  };
  entries: LedgerEntry[];
}
