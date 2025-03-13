import React, { useState } from "react";
import {
  BookOpen,
  User,
  Clock,
  Tag,
  DollarSign,
  Globe,
  BarChart,
  FileText,
  ChevronRight,
  Check,
  X,
  Clock8,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/react";
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import toast from "react-hot-toast";
import { mergeSummaryGenAi } from "@/models/genMRSummary";
import { useCourse } from "@/firebase/courses/read";

const MergeRequestCard = ({ data, courseId }) => {
  const {
    courseTitle,
    requestedBy,
    status,
    category,
    coursePrice,
    language,
    level,
    shortDescription,
    courseChapters,
    mergeRequestId,
  } = data;
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {data:course,error} = useCourse({id:courseId})
  const statusConfig = {
    pending: {
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
      icon: <Clock8 className="text-yellow-500 mr-2" size={18} />,
    },
    approved: {
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      icon: <Check className="text-green-500 mr-2" size={18} />,
    },
    rejected: {
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      icon: <X className="text-red-500 mr-2" size={18} />,
    },
  };

  const currentStatus = statusConfig[status] || {
    bgColor: "bg-gray-50",
    textColor: "text-gray-800",
    borderColor: "border-gray-200",
    icon: <Clock className="text-gray-500 mr-2" size={18} />,
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleGenerateSummary = async ()=>{
    setIsLoading(true)
    try {
      if(!course || !data ){
        toast.error("missing course data or merge course data")
        return
      }
        const res = await mergeSummaryGenAi(course,data) 
        setSummary(res)
    } catch (error) {
        console.log(error)
        toast.error("Error Generating Summary")
    }finally{
        setIsLoading(false)
    }
  }

  return (
    <div
      className={`w-full bg-white rounded-xl shadow-sm border ${currentStatus.borderColor} overflow-hidden transition-all`}
    >
      {/* Status Banner */}
      <div
        className={`px-6 py-3 ${currentStatus.bgColor} ${currentStatus.textColor} flex items-center justify-between border-b border-opacity-50 ${currentStatus.borderColor}`}
      >
        <div className="flex items-center">
          {currentStatus.icon}
          <span className="font-medium capitalize">{status} Merge Request</span>
        </div>
        <span className="text-sm bg-white bg-opacity-40 py-1 px-3 rounded-full">
          {formatDate(new Date())}
        </span>
      </div>

      {/* Course Title */}
      <div className="px-6 py-4">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg mr-4">
            <BookOpen className="text-purple-500" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{courseTitle}</h2>
        </div>
      </div>

      {/* Requester Info */}
      <div className="px-6 py-4 bg-gray-50 flex items-center">
        <div className="flex-shrink-0 mr-3">
          {requestedBy?.photoURL ? (
            <img
              src={requestedBy.photoURL}
              alt={requestedBy.username}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-lg">
                {requestedBy?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800">
            {requestedBy?.username || "Unknown User"}
          </p>
          <p className="text-sm text-gray-500">{requestedBy?.email}</p>
        </div>
        <div className="ml-auto flex items-center bg-white py-1 px-3 rounded-full border border-gray-200">
          <Clock className="text-purple-400 mr-1" size={14} />
          <span className="text-sm text-gray-600">
            {formatDate(new Date())}
          </span>
        </div>
      </div>

      {/* Course Details */}
      <div className="px-6 py-5">
        <div className="text-gray-600 mb-5 leading-relaxed">
          {shortDescription}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-md mr-3">
              <Tag className="text-purple-500" size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Category</div>
              <div className="text-gray-800 font-medium">
                {category || "Uncategorized"}
              </div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-md mr-3">
              <DollarSign className="text-purple-500" size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Price</div>
              <div className="text-gray-800 font-medium">
                {typeof coursePrice === "number"
                  ? `$${coursePrice.toFixed(2)}`
                  : coursePrice || "Free"}
              </div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-md mr-3">
              <Globe className="text-purple-500" size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Language</div>
              <div className="text-gray-800 font-medium">
                {language || "English"}
              </div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-md mr-3">
              <BarChart className="text-purple-500" size={16} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Level</div>
              <div className="text-gray-800 font-medium">
                {level || "Beginner"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center bg-purple-50 py-2 px-4 rounded-full">
          <FileText className="text-purple-500 mr-2" size={18} />
          <span className="text-purple-700 font-medium">
            {courseChapters?.length || 0}{" "}
            {courseChapters?.length === 1 ? "Chapter" : "Chapters"}
          </span>
        </div>

        <div className="flex gap-3">
          {status === "pending" && (
            <>
              <button className="flex items-center px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                <X size={16} className="mr-1" />
                <span>Reject</span>
              </button>
              <button className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-colors shadow-sm">
                <Check size={16} className="mr-1" />
                <span>Approve</span>
              </button>
            </>
          )}
          <Link
            href={`/merge-preview?cid=${courseId}&mrid=${mergeRequestId}`}
            className="flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <span className="mr-1">Preview</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
      <div className="w-full p-2 md:p-4">
        <Button
          startContent={<BrainCircuit className="w-5 h-5" />}
          color="secondary"
          isLoading={isLoading}
          isDisabled={isLoading}
          variant="ghost"
            onPress={handleGenerateSummary}
          className="mt-3 bg-purple-100 text-purple-500 hover:bg-purple-200 font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Generate Summary with AI ✨
        </Button>
        <hr className="my-3" />
        <div>
          {summary && (
            <div data-color-mode="light">
              <MDEditor.Markdown
                source={summary}
                rehypePlugins={[
                  [rehypeSanitize],
                  [rehypeHighlight, { detect: true, ignoreMissing: true }],
                ]}
                className="text-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MergeRequestCard;
