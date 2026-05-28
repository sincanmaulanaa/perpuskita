"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { JenisBukuForm } from "@/features/jenis-buku/jenis-buku-form";
import { useUpdateJenisBuku } from "@/features/jenis-buku/jenis-buku.mutations";
import { useJenisBukuById } from "@/features/jenis-buku/jenis-buku.queries";
import type { JenisBukuFormValues } from "@/features/jenis-buku/jenis-buku.schema";
import { getFriendlyMessage, isApiError } from "@/lib/api-error";

type EditJenisBukuClientProps = {
  id: string;
};

export function EditJenisBukuClient({ id }: EditJenisBukuClientProps) {
  const router = useRouter();
  const detailQuery = useJenisBukuById(id);
  const { mutateAsync, isPending } = useUpdateJenisBuku();

  const handleSubmit = async (values: JenisBukuFormValues) => {
    try {
      await mutateAsync({ id, ...values });
      toast.success("Perubahan tersimpan.");
      router.push("/jenis-buku");
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menyimpan perubahan."),
      );
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Ubah Jenis Buku" />
        <div className="h-64 max-w-2xl animate-pulse rounded-2xl bg-white" />
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
          title="Ubah Jenis Buku"
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
        title="Ubah Jenis Buku"
        description="Perbarui informasi kategori."
      />
      <div className="max-w-2xl">
        <JenisBukuForm
          defaultValues={{
            jenis_buku: item.jenis_buku,
            deskripsi: item.deskripsi,
          }}
          submitLabel="Simpan Perubahan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/jenis-buku"
        />
      </div>
    </div>
  );
}
