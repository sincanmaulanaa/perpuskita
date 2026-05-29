"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { PeminjamanForm } from "@/features/peminjaman/peminjaman-form";
import { useUpdatePeminjaman } from "@/features/peminjaman/peminjaman.mutations";
import { usePeminjamanById } from "@/features/peminjaman/peminjaman.queries";
import type { PeminjamanFormValues } from "@/features/peminjaman/peminjaman.schema";
import { getFriendlyMessage, isApiError } from "@/lib/api-error";

type EditPeminjamanClientProps = {
  id: string;
};

export function EditPeminjamanClient({ id }: EditPeminjamanClientProps) {
  const router = useRouter();
  const detailQuery = usePeminjamanById(id);
  const { mutateAsync, isPending } = useUpdatePeminjaman();

  const handleSubmit = async (values: PeminjamanFormValues) => {
    try {
      await mutateAsync({
        id_peminjaman: id,
        id_anggota: values.id_anggota,
        tgl_pinjam: dateToIso(values.tgl_pinjam),
        tgl_hrs_kembali: dateToIso(values.tgl_hrs_kembali),
        jaminan: values.jaminan,
      });
      toast.success("Perubahan tersimpan.");
      router.push(`/peminjaman/${id}`);
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menyimpan perubahan."),
      );
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Ubah Peminjaman" />
        <div className="h-80 max-w-2xl animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data?.data) {
    const notFound =
      isApiError(detailQuery.error) &&
      detailQuery.error.message.toLowerCase().includes("not found");
    return (
      <div className="space-y-6">
        <PageHeader
          title="Ubah Peminjaman"
          description={
            notFound
              ? "Data tidak ditemukan."
              : "Gagal memuat data. Silakan coba lagi."
          }
        />
      </div>
    );
  }

  // The /admin/peminjaman/:id endpoint returns the simple list shape with id_anggota.
  const item = detailQuery.data.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ubah Peminjaman"
        description="Perbarui informasi peminjaman."
      />
      <div className="max-w-2xl">
        <PeminjamanForm
          defaultValues={{
            id_anggota: item.id_anggota,
            tgl_pinjam: isoToDate(item.tgl_pinjam),
            tgl_hrs_kembali: isoToDate(item.tgl_hrs_kembali),
            jaminan: item.jaminan,
          }}
          submitLabel="Simpan Perubahan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref={`/peminjaman/${id}`}
        />
      </div>
    </div>
  );
}

function isoToDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function dateToIso(yyyymmdd: string): string {
  if (!yyyymmdd) return "";
  return new Date(`${yyyymmdd}T00:00:00Z`).toISOString();
}
