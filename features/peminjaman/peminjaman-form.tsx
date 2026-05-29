"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { AnggotaSelect } from "@/features/anggota/anggota-select";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

import {
  peminjamanSchema,
  type PeminjamanFormValues,
} from "./peminjaman.schema";

type PeminjamanFormProps = {
  defaultValues?: Partial<PeminjamanFormValues>;
  submitLabel: string;
  pendingLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: PeminjamanFormValues) => void | Promise<void>;
  cancelHref?: string;
};

const JAMINAN_OPTIONS = ["KTP", "SIM", "Kartu Mahasiswa", "Kartu Pelajar"];

export function PeminjamanForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isSubmitting,
  onSubmit,
  cancelHref,
}: PeminjamanFormProps) {
  // useState initializers run once and are allowed to call non-pure APIs.
  const [{ today, inSevenDays }] = useState(() => {
    const now = Date.now();
    return {
      today: new Date(now).toISOString().slice(0, 10),
      inSevenDays: new Date(now + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    };
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PeminjamanFormValues>({
    resolver: zodResolver(peminjamanSchema),
    defaultValues: {
      id_anggota: "",
      tgl_pinjam: today,
      tgl_hrs_kembali: inSevenDays,
      jaminan: "KTP",
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
        name="id_anggota"
        render={({ field }) => (
          <AnggotaSelect
            value={field.value}
            onChange={field.onChange}
            error={errors.id_anggota?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Tanggal Pinjam"
          type="date"
          disabled={isSubmitting}
          error={errors.tgl_pinjam?.message}
          {...register("tgl_pinjam")}
        />
        <TextField
          label="Tanggal Harus Kembali"
          type="date"
          disabled={isSubmitting}
          error={errors.tgl_hrs_kembali?.message}
          {...register("tgl_hrs_kembali")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="jaminan"
          className="text-sm font-medium text-slate-700"
        >
          Jaminan
        </label>
        <select
          id="jaminan"
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60"
          {...register("jaminan")}
        >
          {JAMINAN_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.jaminan ? (
          <p className="text-xs text-red-600">{errors.jaminan.message}</p>
        ) : (
          <p className="text-xs text-slate-500">
            Dokumen identitas yang dititipkan oleh anggota.
          </p>
        )}
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
