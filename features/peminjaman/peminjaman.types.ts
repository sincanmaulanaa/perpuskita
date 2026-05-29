export type PeminjamanListItem = {
  id: string;
  id_anggota: string;
  nama_anggota?: string;
  tgl_pinjam: string;
  tgl_hrs_kembali: string;
  jaminan: string;
  jumlah_buku: number;
  created_at: string;
  updated_at: string;
};

export type PeminjamanDetailItem = {
  id_detailpinjam: string;
  id_buku: string;
  judul_buku?: string;
  isbn?: string;
  kondisi: string;
};

export type PeminjamanDetail = {
  id: string;
  anggota: {
    id_anggota: string;
    nama: string;
  };
  tgl_pinjam: string;
  tgl_hrs_kembali: string;
  jaminan: string;
  details: PeminjamanDetailItem[];
  created_at: string;
  updated_at: string;
};

export type PeminjamanListResponse = {
  error?: boolean;
  msg?: string;
  data: PeminjamanListItem[] | null;
};

/** GET /admin/peminjaman/:id returns the simple item shape, not the rich detail. */
export type PeminjamanItemResponse = {
  error?: boolean;
  msg?: string;
  data: PeminjamanListItem | null;
};

/** GET /admin/peminjaman/detail/:id returns the rich detail with anggota and books. */
export type PeminjamanDetailResponse = {
  error?: boolean;
  msg?: string;
  data: PeminjamanDetail | null;
};

export type CreatePeminjamanPayload = {
  id_anggota: string;
  tgl_pinjam: string;
  tgl_hrs_kembali: string;
  jaminan: string;
};

export type UpdatePeminjamanPayload = CreatePeminjamanPayload & {
  id_peminjaman: string;
};
