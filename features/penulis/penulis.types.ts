export type Penulis = {
  id: string;
  penulis_buku: string;
  alamat: string;
  email_penulis: string;
  deskripsi: string;
  updated_at: string;
};

export type PenulisListResponse = {
  error: boolean;
  /** Backend uses `status` for this resource instead of `msg`. */
  status: string;
  data: Penulis[] | null;
};
