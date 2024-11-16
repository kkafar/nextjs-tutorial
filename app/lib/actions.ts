'use server';

import { custom, z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormShema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormShema.omit({ id: true, date: true });
const UpdateInvoice = FormShema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  let customerId, amount, status;
  try {
    const parseResult = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    customerId = parseResult.customerId;
    amount = parseResult.amount;
    status = parseResult.status;
  } catch (error) {
    return {
      message: `Error while validating form data: ${error}`,
    };
  }

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date});
    `;
  } catch (error) {
    return {
      message: `Database error: ${error}. Failed to create invoice`,
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  let customerId, amount, status;
  try {
    const parseResult = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
    customerId = parseResult.customerId;
    amount = parseResult.amount;
    status = parseResult.status;
  } catch (error) {
    return {
      message: `Error while validating form data: ${error}`,
    };
  }

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id};
    `;
  } catch (error) {
    return {
      message: `Database error: ${error}. Failed to update invoice`,
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id};`;
  } catch (error) {
    return {
      message: `Database error: ${error}. Failed to delete invoice`,
    };
  }

  revalidatePath('/dashboard/invoices');
}
