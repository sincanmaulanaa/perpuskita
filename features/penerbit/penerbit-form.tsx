"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";

import { penerbitSchema, type PenerbitFormValues } from "./penerbit.schema";

type PenerbitFormProps = {
  defaultValues?: Partial<PenerbitFormValues>;
  submitLabel: string;
  pendingLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: PenerbitFormValues) => void | Promise<void>;
  cancelHref?: string;
};

export function PenerbitForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isSubmitting,
  onSubmit,
  cancelHref,
}: PenerbitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PenerbitFormValues>({
    resolver: zodResolver(penerbitSchema),
    defaultValues: {
      penerbit_buku: "",
      alamat_penerbit: "",
      telp_penerbit: "",
      email_penerbit: "",
      deskripsi: "",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <TextField
        label="Nama Penerbit"
        placeholder="contoh: Gramedia Pustaka Utama"
        autoFocus
        disabled={isSubmitting}
        error={errors.penerbit_buku?.message}
        {...register("penerbit_buku")}
      />

      <TextField
        label="Alamat"
        placeholder="contoh: Jl. Palmerah Barat No.33-37, Jakarta"
        disabled={isSubmitting}
        error={errors.alamat_penerbit?.message}
        {...register("alamat_penerbit")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Telepon"
          type="tel"
          placeholder="contoh: 02153650110"
          disabled={isSubmitting}
          error={errors.telp_penerbit?.message}
          hint="Boleh dikosongkan."
          {...register("telp_penerbit")}
        />
        <TextField
          label="Email"
          type="email"
          placeholder="kontak@penerbit.com"
          disabled={isSubmitting}
          error={errors.email_penerbit?.message}
          hint="Boleh dikosongkan."
          {...register("email_penerbit")}
        />
      </div>

      <TextareaField
        label="Deskripsi"
        placeholder="Catatan singkat tentang penerbit."
        disabled={isSubmitting}
        error={errors.deskripsi?.message}
        {...register("deskripsi")}
      />

      <div className="flex items-center justify-end gap-2 pt-2">
        {cancelHref ? (
          <Link
            href={cancelHref}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Batal
          </Link>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
