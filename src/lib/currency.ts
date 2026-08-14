export type CurrencyCode = string;

export const SUPPORTED_CURRENCIES = [
  ["USD", "US Dollar", "$"],
  ["EUR", "Euro", "€"],
  ["GBP", "British Pound", "£"],
  ["CAD", "Canadian Dollar", "CA$"],
  ["AUD", "Australian Dollar", "A$"],
  ["NZD", "New Zealand Dollar", "NZ$"],
  ["CHF", "Swiss Franc", "CHF"],
  ["JPY", "Japanese Yen", "¥"],
  ["CNY", "Chinese Yuan", "¥"],
  ["INR", "Indian Rupee", "₹"],
  ["PKR", "Pakistani Rupee", "₨"],
  ["AED", "UAE Dirham", "د.إ"],
  ["SAR", "Saudi Riyal", "﷼"],
  ["QAR", "Qatari Riyal", "﷼"],
  ["KWD", "Kuwaiti Dinar", "د.ك"],
  ["BHD", "Bahraini Dinar", "د.ب"],
  ["OMR", "Omani Rial", "﷼"],
  ["SGD", "Singapore Dollar", "S$"],
  ["HKD", "Hong Kong Dollar", "HK$"],
  ["ZAR", "South African Rand", "R"],
  ["BRL", "Brazilian Real", "R$"],
  ["MXN", "Mexican Peso", "MX$"],
  ["SEK", "Swedish Krona", "kr"],
  ["NOK", "Norwegian Krone", "kr"],
  ["DKK", "Danish Krone", "kr"],
  ["PLN", "Polish Zloty", "zł"],
  ["TRY", "Turkish Lira", "₺"],
  ["IDR", "Indonesian Rupiah", "Rp"],
  ["MYR", "Malaysian Ringgit", "RM"],
  ["THB", "Thai Baht", "฿"],
] as const;

export const CURRENCY_CODES = SUPPORTED_CURRENCIES.map(([code]) => code);

export function isSupportedCurrency(value: string): value is CurrencyCode {
  return CURRENCY_CODES.includes(value.toUpperCase() as any);
}

export function currencyName(code: string) {
  return SUPPORTED_CURRENCIES.find(([c]) => c === code)?.[1] ?? code;
}

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(amount);
}
