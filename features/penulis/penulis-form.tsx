"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";

import { penulisSchema, type PenulisFormValues } from "./penulis.schema";

type PenulisFormProps = {
  defaultValues?: Partial<PenulisFormValues>;
  submitLabel: string;
  pendingLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: PenulisFormValues) => void | Promise<void>;
  cancelHref?: string;
};

export function PenulisForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isSubmitting,
  onSubmit,
  cancelHref,
}: PenulisFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PenulisFormValues>({
    resolver: zodResolver(penulisSchema),
    defaultValues: {
      penulis_buku: "",
      alamat_penulis: "",
      email_penulis: "",
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
        label="Nama Penulis"
        placeholder="contoh: Pramoedya Ananta Toer"
        autoFocus
        disabled={isSubmitting}
        error={errors.penulis_buku?.message}
        {...register("penulis_buku")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Alamat"
          placeholder="contoh: Jakarta"
          disabled={isSubmitting}
          error={errors.alamat_penulis?.message}
          {...register("alamat_penulis")}
        />
        <TextField
          label="Email"
          type="email"
          placeholder="penulis@contoh.com"
          disabled={isSubmitting}
          error={errors.email_penulis?.message}
          hint="Boleh dikosongkan."
          {...register("email_penulis")}
        />
      </div>

      <TextareaField
        label="Deskripsi"
        placeholder="Latar belakang singkat penulis."
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
