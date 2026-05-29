import { z } from "zod";

export const dendaSchema = z
  .object({
    id_peminjaman: z
      .string()
      .min(1, "Pilih peminjaman terlebih dahulu."),
    id_anggota: z.string().min(1),
    tgl_pinjam: z.string().min(1),
    tgl_hrs_kembali: z.string().min(1),
    tgl_kembali: z.string().min(1, "Pilih tanggal pengembalian."),
    jumlah_denda: z
      .number()
      .int("Jumlah denda harus bilangan bulat.")
      .min(0, "Jumlah denda tidak boleh negatif.")
      .max(100_000_000, "Jumlah denda terlalu besar."),
  })
  .refine(
    (data) => new Date(data.tgl_kembali) >= new Date(data.tgl_pinjam),
    {
      message: "Tanggal kembali tidak boleh sebelum tanggal pinjam.",
      path: ["tgl_kembali"],
    },
  );

export type DendaFormValues = z.infer<typeof dendaSchema>;
