"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { PenulisForm } from "@/features/penulis/penulis-form";
import { useUpdatePenulis } from "@/features/penulis/penulis.mutations";
import { usePenulisById } from "@/features/penulis/penulis.queries";
import type { PenulisFormValues } from "@/features/penulis/penulis.schema";
import { getFriendlyMessage, isApiError } from "@/lib/api-error";

type EditPenulisClientProps = {
  id: string;
};

export function EditPenulisClient({ id }: EditPenulisClientProps) {
  const router = useRouter();
  const detailQuery = usePenulisById(id);
  const { mutateAsync, isPending } = useUpdatePenulis();

  const handleSubmit = async (values: PenulisFormValues) => {
    try {
      await mutateAsync({ id, ...values });
      toast.success("Perubahan tersimpan.");
      router.push("/penulis");
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menyimpan perubahan."),
      );
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Ubah Penulis" />
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
          title="Ubah Penulis"
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
        title="Ubah Penulis"
        description="Perbarui informasi penulis."
      />
      <div className="max-w-2xl">
        <PenulisForm
          defaultValues={{
            penulis_buku: item.penulis_buku,
            alamat_penulis: item.alamat,
            email_penulis: item.email_penulis,
            deskripsi: item.deskripsi,
          }}
          submitLabel="Simpan Perubahan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/penulis"
        />
      </div>
    </div>
  );
}
