"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { PenerbitForm } from "@/features/penerbit/penerbit-form";
import { useUpdatePenerbit } from "@/features/penerbit/penerbit.mutations";
import { usePenerbitById } from "@/features/penerbit/penerbit.queries";
import type { PenerbitFormValues } from "@/features/penerbit/penerbit.schema";
import { getFriendlyMessage, isApiError } from "@/lib/api-error";

type EditPenerbitClientProps = {
  id: string;
};

export function EditPenerbitClient({ id }: EditPenerbitClientProps) {
  const router = useRouter();
  const detailQuery = usePenerbitById(id);
  const { mutateAsync, isPending } = useUpdatePenerbit();

  const handleSubmit = async (values: PenerbitFormValues) => {
    try {
      await mutateAsync({ id, ...values });
      toast.success("Perubahan tersimpan.");
      router.push("/penerbit");
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menyimpan perubahan."),
      );
    }
  };

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Ubah Penerbit" />
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
          title="Ubah Penerbit"
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
        title="Ubah Penerbit"
        description="Perbarui informasi penerbit."
      />
      <div className="max-w-2xl">
        <PenerbitForm
          defaultValues={{
            penerbit_buku: item.penerbit_buku,
            alamat_penerbit: item.alamat_penerbit,
            telp_penerbit: item.telp_penerbit ?? "",
            email_penerbit: item.email_penerbit,
            deskripsi: item.deskripsi_penerbit ?? "",
          }}
          submitLabel="Simpan Perubahan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/penerbit"
        />
      </div>
    </div>
  );
}
