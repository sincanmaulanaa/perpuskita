"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { DendaForm } from "@/features/denda/denda-form";
import { useCreateDenda } from "@/features/denda/denda.mutations";
import type { DendaFormValues } from "@/features/denda/denda.schema";
import { getFriendlyMessage } from "@/lib/api-error";

export default function CreateDendaPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateDenda();

  const handleSubmit = async (values: DendaFormValues) => {
    try {
      await mutateAsync({
        id_peminjaman: values.id_peminjaman,
        id_anggota: values.id_anggota,
        tgl_pinjam: dateToIso(values.tgl_pinjam),
        tgl_hrs_kembali: dateToIso(values.tgl_hrs_kembali),
        tgl_kembali: dateToIso(values.tgl_kembali),
        jumlah_denda: values.jumlah_denda,
      });
      toast.success("Denda berhasil ditambahkan.");
      router.push("/denda");
    } catch (err) {
      toast.error(getFriendlyMessage(err, "Tidak dapat menyimpan denda."));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Denda"
        description="Catat denda untuk peminjaman yang terlambat dikembalikan."
      />
      <div className="max-w-2xl">
        <DendaForm
          submitLabel="Simpan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/denda"
        />
      </div>
    </div>
  );
}

function dateToIso(yyyymmdd: string): string {
  if (!yyyymmdd) return "";
  return new Date(`${yyyymmdd}T00:00:00Z`).toISOString();
}
