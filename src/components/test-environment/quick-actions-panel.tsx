"use client";

import { useState } from "react";
import {
  Save,
  RotateCcw,
  Bookmark,
  BookmarkPlus,
  Send,
  CheckCircle,
  Circle,
  AlertTriangle,
  X,
  ArrowRight,
} from "lucide-react";

interface QuickActionsPanelProps {
  answered?: number;
  markedForReview?: number;
  notVisited?: number;
  onSaveAndNext?: () => void;
  onClearResponse?: () => void;
  onMarkForReview?: () => void;
  onSaveAndMarkForReview?: () => void;
  onSubmitTest?: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

export default function QuickActionsPanel({
  answered = 0,
  markedForReview = 0,
  notVisited = 180 - 0 - 0,
  onSaveAndNext,
  onClearResponse,
  onMarkForReview,
  onSaveAndMarkForReview,
  onSubmitTest,
  isMobile = false,
  isTablet = false,
}: QuickActionsPanelProps) {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleSubmitTest = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    onSubmitTest?.();
    setShowSubmitDialog(false);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <>
        <div className="bg-white">
          {/* Progress Summary - Compact */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3 px-1">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>{answered}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-500" />
              <span>{markedForReview}</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-gray-400" />
              <span>{notVisited}</span>
            </div>
          </div>

          {/* Action Buttons - Horizontal Layout */}
          <div className="flex gap-2 items-center">
            <button
              onClick={onSaveAndNext}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="text-sm">Next</span>
            </button>

            <div className="flex gap-1.5">
              <button
                onClick={onMarkForReview}
                className="flex items-center justify-center p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg transition-colors duration-200 border border-amber-200"
                title="Mark for Review"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={onClearResponse}
                className="flex items-center justify-center p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors duration-200 border border-gray-200"
                title="Clear Response"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        {showSubmitDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Submit Test
                  </h3>
                </div>
                <button
                  onClick={() => setShowSubmitDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to submit your test? This action cannot be
                undone.
              </p>
              <div className="space-y-2 mb-4 p-2 bg-gray-50 rounded-md text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Answered</span>
                  <span className="font-medium text-gray-900">
                    {answered}/180
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marked</span>
                  <span className="font-medium text-gray-900">
                    {markedForReview}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Not Visited</span>
                  <span className="font-medium text-gray-900">
                    {notVisited}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200 text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Tablet Layout
  if (isTablet) {
    return (
      <>
        <div className="bg-white">
          <div className="flex items-center justify-between">
            {/* Progress Summary */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Answered:</span>
                <span className="font-medium text-gray-900">
                  {answered}/180
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span className="text-gray-600">Marked:</span>
                <span className="font-medium text-gray-900">
                  {markedForReview}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Not Visited:</span>
                <span className="font-medium text-gray-900">{notVisited}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-center">
              <button
                onClick={onSaveAndNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Next</span>
              </button>

              <div className="flex gap-1.5">
                <button
                  onClick={onMarkForReview}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg transition-colors duration-200 border border-amber-200"
                >
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm">Mark</span>
                </button>
                <button
                  onClick={onClearResponse}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors duration-200 border border-gray-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Clear</span>
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-sm">Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        {showSubmitDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirm Test Submission
                  </h3>
                </div>
                <button
                  onClick={() => setShowSubmitDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to submit your test? This action cannot be
                undone.
              </p>
              <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Answered</span>
                  <span className="font-medium text-gray-900">
                    {answered}/180
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Marked for Review</span>
                  <span className="font-medium text-gray-900">
                    {markedForReview}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Not Visited</span>
                  <span className="font-medium text-gray-900">
                    {notVisited}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Layout (Original)
  return (
    <>
      <div className="w-72 bg-white rounded-md shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-4">
            {/* Progress Summary */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Progress Summary
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Answered
                  </span>
                  <span className="font-medium text-gray-900">
                    {answered}/180
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    Marked for Review
                  </span>
                  <span className="font-medium text-gray-900">
                    {markedForReview}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    Not Visited
                  </span>
                  <span className="font-medium text-gray-900">
                    {notVisited}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-4"></div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={onSaveAndNext}
                className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                Save & Next
              </button>
              <button
                onClick={onClearResponse}
                className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Response
              </button>
              <button
                onClick={onMarkForReview}
                className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors duration-200"
              >
                <BookmarkPlus className="w-4 h-4" />
                Mark for Review
              </button>
              <button
                onClick={onSaveAndMarkForReview}
                className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors duration-200"
              >
                <BookmarkPlus className="w-4 h-4" />
                Save & Mark for Review
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={handleSubmitTest}
                className="w-full flex items-center justify-center gap-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Test Submission
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to submit your test? This action cannot be
              undone. Please review your progress summary before confirming:
            </p>
            <div className="space-y-2 mb-6 p-1 bg-gray-50 rounded-md">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Answered</span>
                <span className="font-medium text-gray-900">
                  {answered}/180
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Marked for Review</span>
                <span className="font-medium text-gray-900">
                  {markedForReview}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Not Visited</span>
                <span className="font-medium text-gray-900">{notVisited}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
