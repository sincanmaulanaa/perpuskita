export type Penerbit = {
  id: string;
  penerbit_buku: string;
  alamat_penerbit: string;
  telp_penerbit: string | null;
  email_penerbit: string;
  /** Backend names this `deskripsi_penerbit`, not `deskripsi`. */
  deskripsi_penerbit: string | null;
  updated_at: string;
};

export type PenerbitListResponse = {
  error: boolean;
  status: string;
  data: Penerbit[] | null;
};
