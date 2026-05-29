"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { PeminjamanForm } from "@/features/peminjaman/peminjaman-form";
import { useCreatePeminjaman } from "@/features/peminjaman/peminjaman.mutations";
import type { PeminjamanFormValues } from "@/features/peminjaman/peminjaman.schema";
import { getFriendlyMessage } from "@/lib/api-error";

export default function CreatePeminjamanPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreatePeminjaman();

  const handleSubmit = async (values: PeminjamanFormValues) => {
    try {
      await mutateAsync({
        id_anggota: values.id_anggota,
        tgl_pinjam: dateToIso(values.tgl_pinjam),
        tgl_hrs_kembali: dateToIso(values.tgl_hrs_kembali),
        jaminan: values.jaminan,
      });
      toast.success("Peminjaman berhasil ditambahkan.");
      router.push("/peminjaman");
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menyimpan peminjaman."),
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Peminjaman"
        description="Catat peminjaman buku oleh seorang anggota."
      />
      <div className="max-w-2xl">
        <PeminjamanForm
          submitLabel="Simpan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/peminjaman"
        />
      </div>
    </div>
  );
}

function dateToIso(yyyymmdd: string): string {
  if (!yyyymmdd) return "";
  return new Date(`${yyyymmdd}T00:00:00Z`).toISOString();
}
