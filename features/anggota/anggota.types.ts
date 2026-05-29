export type Anggota = {
  id_anggota: string;
  username: string;
  nama: string;
  jenis_kelamin: string;
  telp: string;
  alamat: string;
  email: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
};

export type AnggotaListResponse = {
  error?: boolean;
  msg?: string;
  data: Anggota[] | null;
};

export type AnggotaDetailResponse = {
  error?: boolean;
  msg?: string;
  data: Anggota | null;
};
