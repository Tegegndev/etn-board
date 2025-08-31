"use client"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  postTitle: string
}

export function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, postTitle }: DeleteConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-300"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 animate-in zoom-in-95 fade-in-0 duration-300 shadow-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Delete Post</h3>
          <p className="text-gray-300 text-sm">
            Are you sure you want to delete "{postTitle}"? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
