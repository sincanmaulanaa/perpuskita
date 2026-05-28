"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";

import {
  jenisBukuSchema,
  type JenisBukuFormValues,
} from "./jenis-buku.schema";

type JenisBukuFormProps = {
  defaultValues?: Partial<JenisBukuFormValues>;
  submitLabel: string;
  pendingLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: JenisBukuFormValues) => void | Promise<void>;
  cancelHref?: string;
};

export function JenisBukuForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isSubmitting,
  onSubmit,
  cancelHref,
}: JenisBukuFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JenisBukuFormValues>({
    resolver: zodResolver(jenisBukuSchema),
    defaultValues: {
      jenis_buku: "",
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
        label="Nama Jenis"
        placeholder="contoh: Fiksi Ilmiah"
        autoFocus
        disabled={isSubmitting}
        error={errors.jenis_buku?.message}
        {...register("jenis_buku")}
      />

      <TextareaField
        label="Deskripsi"
        placeholder="Penjelasan singkat tentang jenis buku ini."
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
