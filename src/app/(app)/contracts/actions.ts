"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { archiveContract, createContract, updateContract, updateContractStatus } from "@/lib/contracts/persistence";
import type { ContractInput } from "@/lib/validation/contract";
import { ContractStatus } from "@/generated/prisma/client";
export async function createContractAction(input:ContractInput){const c=await createContract((await requireTenant()).businessId,input);revalidatePath("/contracts");revalidatePath("/customers");redirect(`/contracts/${c.id}/edit`);}
export async function updateContractAction(id:string,input:ContractInput){const c=await requireTenant();await updateContract(c.businessId,id,input);revalidatePath("/contracts");revalidatePath(`/contracts/${id}/edit`);revalidatePath("/customers");}
export async function archiveContractAction(id:string){const c=await requireTenant();await archiveContract(c.businessId,id);revalidatePath("/contracts");revalidatePath("/customers");}
export async function updateContractStatusAction(id:string,status:ContractStatus){const c=await requireTenant();await updateContractStatus(c.businessId,id,status);revalidatePath("/contracts");revalidatePath(`/contracts/${id}/edit`);revalidatePath("/customers");}
