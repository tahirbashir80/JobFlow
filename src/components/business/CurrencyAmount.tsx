export function CurrencyAmount({ amount, currency, display="symbol-code", className="" }: { amount:number|string; currency:string; display?:"symbol"|"code"|"symbol-code"; className?:string }) {
  const value=Number(amount);
  const formatted=new Intl.NumberFormat(undefined,{style:"currency",currency}).format(value);
  if(display==="code") return <span className={className}>{currency} {new Intl.NumberFormat(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}).format(value)}</span>;
  if(display==="symbol") return <span className={className}>{formatted}</span>;
  return <span className={className}>{formatted} {currency}</span>;
}
