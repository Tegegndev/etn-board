"use client"

import { useState } from "react"
import { usePostManager } from "@/hooks/use-post-manager"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

export default function MyPostsPage() {
  const { posts, deletePost } = usePostManager()
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; postId: number | null; postTitle: string }>({
    isOpen: false,
    postId: null,
    postTitle: "",
  })

  const handleDeleteClick = (postId: number, postTitle: string) => {
    setDeleteDialog({ isOpen: true, postId, postTitle })
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.postId) {
      deletePost(deleteDialog.postId)
    }
    setDeleteDialog({ isOpen: false, postId: null, postTitle: "" })
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, postId: null, postTitle: "" })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Posts</h1>
          <p className="text-gray-400">Manage your bulletin board posts</p>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first post on the main board</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-[#133A2A]/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-300 mb-3">{post.content}</p>
                    {post.link && (
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFB400] hover:text-[#FFB400]/80 text-sm underline transition-colors duration-300"
                      >
                        {post.link}
                      </a>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                      <span>By: {post.author || "Anonymous"}</span>
                      <span>Amount: {post.amount || 0} ETN</span>
                      <span>{post.timestamp.toLocaleDateString()}</span>
                      {post.isPinned && (
                        <span className="text-[#FFB400] font-medium flex items-center gap-1">
                          <span className="w-2 h-2 bg-[#FFB400] rounded-full animate-pulse"></span>
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(post.id, post.title)}
                    className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300 opacity-70 group-hover:opacity-100 hover:scale-110"
                    title="Delete post"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteDialog.postTitle}
      />
    </div>
  )
}
