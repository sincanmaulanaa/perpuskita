import { z } from "zod";

export const peminjamanSchema = z
  .object({
    id_anggota: z.string().min(1, "Pilih anggota terlebih dahulu."),
    tgl_pinjam: z
      .string()
      .min(1, "Pilih tanggal pinjam."),
    tgl_hrs_kembali: z
      .string()
      .min(1, "Pilih tanggal harus kembali."),
    jaminan: z
      .string()
      .trim()
      .min(2, "Jaminan minimal 2 karakter.")
      .max(60, "Jaminan maksimal 60 karakter."),
  })
  .refine(
    (data) => new Date(data.tgl_hrs_kembali) >= new Date(data.tgl_pinjam),
    {
      message: "Tanggal kembali harus sama atau setelah tanggal pinjam.",
      path: ["tgl_hrs_kembali"],
    },
  );

export type PeminjamanFormValues = z.infer<typeof peminjamanSchema>;
