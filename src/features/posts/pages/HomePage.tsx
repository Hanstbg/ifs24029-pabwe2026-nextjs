"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import {
  asyncSetIsPostDelete,
  asyncSetIsPostDeleteAll,
  asyncSetPosts,
  setIsPostDeleteActionCreator,
  setIsPostDeleteAllActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import type { Post } from "@/types";
import { getImageUrl } from "@/lib/config";
import {
  IconPlus,
  IconArticle,
  IconHeart,
  IconMessageCircle,
  IconEye,
  IconPencil,
  IconPhotoUp,
  IconTrash,
  IconFilter,
  IconSearch,
  IconLoader2,
  IconTrashX,
} from "@tabler/icons-react";

function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const profile = useAppSelector((state) => state.profile);
  const posts = useAppSelector((state) => state.posts);
  const isPostDeleted = useAppSelector((state) => state.isPostDeleted);
  const isPostDeletedAll = useAppSelector((state) => state.isPostDeletedAll);

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingPosts(true);
    Promise.resolve(dispatch(asyncSetPosts(filter))).finally(() => {
      if (isMounted) setLoadingPosts(false);
    });
    return () => {
      isMounted = false;
    };
  }, [filter, dispatch]);

  useEffect(() => {
    let isMounted = true;
    if (isPostDeleted) {
      dispatch(setIsPostDeleteActionCreator(false));
      setLoadingPosts(true);
      Promise.resolve(dispatch(asyncSetPosts(filter))).finally(() => {
        if (isMounted) setLoadingPosts(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isPostDeleted, filter, dispatch]);

  useEffect(() => {
    if (isPostDeletedAll) {
      dispatch(setIsPostDeleteAllActionCreator(false));
      setFilter("");
    }
  }, [isPostDeletedAll, dispatch]);

  if (!profile) return null;

  async function handleDeletePost(postId) {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus postingan ini?"
    );
    if (result.isConfirmed) {
      dispatch(asyncSetIsPostDelete(postId));
    }
  }

  async function handleDeleteAllPosts() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus SEMUA postingan milik Anda?"
    );
    if (result.isConfirmed) {
      dispatch(asyncSetIsPostDeleteAll());
    }
  }

  const postList = posts;
  const filteredPosts = postList.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const description = post.description ? post.description.toLowerCase() : "";
    const author = post.author?.name ? post.author.name.toLowerCase() : "";
    return description.includes(q) || author.includes(q);
  });

  const totalCount = postList.length;
  const totalLikes = postList.reduce(
    (acc, post) => acc + (post.likes ? post.likes.length : 0),
    0
  );
  const totalComments = postList.reduce(
    (acc, post) => acc + (post.comments ? post.comments.length : 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Linimasa Postingan
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Bagikan cerita, pantau interaksi suka, dan kelola seluruh postinganmu.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {filter === "1" && (
            <button
              type="button"
              data-testid="delete-all-posts-btn"
              onClick={handleDeleteAllPosts}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/70 transition-all"
            >
              <IconTrashX aria-hidden="true" size={18} stroke={2.5} />
              <span>Hapus Semua</span>
            </button>
          )}
          <button
            type="button"
            data-testid="add-post-btn"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all"
          >
            <IconPlus aria-hidden="true" size={18} stroke={2.5} />
            <span>Tambah Postingan</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Total Postingan
            </p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <IconArticle aria-hidden="true" size={26} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Total Suka
            </p>
            <p className="text-3xl font-black text-rose-700 mt-1">{totalLikes}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <IconHeart aria-hidden="true" size={26} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Total Komentar
            </p>
            <p className="text-3xl font-black text-sky-700 mt-1">{totalComments}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <IconMessageCircle aria-hidden="true" size={26} stroke={2} />
          </div>
        </div>
      </div>

      {/* Timeline & Controls Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <IconSearch
              aria-hidden="true"
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              aria-label="Cari postingan"
              data-testid="search-post-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari deskripsi atau nama pembuat..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <IconFilter aria-hidden="true" size={16} /> Filter:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
              <button
                type="button"
                data-testid="filter-all-btn"
                onClick={() => setFilter("")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === ""
                    ? "bg-white text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                Semua Postingan
              </button>
              <button
                type="button"
                data-testid="filter-mine-btn"
                onClick={() => setFilter("1")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === "1"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                Postingan Saya
              </button>
            </div>
          </div>
        </div>

        {/* Post list */}
        {loadingPosts && filteredPosts.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-600">
            <IconLoader2
              aria-hidden="true"
              size={36}
              className="mx-auto text-indigo-600 animate-spin mb-2"
            />
            <p className="font-medium text-slate-600">Memuat daftar postingan...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-600">
            <IconArticle aria-hidden="true" size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="font-medium">Belum ada postingan yang cocok.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <article
                key={`post-${post.id}`}
                data-testid={`post-card-${post.id}`}
                className="p-4 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row gap-5"
              >
                {post.cover && (
                  <img
                    src={getImageUrl(post.cover)}
                    alt={post.description || "cover"}
                    width={176}
                    height={128}
                    loading="lazy"
                    decoding="async"
                    className="w-full sm:w-44 h-32 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0 space-y-2.5">
                  <div className="flex items-center gap-3">
                    {post.author?.photo ? (
                      <img
                        src={getImageUrl(post.author.photo)}
                        alt={post.author?.name || "author"}
                        width={36}
                        height={36}
                        loading="lazy"
                        decoding="async"
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">
                        {post.author?.name || "Tanpa Nama"}
                      </p>
                      <p className="text-xs text-slate-600 leading-tight">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                    <span className="ml-auto font-mono text-xs font-bold text-slate-500">
                      #{post.id}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {post.description || "Tidak ada deskripsi."}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <IconHeart aria-hidden="true" size={15} className="text-rose-500" />
                      {post.likes ? post.likes.length : 0} suka
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IconMessageCircle aria-hidden="true" size={15} className="text-sky-500" />
                      {post.comments ? post.comments.length : 0} komentar
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-1.5 self-start">
                  <button
                    type="button"
                    data-testid={`view-post-${post.id}`}
                    onClick={() => router.push(`/posts/${post.id}`)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                    aria-label="Lihat detail postingan"
                  >
                    <IconEye aria-hidden="true" size={18} />
                  </button>
                  <button
                    type="button"
                    data-testid={`edit-post-${post.id}`}
                    onClick={() => {
                      setSelectedPost(post);
                      setShowChangeModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Ubah Postingan"
                    aria-label="Ubah postingan"
                  >
                    <IconPencil aria-hidden="true" size={18} />
                  </button>
                  <button
                    type="button"
                    data-testid={`cover-post-${post.id}`}
                    onClick={() => {
                      setSelectedPost(post);
                      setShowCoverModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                    title="Ubah Cover"
                    aria-label="Ubah cover postingan"
                  >
                    <IconPhotoUp aria-hidden="true" size={18} />
                  </button>
                  <button
                    type="button"
                    data-testid={`delete-post-${post.id}`}
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus Postingan"
                    aria-label="Hapus postingan"
                  >
                    <IconTrash aria-hidden="true" size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        postId={selectedPost?.id}
      />
      <ChangeCoverModal
        show={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        post={selectedPost}
      />
    </div>
  );
}

export default HomePage;