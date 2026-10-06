"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  asyncSetIsPostAddComment,
  asyncSetIsPostDelete,
  asyncSetIsPostDeleteComment,
  asyncSetIsPostLike,
  asyncSetPost,
  setIsPostActionCreator,
  setIsPostAddCommentActionCreator,
  setIsPostAddedCommentActionCreator,
  setIsPostDeleteActionCreator,
  setIsPostDeleteCommentActionCreator,
  setIsPostDeletedCommentActionCreator,
  setIsPostLikeActionCreator,
  setIsPostLikedActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import useInput from "../../../hooks/useInput";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  IconArrowLeft,
  IconPhotoUp,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconSend,
} from "@tabler/icons-react";

function DetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const profile = useAppSelector((state) => state.profile);
  const post = useAppSelector((state) => state.post);
  const isPost = useAppSelector((state) => state.isPost);
  const isPostDeleted = useAppSelector((state) => state.isPostDeleted);
  const isPostLiked = useAppSelector((state) => state.isPostLiked);
  const isPostAddedComment = useAppSelector((state) => state.isPostAddedComment);
  const isPostDeletedComment = useAppSelector((state) => state.isPostDeletedComment);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [comment, changeComment, setComment] = useInput("");

  useEffect(() => {
    dispatch(asyncSetPost(postId));
  }, [postId, dispatch]);

  useEffect(() => {
    if (isPost) {
      dispatch(setIsPostActionCreator(false));
      if (!post) {
        router.push("/");
      }
    }
  }, [isPost, post, router, dispatch]);

  useEffect(() => {
    if (isPostDeleted) {
      dispatch(setIsPostDeleteActionCreator(false));
      router.push("/");
    }
  }, [isPostDeleted, router, dispatch]);

  useEffect(() => {
    if (isPostLiked) {
      dispatch(setIsPostLikedActionCreator(false));
      dispatch(setIsPostLikeActionCreator(false));
      dispatch(asyncSetPost(postId));
    }
  }, [isPostLiked, postId, dispatch]);

  useEffect(() => {
    if (isPostAddedComment) {
      dispatch(setIsPostAddedCommentActionCreator(false));
      dispatch(setIsPostAddCommentActionCreator(false));
      setComment("");
      dispatch(asyncSetPost(postId));
    }
  }, [isPostAddedComment, postId, dispatch, setComment]);

  useEffect(() => {
    if (isPostDeletedComment) {
      dispatch(setIsPostDeletedCommentActionCreator(false));
      dispatch(setIsPostDeleteCommentActionCreator(false));
      dispatch(asyncSetPost(postId));
    }
  }, [isPostDeletedComment, postId, dispatch]);

  if (!profile || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwner = post.user_id === profile.id;
  const liked = Boolean(post.likes?.includes(profile.id));
  const likeCount = post.likes ? post.likes.length : 0;
  const comments = post.comments || [];

  async function handleDelete() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus postingan ini?"
    );
    if (result.isConfirmed) {
      dispatch(asyncSetIsPostDelete(post.id));
    }
  }

  function handleLike() {
    dispatch(asyncSetIsPostLike(post.id, !liked));
  }

  function handleSubmitComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    dispatch(asyncSetIsPostAddComment(post.id, comment.trim()));
  }

  async function handleDeleteComment(commentId) {
    const result = await showConfirmDialog("Hapus komentar ini?");
    if (result.isConfirmed) {
      dispatch(asyncSetIsPostDeleteComment(commentId));
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Back button & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          data-testid="back-to-posts-link"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <IconArrowLeft aria-hidden="true" size={18} />
          Kembali ke Linimasa
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="edit-cover-btn"
              onClick={() => setShowCoverModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors"
            >
              <IconPhotoUp aria-hidden="true" size={16} />
              Ubah Cover
            </button>
            <button
              type="button"
              data-testid="edit-detail-post-btn"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
            >
              <IconEdit aria-hidden="true" size={16} />
              Ubah Data
            </button>
            <button
              type="button"
              data-testid="delete-detail-post-btn"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
            >
              <IconTrash aria-hidden="true" size={16} />
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {post.cover && (
          <div className="relative w-full h-64 sm:h-80 bg-slate-900 overflow-hidden">
            <img
              src={post.cover}
              alt={post.description || "cover"}
              width={896}
              height={320}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {post.author?.photo ? (
                <img
                  src={post.author.photo}
                  alt={post.author?.name || "author"}
                  width={48}
                  height={48}
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                  {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {post.author?.name || "Tanpa Nama"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <IconCalendar aria-hidden="true" size={13} className="shrink-0" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-slate-500">
              #{post.id}
            </span>
          </div>

          <div className="prose max-w-none text-slate-600 bg-slate-50/60 p-6 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
            {post.description || "Tidak ada deskripsi rinci untuk postingan ini."}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              data-testid="like-post-btn"
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-colors ${
                liked
                  ? "text-rose-700 bg-rose-50 border-rose-200"
                  : "text-slate-600 bg-white border-slate-200 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              {liked ? (
                <IconHeartFilled aria-hidden="true" size={18} />
              ) : (
                <IconHeart aria-hidden="true" size={18} />
              )}
              <span>{likeCount}</span>
              <span>Suka</span>
            </button>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
              <IconMessageCircle aria-hidden="true" size={18} className="text-sky-500" />
              {comments.length} Komentar
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
        <h2 className="text-lg font-bold text-slate-800">Komentar</h2>

        <form onSubmit={handleSubmitComment} className="flex items-start gap-3">
          <input
            type="text"
            aria-label="Tulis komentar"
            data-testid="comment-input"
            value={comment}
            onChange={changeComment}
            placeholder="Tulis komentar..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
          />
          <button
            type="submit"
            data-testid="submit-comment-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/25 transition-all"
          >
            <IconSend aria-hidden="true" size={16} />
            Kirim
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-sm text-slate-600">
            Belum ada komentar pada postingan ini.
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((item) => (
              <li
                key={`comment-${item.id}`}
                data-testid={`comment-item-${item.id}`}
                className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100"
              >
                <div className="min-w-0">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {item.comment}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {formatDate(item.created_at)}
                  </p>
                </div>
                {post.my_comment?.id === item.id && (
                  <button
                    type="button"
                    data-testid={`delete-comment-${item.id}`}
                    onClick={() => handleDeleteComment(item.id)}
                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Hapus Komentar"
                    aria-label="Hapus komentar"
                  >
                    <IconTrash aria-hidden="true" size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cover Modal */}
      <ChangeCoverModal
        show={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        post={post}
      />

      {/* Edit Modal */}
      <ChangeModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        postId={post.id}
      />
    </div>
  );
}

export default DetailPage;