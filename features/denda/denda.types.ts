export type Denda = {
  id_denda: string;
  jumlah_denda: number;
  tgl_pinjam: string;
  tgl_hrs_kembali: string;
  tgl_kembali: string;
  id_peminjaman: string;
  id_anggota: string;
  nama_anggota?: string;
  created_at: string;
  updated_at: string;
};

export type DendaListResponse = {
  error?: boolean;
  msg?: string;
  data: Denda[] | null;
};

export type DendaItemResponse = {
  error?: boolean;
  msg?: string;
  data: Denda | null;
};

export type CreateDendaPayload = {
  jumlah_denda: number;
  tgl_pinjam: string;
  tgl_hrs_kembali: string;
  tgl_kembali: string;
  id_peminjaman: string;
  id_anggota: string;
};

export type UpdateDendaPayload = CreateDendaPayload & {
  id_denda: string;
};
