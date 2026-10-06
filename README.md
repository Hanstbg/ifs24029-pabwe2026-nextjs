# ifs24029-pabwe2026-p4-nextjs

Praktikum 4 PABWE 2026 — **Studi Kasus 2.2: Aplikasi Postingan menggunakan NextJS (TypeScript)**.

Aplikasi linimasa postingan (mirip media sosial sederhana) yang terhubung ke
Delcom Open API `/posts`: membuat postingan, mengubah deskripsi, mengganti cover,
suka/tidak suka, komentar, menghapus komentar, daftar pengguna, dan pengaturan profil.
Dibangun dengan **Next.js App Router + TypeScript + Tailwind CSS v4 + Redux Toolkit +
SweetAlert2 + Tabler Icons + Vitest/Testing Library**.

## Menjalankan

```bash
bun install          # pasang dependensi
bun run dev          # jalankan server pengembangan (http://localhost:3000)
bun run build        # build produksi
bun run start        # jalankan hasil build produksi
bun run lint         # ESLint
bun run test         # Vitest + laporan coverage (ambang batas 100%)
bun run test:watch   # Vitest mode watch
```

Port dibaca secara dinamis dari variabel `APP_PORT` pada `.env` lewat launcher
`src/server.ts`.

## Konfigurasi lingkungan

| Berkas         | `NEXT_PUBLIC_DELCOM_BASEURL`              | `APP_PORT` |
| -------------- | ----------------------------------------- | ---------- |
| `.env`         | `https://open-api.delcom.org/api/v1`      | `3000`     |
| `.env.example` | `http://localhost:8000/api/v1` (lokal)    | `3000`     |

## Struktur proyek

```
src/
├── app/
│   ├── (dashboard)/          # rute terproteksi (PostLayout)
│   │   ├── layout.tsx
│   │   ├── page.tsx          # HomePage  – linimasa postingan
│   │   ├── posts/[postId]/   # DetailPage – rincian postingan
│   │   ├── profile/          # ProfilePage
│   │   └── users/            # UsersPage
│   ├── auth/                 # layout.tsx, login/, register/
│   ├── globals.css
│   ├── layout.tsx            # RootLayout + Google Font + Providers
│   └── not-found.tsx
├── components/Providers.tsx  # <Provider store={store}> (Client Component)
├── features/
│   ├── auth/                 # api, states (action/reducer), layouts, pages
│   ├── posts/                # api, states, components, layouts, modals, pages
│   └── users/                # api, states, pages
├── helpers/                  # apiHelper.ts, toolsHelper.ts
├── hooks/                    # redux.ts (typed hooks), useInput.ts
├── lib/config.ts             # DELCOM_BASEURL, APP_PORT
├── server.ts                 # launcher Next.js (baca APP_PORT dari .env)
├── store.ts                  # configureStore + RootState/AppDispatch
├── test-utils.tsx            # renderWithProviders
├── setupTests.ts             # @testing-library/jest-dom + mock next/navigation
└── types/                    # Post, PostAuthor, PostComment, User, ApiResult
```

## Endpoint API yang dipakai (`/posts`)

| Fungsi          | Method & URL             | Keterangan                          |
| --------------- | ------------------------ | ----------------------------------- |
| `getPosts`      | `GET /posts?is_me=1`     | semua postingan / postingan sendiri |
| `getPostById`   | `GET /posts/:id`         | rincian + likes + komentar          |
| `postPost`      | `POST /posts`            | postingan baru (deskripsi)          |
| `putPost`       | `PUT /posts/:id`         | ubah deskripsi                      |
| `postPostCover` | `POST /posts/:id/cover`  | unggah/ganti cover (multipart)      |
| `deletePost`    | `DELETE /posts/:id`      | hapus satu postingan                |
| `postLike`      | `POST /posts/:id/likes`  | like/unlike (`like: 1 \| 0`)        |
| `postComment`   | `POST /posts/:id/comments` | tambah komentar                   |
| `deleteComment` | `DELETE /posts/:id/comments` | hapus komentar sendiri          |
| `deleteAllPosts`| `DELETE /posts`          | hapus semua postingan milik sendiri |

Autentikasi memakai `Authorization: Bearer <token>` yang otomatis disisipkan
`apiHelper` dari `localStorage`.

## Pengujian

- 26 berkas uji, 256 test (unit + integrasi) dengan **coverage 100%** untuk
  statements, branches, functions, dan lines (ambang batas di `vitest.config.mts`).
- `src/test-utils.tsx` menyediakan `renderWithProviders` (Redux Provider + store mock).
- `src/setupTests.ts` memasang `@testing-library/jest-dom` dan mem-mock
  `next/link` serta `next/navigation`.

## Troubleshooting

**VS Code menandai merah `import ... from "vitest/config"`, `@vitejs/plugin-react`,
`path`, `url`, atau error `TS2688: Cannot find type definition file ...`**

Penyebabnya `node_modules` belum ada — project ini dikirim tanpa `node_modules`
(ukurannya ~510 MB dan bisa dipasang ulang kapan saja). Jalankan:

```bash
bun install
```

lalu restart TypeScript server: `Ctrl+Shift+P` → **TypeScript: Restart TS Server**
(atau tutup lalu buka kembali VS Code). Pastikan VS Code dibuka **langsung pada
folder project** (`File > Open Folder` → `ifs24029-pabwe2026-p4-nextjs`), bukan
folder induknya.

**`next-env.d.ts` bergaris merah pada `import "./.next/dev/types/routes.d.ts"`**

Berkas tipe itu baru dibuat Next.js saat pertama kali dijalankan. Jalankan sekali:

```bash
bun run dev     # atau: bun run build
```

Setelah folder `.next/` terbentuk, error tersebut hilang.

**Semua test lulus tapi laporan coverage 0% / worker timeout**

Worker Vitest gagal dibuat (umumnya karena sandbox/antivirus membatasi proses
anak). Jalankan dengan pool thread:

```bash
bunx vitest run --coverage --pool=threads
```

