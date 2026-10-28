# Frontend changes (Angular 18 — the project is Angular, not React)

* `components/product-select` — searchable product dropdown used on every bill row.
* `pages/new-bill` — Total Qty column removed from the item-selection table; "Add Person Name" groups; double-submit guard; idempotency key.
* `components/invoice-preview` — person sections, Total Qty column, Total rows; CSV includes Person/Total Qty; saved-image re-download.
* `pages/payment-history` — customer picker + Start/End Date ledger.
* `shared/bill-groups.util.ts`, models and services updated accordingly.
