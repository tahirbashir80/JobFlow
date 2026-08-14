"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, MapPin, RefreshCw, UserRound } from "lucide-react";
import { createCustomerAction } from "@/app/(app)/customers/actions";
import { getGeoCitiesAction, getGeoStatesAction } from "@/lib/geo/actions";
import { GoogleMapPicker } from "./GoogleMapPicker";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

type Country = { code: string; name: string; phoneCode: string };
type Industry = { id: string; name: string };

type Props = { countries: Country[]; industries: Industry[]; defaultCurrency: string; defaultCountryCode?: string };

const typeOptions = [
  ["RESIDENTIAL", "Residential"],
  ["COMMERCIAL", "Commercial"],
  ["CORPORATE", "Corporate"],
  ["OTHER", "Other"],
] as const;

const contactTimes = [["MORNING", "Morning · 8:00–12:00"], ["AFTERNOON", "Afternoon · 12:00–17:00"], ["EVENING", "Evening · 17:00–20:00"], ["ANY_TIME", "Any time"]] as const;
const paymentTerms = [["DUE_ON_RECEIPT", "Due on receipt"], ["NET_15", "Net 15"], ["NET_30", "Net 30"], ["NET_45", "Net 45"], ["NET_60", "Net 60"]] as const;

function phoneDigits(value: string) { return value.replace(/\D/g, ""); }
function normalizeWebsite(value: string) { const v = value.trim(); return v && !/^https?:\/\//i.test(v) ? `https://${v}` : v; }
function formatMoney(value: string) { const digits = value.replace(/[^0-9.]/g, ""); const [whole, decimal] = digits.split("."); const grouped = Number(whole || 0).toLocaleString("en-US"); return decimal !== undefined ? `${grouped}.${decimal.slice(0, 2)}` : grouped; }

function inferCountryCode() {
  try { return new Intl.Locale(navigator.language).region || "US"; } catch { return "US"; }
}

export function CustomerOnboardingForm({ countries, industries, defaultCurrency, defaultCountryCode }: Props) {
  const [type, setType] = useState<(typeof typeOptions)[number][0]>("RESIDENTIAL");
  const [countryCode, setCountryCode] = useState(defaultCountryCode || "");
  const [countryId, setCountryId] = useState("");
  const [states, setStates] = useState<Array<{ code: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ name: string }>>([]);
  const [stateCode, setStateCode] = useState("");
  const [stateId] = useState("");
  const [cityId] = useState("");
  const [cityName, setCityName] = useState("");
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [sameBillingName, setSameBillingName] = useState(true);
  const [leadSource, setLeadSource] = useState("");
  const [creditLimit, setCreditLimit] = useState("0");
  const [website, setWebsite] = useState("");
  const [vat, setVat] = useState("");
  const [tradeLicense, setTradeLicense] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [notesLength, setNotesLength] = useState(0);

  useEffect(() => {
    if (!countryCode) setCountryCode(defaultCountryCode || inferCountryCode());
  }, [countryCode, defaultCountryCode]);

  useEffect(() => {
    if (!countryCode) return;
    setStates([]); setCities([]); setStateCode(""); setCityName("");
    getGeoStatesAction(countryCode).then((result) => { setCountryId(result.countryId); setStates(result.states); }).catch(() => { setCountryId(""); setStates([]); });
  }, [countryCode]);

  useEffect(() => {
    if (!countryCode || !stateCode) return;
    setCities([]); setCityName("");
    getGeoCitiesAction(countryCode, stateCode).then(setCities).catch(() => setCities([]));
  }, [countryCode, stateCode]);

  const selectedCountry = useMemo(() => countries.find((c) => c.code === countryCode), [countries, countryCode]);
  useEffect(() => { if (selectedCountry?.phoneCode) setPhoneCountryCode(selectedCountry.phoneCode); }, [selectedCountry]);

  const handleMapLocation = useCallback(async (value: { addressLine1: string; cityName: string; stateName: string; countryCode: string; latitude: number; longitude: number; googlePlaceId: string }) => {
    const setField = (name: string, next: string) => { const element = document.querySelector(`[name="${name}"]`) as HTMLInputElement | null; if (element) { element.value = next; element.dispatchEvent(new Event("input", { bubbles: true })); } };
    setField("addressLine1", value.addressLine1);
    setField("cityName", value.cityName);
    setField("latitude", String(value.latitude));
    setField("longitude", String(value.longitude));
    setField("googlePlaceId", value.googlePlaceId);
    if (value.countryCode) {
      setCountryCode(value.countryCode);
      const result = await getGeoStatesAction(value.countryCode).catch(() => null);
      if (result) {
        setCountryId(result.countryId); setStates(result.states);
        const match = result.states.find((item: { code: string; name: string }) => item.name.toLowerCase() === value.stateName.toLowerCase() || item.code.toLowerCase() === value.stateName.toLowerCase());
        if (match) {
          setStateCode(match.code);
          const cityRows = await getGeoCitiesAction(value.countryCode, match.code).catch(() => []);
          setCities(cityRows);
          const cityMatch = cityRows.find((city: { name: string }) => city.name.toLowerCase() === value.cityName.toLowerCase());
          if (cityMatch) setCityName(cityMatch.name);
        }
      }
    }
  }, []);
  const vatRule = countryCode === "AE"
    ? { pattern: /^\d{15}$/, message: "UAE TRN must contain 15 digits." }
    : countryCode === "PK"
      ? { pattern: /^\d{13}$/, message: "Pakistan STRN/registration number should contain 13 digits." }
      : { pattern: /^[A-Za-z0-9 .\/-]{3,80}$/, message: "Use letters, numbers, spaces, dots, slashes or hyphens only." };
  const vatError = vat && !vatRule.pattern.test(vat) ? vatRule.message : "";
  const tradeError = tradeLicense && !/^[A-Za-z0-9 .\/-]{3,80}$/.test(tradeLicense) ? "Use letters, numbers, spaces, dots, slashes or hyphens only." : "";

  async function submit(formData: FormData) {
    setSaving(true); setError("");
    try {
      await createCustomerAction({
        type,
        firstName: String(formData.get("customerFirstName") || ""),
        lastName: String(formData.get("customerLastName") || ""),
        companyName: String(formData.get("companyName") || ""),
        industryId: industries.find((item) => item.name === String(formData.get("industrySearch") || ""))?.id || String(formData.get("industryId") || ""),
        tradeLicenseNo: tradeLicense,
        vatNumber: vat,
        registrationCountryCode: countryCode,
        website: normalizeWebsite(website),
        phone: contactPhone,
        email: String(formData.get("customerEmail") || ""),
        notes: String(formData.get("notes") || ""),
        contact: {
          firstName: String(formData.get("contactFirstName") || ""),
          lastName: String(formData.get("contactLastName") || ""),
          designation: String(formData.get("designation") || ""),
          countryCode: String(formData.get("phoneCountryCode") || ""),
          phone: phoneDigits(contactPhone),
          alternateCountryCode: String(formData.get("alternateCountryCode") || ""),
          alternatePhone: phoneDigits(String(formData.get("alternatePhone") || "")),
          whatsappCountryCode: String(formData.get("whatsappCountryCode") || formData.get("phoneCountryCode") || phoneCountryCode || ""),
          whatsappPhone: sameWhatsapp ? phoneDigits(contactPhone) : phoneDigits(String(formData.get("whatsappPhone") || "")),
          email: String(formData.get("contactEmail") || ""),
          preferredContactMethod: (String(formData.get("preferredContactMethod") || "PHONE") || undefined) as "PHONE" | "EMAIL" | "WHATSAPP",
          bestTimeToContact: (String(formData.get("bestTimeToContact") || "ANY_TIME") || undefined) as "MORNING" | "AFTERNOON" | "EVENING" | "ANY_TIME",
        },
        billing: {
          billingName: sameBillingName ? (String(formData.get("companyName") || "") || [String(formData.get("customerFirstName") || ""), String(formData.get("customerLastName") || "")].filter(Boolean).join(" ")) : String(formData.get("billingName") || ""),
          currency: String(formData.get("billingCurrency") || defaultCurrency),
          paymentTerms: String(formData.get("paymentTerms") || "NET_30") as "DUE_ON_RECEIPT" | "NET_15" | "NET_30" | "NET_45" | "NET_60",
          creditLimit: Number(creditLimit.replace(/,/g, "")) || 0,
          creditLimitCurrency: String(formData.get("creditLimitCurrency") || defaultCurrency),
        },
        address: {
          addressLine1: String(formData.get("addressLine1") || ""),
          addressLine2: String(formData.get("addressLine2") || ""),
          countryId: String(formData.get("countryId") || ""),
          stateId,
          cityId,
          countryCode,
          stateCode,
          cityName: String(formData.get("cityName") || cityName),
          area: String(formData.get("area") || ""),
          postalCode: String(formData.get("postalCode") || ""),
          latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
          longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
          googlePlaceId: String(formData.get("googlePlaceId") || ""),
        },
        metadata: {
          customerGroup: String(formData.get("customerGroup") || "REGULAR") as "ONE_TIME" | "VIP" | "PREMIUM" | "REGULAR",
          leadSource: leadSource ? leadSource as "GOOGLE" | "SOCIAL_MEDIA" | "REFERRAL" | "FLYER_BROCHURE" | "WALK_IN" | "OTHER" : undefined,
          leadSourceOther: String(formData.get("leadSourceOther") || ""),
          referralSource: String(formData.get("referralSource") || ""),
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create customer.");
      setSaving(false);
    }
  }

  const inputClass = "h-9 w-full rounded-[9px] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 text-xs outline-none focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary)]/10";
  const labelClass = "mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]";
  const helperClass = "mt-1 block text-[10px] leading-4 text-[var(--muted)]";
  const sectionClass = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5";

  return (
    <form action={submit} className="mt-5 space-y-3">
      <section className={sectionClass}>
        <SectionTitle title="Customer Information" description="Identity, classification and registration details." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="xl:col-span-2"><span className={labelClass}>Customer Name / Company *</span>{type === "RESIDENTIAL" ? <div className="grid grid-cols-2 gap-2"><input name="customerFirstName" required placeholder="First name" className={inputClass}/><input name="customerLastName" placeholder="Last name" className={inputClass}/></div> : <input name="companyName" required placeholder="Legal / trading name" className={inputClass}/>}</label>
          <div className="xl:col-span-2"><span className={labelClass}>Type *</span><div className="flex flex-wrap gap-1.5">{typeOptions.map(([value,label]) => <button key={value} type="button" onClick={() => setType(value)} className={`h-9 rounded-[9px] border px-3 text-[11px] font-semibold ${type===value ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)]"}`}>{label}</button>)}</div></div>
          <label><span className={labelClass}>Industry</span><input name="industrySearch" list="industry-options" placeholder="Search industry..." className={inputClass}/><input type="hidden" name="industryId" value="" readOnly/><datalist id="industry-options">{industries.map((i) => <option key={i.id} value={i.name} />)}</datalist><span className={helperClass}>Searchable suggestions from your configured industries.</span></label>
          <label><span className={labelClass}>Trade Licence No.</span><input value={tradeLicense} onChange={(e)=>setTradeLicense(e.target.value)} className={`${inputClass} ${tradeError ? "border-[var(--danger)]" : ""}`} placeholder="Registration / licence number"/><span className={helperClass}>Country: {selectedCountry?.name || "Select a country"}. Trade licence formats vary by issuing authority; letters, numbers and common separators are accepted.</span>{tradeError && <span className="mt-1 block text-[10px] text-[var(--danger)]">{tradeError}</span>}</label>
          <label><span className={labelClass}>VAT Number</span><input value={vat} onChange={(e)=>setVat(e.target.value)} className={`${inputClass} ${vatError ? "border-[var(--danger)]" : ""}`} placeholder="Tax / VAT registration number"/><span className={helperClass}>{countryCode === "AE" ? "UAE FTA TRN: 15 digits." : countryCode === "PK" ? "Pakistan FBR sales-tax registration/STRN: 13 digits." : "Country-specific syntax rule where configured; generic validation otherwise."}</span>{vatError && <span className="mt-1 block text-[10px] text-[var(--danger)]">{vatError}</span>}</label>
          <label><span className={labelClass}>Registration Country</span><select name="registrationCountry" value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} className={inputClass}>{countries.map((c)=><option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
          <label><span className={labelClass}>Website</span><input name="website" value={website} onChange={(e)=>setWebsite(e.target.value)} onBlur={()=>setWebsite(normalizeWebsite(website))} type="url" placeholder="example.com" className={inputClass}/><span className={helperClass}>https:// is added automatically.</span></label>
        </div>
      </section>

      <section className={sectionClass}>
        <SectionTitle title="Primary Contact" description="The person JobFlow should use for day-to-day communication." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label><span className={labelClass}>Contact Name *</span><input name="contactFirstName" required placeholder="First name" className={inputClass}/></label>
          <label><span className={labelClass}>Last Name</span><input name="contactLastName" placeholder="Last name" className={inputClass}/></label>
          <label><span className={labelClass}>Designation</span><input name="designation" placeholder="e.g. Facilities Manager" className={inputClass}/></label>
          <label><span className={labelClass}>Email ID</span><input name="contactEmail" type="email" placeholder="name@company.com" className={inputClass}/><span className={helperClass}>Validated before submission.</span></label>
          <label><span className={labelClass}>Contact No.</span><div className="grid grid-cols-[110px_1fr] gap-2"><select name="phoneCountryCode" value={phoneCountryCode} onChange={(e)=>setPhoneCountryCode(e.target.value)} className={inputClass}>{countries.map(c=><option key={c.code} value={c.phoneCode}>{c.phoneCode} · {c.code}</option>)}</select><input value={contactPhone} onChange={(e)=>setContactPhone(phoneDigits(e.target.value))} inputMode="tel" placeholder="Number" className={inputClass}/></div></label>
          <label><span className={labelClass}>Alternate Contact</span><div className="grid grid-cols-[110px_1fr] gap-2"><select name="alternateCountryCode" defaultValue="+1" className={inputClass}>{countries.map(c=><option key={c.code} value={c.phoneCode}>{c.phoneCode} · {c.code}</option>)}</select><input name="alternatePhone" inputMode="tel" placeholder="Number" className={inputClass}/></div></label>
          <label className="xl:col-span-2"><span className={labelClass}>WhatsApp No.</span><div className="flex items-center gap-2"><input type="checkbox" checked={sameWhatsapp} onChange={(e)=>setSameWhatsapp(e.target.checked)} className="h-3.5 w-3.5 accent-[var(--primary)]"/><span className="text-[10px] font-semibold text-[var(--muted)]">Same as Contact No.</span>{!sameWhatsapp && <div className="grid min-w-0 flex-1 grid-cols-[110px_1fr] gap-2"><select name="whatsappCountryCode" defaultValue="+1" className={inputClass}>{countries.map(c=><option key={c.code} value={c.phoneCode}>{c.phoneCode} · {c.code}</option>)}</select><input name="whatsappPhone" inputMode="tel" placeholder="WhatsApp number" className={inputClass}/></div>}</div></label>
          <div className="xl:col-span-2"><span className={labelClass}>Preferred Contact Method</span><div className="flex gap-1.5">{[["PHONE","Phone"],["EMAIL","Email"],["WHATSAPP","WhatsApp"]].map(([v,l])=><label key={v} className="inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-[var(--border)] px-2.5 py-2 text-[10px] font-semibold"><input type="radio" name="preferredContactMethod" value={v} defaultChecked={v==="PHONE"} className="accent-[var(--primary)]"/>{l}</label>)}</div></div>
          <div className="xl:col-span-2"><span className={labelClass}>Best Time to Contact</span><div className="flex flex-wrap gap-1.5">{contactTimes.map(([v,l])=><label key={v} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[10px] font-semibold"><input type="radio" name="bestTimeToContact" value={v} defaultChecked={v==="ANY_TIME"} className="accent-[var(--primary)]"/>{l}</label>)}</div></div>
        </div>
      </section>

      <section className={sectionClass}>
        <SectionTitle title="Billing Information" description="Default billing rules used when invoices are created." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="xl:col-span-2"><span className={labelClass}>Billing Name</span><div className="flex items-center gap-2"><input type="checkbox" checked={sameBillingName} onChange={(e)=>setSameBillingName(e.target.checked)} className="h-3.5 w-3.5 accent-[var(--primary)]"/><span className="text-[10px] font-semibold text-[var(--muted)] whitespace-nowrap">Same as Customer Name</span>{!sameBillingName && <input name="billingName" placeholder="Billing name" className={inputClass}/>}</div></label>
          <label><span className={labelClass}>Currency</span><select name="billingCurrency" defaultValue={defaultCurrency} className={inputClass}>{SUPPORTED_CURRENCIES.map(([code,name])=><option key={code} value={code}>{code} — {name}</option>)}</select></label>
          <label><span className={labelClass}>Payment Terms</span><select name="paymentTerms" defaultValue="NET_30" className={inputClass}>{paymentTerms.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
          <label className="xl:col-span-2"><span className={labelClass}>Credit Limit</span><div className="grid grid-cols-[100px_1fr] gap-2"><select name="creditLimitCurrency" defaultValue={defaultCurrency} className={inputClass}>{SUPPORTED_CURRENCIES.map(([code])=><option key={code} value={code}>{code}</option>)}</select><input value={creditLimit} onChange={(e)=>setCreditLimit(formatMoney(e.target.value))} inputMode="decimal" className={inputClass}/></div></label>
        </div>
      </section>

      <section className={sectionClass}>
        <SectionTitle title="Address Information" description="Primary customer address and map location." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="xl:col-span-2"><span className={labelClass}>Address Line 1</span><input name="addressLine1" className={inputClass}/></label>
          <label className="xl:col-span-2"><span className={labelClass}>Address Line 2</span><input name="addressLine2" className={inputClass}/></label>
          <label><span className={labelClass}>Country *</span><input type="hidden" name="countryId" value={countryId} readOnly/><select name="countryCode" value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} className={inputClass}>{countries.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
          <label><span className={labelClass}>State</span><select value={stateCode} onChange={(e)=>setStateCode(e.target.value)} disabled={!states.length} className={`${inputClass} disabled:opacity-50`}><option value="">Select state</option>{states.map(s=><option key={s.code} value={s.code || s.name}>{s.name}</option>)}</select></label>
          <label><span className={labelClass}>City</span><select name="cityName" value={cityName} onChange={(e)=>setCityName(e.target.value)} disabled={!cities.length} className={`${inputClass} disabled:opacity-50`}><option value="">Select city</option>{cities.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}</select></label>
          <label><span className={labelClass}>Area</span><input name="area" className={inputClass}/></label>
          <label><span className={labelClass}>ZIP / Post Code</span><input name="postalCode" className={inputClass}/></label>
          <div className="xl:col-span-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[11px] font-semibold">Google Map & Coordinates</p><p className={helperClass}>Drop or drag the pin to populate the address and coordinates when the Google Maps API key is configured.</p></div><span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--muted)]"><MapPin size={13}/> Map picker</span></div>
            <GoogleMapPicker onLocation={handleMapLocation} />
            <div className="mt-3 grid gap-2 md:grid-cols-3"><input name="latitude" placeholder="Latitude" inputMode="decimal" className={inputClass}/><input name="longitude" placeholder="Longitude" inputMode="decimal" className={inputClass}/><input name="googlePlaceId" placeholder="Google Place ID" className={inputClass}/></div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <SectionTitle title="Additional Information" description="Lead attribution, customer value and notes." />
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label><span className={labelClass}>Lead Source</span><select name="leadSource" value={leadSource} onChange={(e)=>setLeadSource(e.target.value)} className={inputClass}><option value="">Select source</option><option value="GOOGLE">Google</option><option value="SOCIAL_MEDIA">Social Media</option><option value="REFERRAL">Referral</option><option value="FLYER_BROCHURE">Flyer / Brochure</option><option value="WALK_IN">Walk-in</option><option value="OTHER">Other</option></select></label>
          {leadSource === "REFERRAL" && <label><span className={labelClass}>Please specify referral</span><input name="referralSource" required className={inputClass}/></label>}
          {leadSource === "OTHER" && <label><span className={labelClass}>Please specify</span><input name="leadSourceOther" required className={inputClass}/></label>}
          <div><span className={labelClass}>Customer Group</span><div className="flex flex-wrap gap-1.5">{[["ONE_TIME","One-time"],["VIP","VIP"],["PREMIUM","Premium"],["REGULAR","Regular"]].map(([v,l])=><label key={v} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[10px] font-semibold"><input type="radio" name="customerGroup" value={v} defaultChecked={v==="REGULAR"} className="accent-[var(--primary)]"/>{l}</label>)}</div></div>
          <label className="md:col-span-2 xl:col-span-4"><span className={labelClass}>Notes</span><textarea name="notes" rows={4} maxLength={4000} onChange={(e)=>setNotesLength(e.target.value.length)} placeholder="Add relevant customer context, preferences or onboarding notes..." className={`${inputClass} h-auto py-2.5`}/><span className="mt-1 flex justify-end text-[10px] text-[var(--muted)]">{notesLength.toLocaleString()} / 4,000</span></label>
        </div>
      </section>

      {error && <div className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-4 py-3 text-xs font-medium text-[var(--danger)]">{error}</div>}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"><p className="text-[10px] text-[var(--muted)]"><span className="font-semibold">Required:</span> Customer type, name/company and primary contact.</p><button disabled={saving || Boolean(vatError || tradeError)} className="inline-flex h-9 items-center gap-2 rounded-[9px] bg-[var(--primary)] px-4 text-xs font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50">{saving ? <RefreshCw size={14} className="animate-spin"/> : <Check size={14}/>} {saving ? "Creating customer..." : "Create Customer"}<ArrowRight size={13}/></button></div>
    </form>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return <div className="flex items-start gap-3 border-b border-[var(--border)] pb-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]"><UserRound size={15}/></div><div><h2 className="text-sm font-bold tracking-[-0.01em]">{title}</h2><p className="mt-0.5 text-[10px] text-[var(--muted)]">{description}</p></div></div>;
}
