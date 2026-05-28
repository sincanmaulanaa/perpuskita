import { z } from "zod";

export const penerbitSchema = z.object({
  penerbit_buku: z
    .string()
    .trim()
    .min(2, "Nama penerbit minimal 2 karakter.")
    .max(100, "Nama penerbit maksimal 100 karakter."),
  alamat_penerbit: z
    .string()
    .trim()
    .max(200, "Alamat maksimal 200 karakter."),
  telp_penerbit: z
    .string()
    .trim()
    .max(20, "Nomor telepon maksimal 20 karakter."),
  email_penerbit: z
    .string()
    .trim()
    .email("Format email belum sesuai.")
    .or(z.literal("")),
  deskripsi: z
    .string()
    .trim()
    .max(500, "Deskripsi maksimal 500 karakter."),
});

export type PenerbitFormValues = z.infer<typeof penerbitSchema>;
