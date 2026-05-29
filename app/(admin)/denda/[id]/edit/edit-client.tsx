"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { DendaForm } from "@/features/denda/denda-form";
import { useUpdateDenda } from "@/features/denda/denda.mutations";
import { useDendaById } from "@/features/denda/denda.queries";
import type { DendaFormValues } from "@/features/denda/denda.schema";
import { getFriendlyMessage, isApiError } from "@/lib/api-error";

type EditDendaClientProps = {
  id: string;
};

export function EditDendaClient({ id }: EditDendaClientProps) {
  const router = useRouter();
  const detailQuery = useDendaById(id);
  const { mutateAsync, isPending } = useUpdateDenda();

  const handleSubmit = async (values: DendaFormValues) => {
    try {
      await mutateAsync({
        id_denda: id,
        id_peminjaman: values.id_peminjaman,
        id_anggota: values.id_anggota,
        tgl_pinjam: dateToIso(values.tgl_pinjam),
        tgl_hrs_kembali: dateToIso(values.tgl_hrs_kembali),
        tgl_kembali: dateToIso(values.tgl_kembali),
        jumlah_denda: values.jumlah_denda,
      });
      toast.success("Perubahan tersimpan.");
      router.push("/denda");
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menyimpan perubahan."),
      );
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Ubah Denda" />
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
          title="Ubah Denda"
          description={
            notFound
              ? "Data tidak ditemukan."
              : "Gagal memuat data. Silakan coba lagi."
          }
        />
      </div>
    );
  }

  const item = detailQuery.data.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ubah Denda"
        description="Perbarui informasi denda."
      />
      <div className="max-w-2xl">
        <DendaForm
          defaultValues={{
            id_peminjaman: item.id_peminjaman,
            id_anggota: item.id_anggota,
            tgl_pinjam: isoToDate(item.tgl_pinjam),
            tgl_hrs_kembali: isoToDate(item.tgl_hrs_kembali),
            tgl_kembali: isoToDate(item.tgl_kembali),
            jumlah_denda: item.jumlah_denda,
          }}
          submitLabel="Simpan Perubahan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/denda"
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
