import { Bill, BillItem } from '../models';

/** packets x numeric qty-per-packet; just the packet count when qty-per-packet isn't a plain number. */
export function calcTotalQty(qtyPerPacket: string | undefined | null, packets: number): number {
  const perPacket = parseFloat(String(qtyPerPacket ?? ''));
  const p = Number(packets) || 0;
  if (!isFinite(perPacket)) return p;
  return Math.round(perPacket * p * 100) / 100;
}

/** Total qty for a saved bill line (uses the stored value, or derives it for older bills). */
export function itemTotalQty(item: BillItem): number {
  if (item.totalQty !== undefined && item.totalQty !== null && Number(item.totalQty) > 0) {
    return Number(item.totalQty);
  }
  return calcTotalQty(item.qtyPerPacket, item.packets);
}

export function fmtQty(n: number): string {
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

export interface BillSection {
  groupId: string;
  /** '' for lines that aren't under any named person. */
  personName: string;
  items: (BillItem & { qty: number })[];
  packets: number;
  totalQty: number;
  total: number;
}

/**
 * Splits a saved bill into display sections: ungrouped lines first (exactly as
 * older bills have always looked), then one section per named person, in the
 * order the person names were added.
 */
export function buildBillSections(bill: Bill): BillSection[] {
  const groups = bill.groups || [];
  const make = (groupId: string, personName: string): BillSection => ({
    groupId,
    personName,
    items: [],
    packets: 0,
    totalQty: 0,
    total: 0,
  });
  const ungrouped = make('', '');
  const byId = new Map<string, BillSection>(groups.map((g) => [g.groupId, make(g.groupId, g.personName)]));

  for (const item of bill.items || []) {
    const section = (item.groupId && byId.get(item.groupId)) || ungrouped;
    const qty = itemTotalQty(item);
    section.items.push({ ...item, qty });
    section.packets += Number(item.packets) || 0;
    section.totalQty += qty;
    section.total += Number(item.total) || 0;
  }

  const sections: BillSection[] = [];
  if (ungrouped.items.length) sections.push(ungrouped);
  for (const g of groups) {
    const s = byId.get(g.groupId)!;
    if (s.items.length) sections.push(s);
  }
  return sections;
}
