import { db } from "@/lib/db/prisma";
import { ensureGeoAddressRefs } from "@/lib/geo/persistence";
import { customerSchema, siteSchema, type CustomerInput, type SiteInput } from "@/lib/validation/customer";

function customerName(customer: { firstName: string | null; lastName: string | null; companyName: string | null }) {
  return customer.companyName?.trim() || [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim() || "Unnamed customer";
}

export async function listCustomers(
  businessId: string,
  search?: string,
  multipleSites = false,
) {
  const q = search?.trim();

  const customers = await db.customer.findMany({
    where: {
      businessId,
      archivedAt: null,
      ...(q ? {
        OR: [
          { customerNumber: { contains: q, mode: "insensitive" } },
          { firstName: { contains: q, mode: "insensitive" } },
          { lastName: { contains: q, mode: "insensitive" } },
          { companyName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
        ],
      } : {}),
    },
    include: {
      contacts: {
        where: { archivedAt: null, isPrimary: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
      invoices: {
        where: { archivedAt: null },
        select: { balanceDue: true },
      },
      sites: {
        where: { archivedAt: null, isActive: true },
        select: { id: true, name: true, address: true, city: true, state: true, latitude: true, longitude: true },
        orderBy: { createdAt: "asc" },
        take: 3,
      },
      _count: { select: { sites: true, jobs: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return multipleSites ? customers.filter((customer) => customer._count.sites > 1) : customers;
}

export async function getCustomerListSummary(businessId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [totalClients, totalSites, activeContracts, dueThisMonth] = await Promise.all([
    db.customer.count({
      where: { businessId, archivedAt: null, isActive: true },
    }),
    db.site.count({
      where: { businessId, archivedAt: null, isActive: true },
    }),
    db.contract.count({
      where: { businessId, archivedAt: null, status: "ACTIVE" },
    }),
    db.invoice.aggregate({
      where: {
        businessId,
        archivedAt: null,
        dueDate: { gte: monthStart, lt: monthEnd },
        balanceDue: { gt: 0 },
      },
      _sum: { balanceDue: true },
    }),
  ]);

  return {
    totalClients,
    totalSites,
    activeContracts,
    dueThisMonth: Number(dueThisMonth._sum.balanceDue ?? 0),
  };
}

export async function getCustomer(businessId: string, customerId: string) {
  return db.customer.findFirst({
    where: { id: customerId, businessId, archivedAt: null },
    include: {
      sites: { where: { archivedAt: null }, orderBy: { createdAt: "asc" } },
      contacts: { where: { archivedAt: null }, orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      billingProfile: true,
      metadata: true,
      addresses: { where: { isPrimary: true }, include: { country: true, state: true, city: true }, take: 1 },
      jobs: { where: { archivedAt: null }, orderBy: { scheduledStart: "desc" }, take: 10 },
      _count: { select: { sites: true, jobs: true, recurringServices: true, contracts: true } },
    },
  });
}

export async function createCustomer(businessId: string, input: CustomerInput, createdById?: string) {
  const data = customerSchema.parse(input);
  const website = data.website ? (/^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`) : null;

  const result = await db.$transaction(async (tx) => {
    const count = await tx.customer.count({ where: { businessId } });
    const prefix = "CUS-";
    let number = `${prefix}${String(count + 1).padStart(5, "0")}`;
    let suffix = 1;
    while (await tx.customer.findUnique({ where: { businessId_customerNumber: { businessId, customerNumber: number } } })) {
      number = `${prefix}${String(count + 1).padStart(5, "0")}-${suffix++}`;
    }

    if (data.industryId) {
      const industry = await tx.businessIndustry.findFirst({ where: { id: data.industryId, businessId, archivedAt: null, isActive: true }, select: { id: true } });
      if (!industry) throw new Error("Selected industry does not belong to this business.");
    }

    if (data.tradeLicenseNo && data.registrationCountryCode) {
      const duplicate = await tx.customer.findFirst({ where: { businessId, registrationCountryCode: data.registrationCountryCode, tradeLicenseNo: data.tradeLicenseNo, archivedAt: null }, select: { id: true } });
      if (duplicate) throw new Error("A customer with this Trade Licence No. already exists in the selected country.");
    }
    if (data.vatNumber && data.registrationCountryCode) {
      const duplicate = await tx.customer.findFirst({ where: { businessId, registrationCountryCode: data.registrationCountryCode, vatNumber: data.vatNumber, archivedAt: null }, select: { id: true } });
      if (duplicate) throw new Error("A customer with this VAT Number already exists in the selected country.");
    }

    const customer = await tx.customer.create({
      data: {
        businessId,
        customerNumber: number,
        type: data.type,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        companyName: data.companyName || null,
        phone: data.phone || null,
        email: data.email || null,
        website,
        industryId: data.industryId || null,
        registrationCountryCode: data.registrationCountryCode || null,
        tradeLicenseNo: data.tradeLicenseNo || null,
        vatNumber: data.vatNumber || null,
        notes: data.notes || null,
        createdById: createdById || null,
      },
    });

    await tx.contact.create({
      data: {
        customerId: customer.id,
        firstName: data.contact.firstName,
        lastName: data.contact.lastName || null,
        designation: data.contact.designation || null,
        countryCode: data.contact.countryCode || null,
        phone: data.contact.phone || null,
        alternateCountryCode: data.contact.alternateCountryCode || null,
        alternatePhone: data.contact.alternatePhone || null,
        whatsappCountryCode: data.contact.whatsappCountryCode || null,
        whatsappPhone: data.contact.whatsappPhone || null,
        email: data.contact.email || null,
        preferredContactMethod: data.contact.preferredContactMethod || null,
        bestTimeToContact: data.contact.bestTimeToContact || null,
        isPrimary: true,
      },
    });

    await tx.customerBillingProfile.create({
      data: {
        customerId: customer.id,
        billingName: data.billing.billingName || null,
        currency: data.billing.currency,
        paymentTerms: data.billing.paymentTerms,
        creditLimit: data.billing.creditLimit,
        creditLimitCurrency: data.billing.creditLimitCurrency,
      },
    });

    if (data.address.countryCode || data.address.addressLine1 || data.address.cityId || data.address.latitude != null) {
      const geo = await ensureGeoAddressRefs(data.address.countryCode, data.address.stateCode, data.address.cityName, tx);
      const countryId = geo.countryId;
      const stateId = geo.stateId;
      const cityId = geo.cityId;
      await tx.customerAddress.create({
        data: {
          businessId,
          customerId: customer.id,
          addressLine1: data.address.addressLine1 || null,
          addressLine2: data.address.addressLine2 || null,
          countryId,
          stateId,
          cityId,
          area: data.address.area || null,
          postalCode: data.address.postalCode || null,
          latitude: data.address.latitude ?? null,
          longitude: data.address.longitude ?? null,
          googlePlaceId: data.address.googlePlaceId || null,
          isPrimary: true,
        },
      });
    }

    await tx.customerMetadata.create({
      data: {
        customerId: customer.id,
        customerGroup: data.metadata.customerGroup,
        leadSource: data.metadata.leadSource || null,
        leadSourceOther: data.metadata.leadSourceOther || null,
        referralSource: data.metadata.referralSource || null,
      },
    });

    return customer;
  });
  return result;
}

export async function updateCustomer(businessId: string, customerId: string, input: CustomerInput) {
  const data = customerSchema.parse(input);
  const website = data.website ? (/^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`) : null;

  return db.$transaction(async (tx) => {
    const customer = await tx.customer.findFirst({ where: { id: customerId, businessId, archivedAt: null }, select: { id: true } });
    if (!customer) throw new Error("Customer not found.");

    if (data.industryId) {
      const industry = await tx.businessIndustry.findFirst({ where: { id: data.industryId, businessId, archivedAt: null, isActive: true }, select: { id: true } });
      if (!industry) throw new Error("Selected industry does not belong to this business.");
    }

    if (data.tradeLicenseNo && data.registrationCountryCode) {
      const duplicate = await tx.customer.findFirst({ where: { businessId, registrationCountryCode: data.registrationCountryCode, tradeLicenseNo: data.tradeLicenseNo, archivedAt: null, NOT: { id: customerId } }, select: { id: true } });
      if (duplicate) throw new Error("A customer with this Trade Licence No. already exists in the selected country.");
    }
    if (data.vatNumber && data.registrationCountryCode) {
      const duplicate = await tx.customer.findFirst({ where: { businessId, registrationCountryCode: data.registrationCountryCode, vatNumber: data.vatNumber, archivedAt: null, NOT: { id: customerId } }, select: { id: true } });
      if (duplicate) throw new Error("A customer with this VAT Number already exists in the selected country.");
    }

    const updated = await tx.customer.update({
      where: { id: customerId, businessId },
      data: {
        type: data.type, firstName: data.firstName || null, lastName: data.lastName || null,
        companyName: data.companyName || null, phone: data.phone || null, email: data.email || null,
        website, industryId: data.industryId || null, registrationCountryCode: data.registrationCountryCode || null,
        tradeLicenseNo: data.tradeLicenseNo || null, vatNumber: data.vatNumber || null, notes: data.notes || null,
      },
    });

    const existingContact = await tx.contact.findFirst({ where: { customerId, isPrimary: true, archivedAt: null }, orderBy: { createdAt: "asc" } });
    if (existingContact) {
      await tx.contact.update({ where: { id: existingContact.id }, data: {
        firstName: data.contact.firstName, lastName: data.contact.lastName || null, designation: data.contact.designation || null,
        countryCode: data.contact.countryCode || null, phone: data.contact.phone || null,
        alternateCountryCode: data.contact.alternateCountryCode || null, alternatePhone: data.contact.alternatePhone || null,
        whatsappCountryCode: data.contact.whatsappCountryCode || null, whatsappPhone: data.contact.whatsappPhone || null,
        email: data.contact.email || null, preferredContactMethod: data.contact.preferredContactMethod || null,
        bestTimeToContact: data.contact.bestTimeToContact || null,
      } });
    } else {
      await tx.contact.create({ data: { customerId, firstName: data.contact.firstName, lastName: data.contact.lastName || null, designation: data.contact.designation || null, countryCode: data.contact.countryCode || null, phone: data.contact.phone || null, alternateCountryCode: data.contact.alternateCountryCode || null, alternatePhone: data.contact.alternatePhone || null, whatsappCountryCode: data.contact.whatsappCountryCode || null, whatsappPhone: data.contact.whatsappPhone || null, email: data.contact.email || null, preferredContactMethod: data.contact.preferredContactMethod || null, bestTimeToContact: data.contact.bestTimeToContact || null, isPrimary: true } });
    }

    await tx.customerBillingProfile.upsert({ where: { customerId }, update: { billingName: data.billing.billingName || null, currency: data.billing.currency, paymentTerms: data.billing.paymentTerms, creditLimit: data.billing.creditLimit, creditLimitCurrency: data.billing.creditLimitCurrency }, create: { customerId, billingName: data.billing.billingName || null, currency: data.billing.currency, paymentTerms: data.billing.paymentTerms, creditLimit: data.billing.creditLimit, creditLimitCurrency: data.billing.creditLimitCurrency } });

    const existingAddress = await tx.customerAddress.findFirst({ where: { customerId, isPrimary: true }, orderBy: { createdAt: "asc" } });
    const geo = await ensureGeoAddressRefs(data.address.countryCode, data.address.stateCode, data.address.cityName, tx);
    const addressData = { addressLine1: data.address.addressLine1 || null, addressLine2: data.address.addressLine2 || null, countryId: geo.countryId, stateId: geo.stateId, cityId: geo.cityId, area: data.address.area || null, postalCode: data.address.postalCode || null, latitude: data.address.latitude ?? null, longitude: data.address.longitude ?? null, googlePlaceId: data.address.googlePlaceId || null, isPrimary: true };
    if (existingAddress) await tx.customerAddress.update({ where: { id: existingAddress.id }, data: addressData });
    else if (Object.values(addressData).some((v) => v !== null && v !== "" && v !== false)) await tx.customerAddress.create({ data: { businessId, customerId, ...addressData } });

    await tx.customerMetadata.upsert({ where: { customerId }, update: { customerGroup: data.metadata.customerGroup, leadSource: data.metadata.leadSource || null, leadSourceOther: data.metadata.leadSourceOther || null, referralSource: data.metadata.referralSource || null }, create: { customerId, customerGroup: data.metadata.customerGroup, leadSource: data.metadata.leadSource || null, leadSourceOther: data.metadata.leadSourceOther || null, referralSource: data.metadata.referralSource || null } });

    return updated;
  });
}

export async function updateCustomerProfile(
  businessId: string,
  customerId: string,
  input: {
    type: "RESIDENTIAL" | "COMMERCIAL" | "CORPORATE" | "PROPERTY_MANAGER" | "OTHER";
    firstName: string;
    lastName: string;
    companyName: string;
    phone: string;
    email: string;
    notes: string;
  },
) {
  const customer = await db.customer.findFirst({
    where: { id: customerId, businessId, archivedAt: null },
    select: { id: true },
  });
  if (!customer) throw new Error("Customer not found.");

  return db.customer.update({
    where: { id: customerId, businessId },
    data: {
      type: input.type,
      firstName: input.firstName.trim() || null,
      lastName: input.lastName.trim() || null,
      companyName: input.companyName.trim() || null,
      phone: input.phone.trim() || null,
      email: input.email.trim() || null,
      notes: input.notes.trim() || null,
    },
  });
}

export async function archiveCustomer(businessId: string, customerId: string) {
  return db.customer.update({ where: { id: customerId, businessId }, data: { archivedAt: new Date(), isActive: false } });
}

export async function createSite(businessId: string, customerId: string, input: SiteInput) {
  const data = siteSchema.parse(input);
  const customer = await db.customer.findFirst({ where: { id: customerId, businessId, archivedAt: null }, select: { id: true } });
  if (!customer) throw new Error("Customer not found for this business.");
  return db.site.create({
    data: {
      businessId,
      customerId,
      name: data.name,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      postalCode: data.postalCode || null,
      country: data.country || null,
      contactName: data.contactName || null,
      contactPhone: data.contactPhone || null,
      accessInstructions: data.accessInstructions || null,
      notes: data.notes || null,
    },
  });
}

export async function archiveSite(businessId: string, siteId: string) {
  return db.site.update({ where: { id: siteId, businessId }, data: { archivedAt: new Date(), isActive: false } });
}

export { customerName };
