"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { PeminjamanSelect } from "@/features/peminjaman/peminjaman-select";

import { dendaSchema, type DendaFormValues } from "./denda.schema";

type DendaFormProps = {
  defaultValues?: Partial<DendaFormValues>;
  submitLabel: string;
  pendingLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: DendaFormValues) => void | Promise<void>;
  cancelHref?: string;
};

export function DendaForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isSubmitting,
  onSubmit,
  cancelHref,
}: DendaFormProps) {
  const [{ today }] = useState(() => ({
    today: new Date(Date.now()).toISOString().slice(0, 10),
  }));

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DendaFormValues>({
    resolver: zodResolver(dendaSchema),
    defaultValues: {
      id_peminjaman: "",
      id_anggota: "",
      tgl_pinjam: "",
      tgl_hrs_kembali: "",
      tgl_kembali: today,
      jumlah_denda: 0,
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <Controller
        control={control}
        name="id_peminjaman"
        render={({ field }) => (
          <PeminjamanSelect
            value={field.value}
            onChange={(id, item) => {
              field.onChange(id);
              if (item) {
                setValue("id_anggota", item.id_anggota, {
                  shouldValidate: true,
                });
                setValue("tgl_pinjam", isoToDate(item.tgl_pinjam), {
                  shouldValidate: true,
                });
                setValue(
                  "tgl_hrs_kembali",
                  isoToDate(item.tgl_hrs_kembali),
                  { shouldValidate: true },
                );
              } else {
                setValue("id_anggota", "");
                setValue("tgl_pinjam", "");
                setValue("tgl_hrs_kembali", "");
              }
            }}
            error={errors.id_peminjaman?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <input type="hidden" {...register("id_anggota")} />
      <input type="hidden" {...register("tgl_pinjam")} />
      <input type="hidden" {...register("tgl_hrs_kembali")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Tanggal Kembali"
          type="date"
          disabled={isSubmitting}
          error={errors.tgl_kembali?.message}
          {...register("tgl_kembali")}
        />
        <TextField
          label="Jumlah Denda (Rp)"
          type="number"
          inputMode="numeric"
          min={0}
          step={500}
          disabled={isSubmitting}
          error={errors.jumlah_denda?.message}
          hint="Masukkan dalam Rupiah, misal: 5000"
          {...register("jumlah_denda", { valueAsNumber: true })}
        />
      </div>

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

function isoToDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
