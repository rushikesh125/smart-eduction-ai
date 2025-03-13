import React from 'react';
import { 
  BookOpen, 
  User, 
  Clock, 
  Tag, 
  DollarSign, 
  Globe, 
  BarChart, 
  FileText, 
  ChevronRight 
} from 'lucide-react';

const MergeRequestCard = ({ mergeRequest }) => {
  const {
    courseTitle,
    requestedBy,
    status,
    category,
    coursePrice,
    language,
    level,
    shortDescription
  } = mergeRequest;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Status Banner */}
      <div className={`px-4 py-2 ${statusColors[status] || "bg-gray-100 text-gray-800"} flex items-center justify-between`}>
        <span className="font-medium capitalize">{status} Merge Request</span>
        <span className="text-sm">{formatDate(new Date())}</span>
      </div>
      
      {/* Course Title */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <BookOpen className="text-purple-500 mr-3" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">{courseTitle}</h2>
        </div>
      </div>
      
      {/* Requester Info */}
      <div className="px-6 py-3 bg-gray-50 flex items-center">
        <div className="flex-shrink-0 mr-3">
          {requestedBy.photoURL ? (
            <img 
              src={requestedBy.photoURL} 
              alt={requestedBy.username} 
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center">
              <span className="text-white font-medium">
                {requestedBy.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800">{requestedBy.username || "Unknown User"}</p>
          <p className="text-sm text-gray-500">{requestedBy.email}</p>
        </div>
        <div className="ml-auto flex items-center">
          <Clock className="text-purple-400 mr-1" size={16} />
          <span className="text-sm text-gray-600">Requested on {formatDate(new Date())}</span>
        </div>
      </div>
      
      {/* Course Details */}
      <div className="px-6 py-4">
        <div className="text-sm text-gray-600 mb-4">{shortDescription}</div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <Tag className="text-purple-400 mr-2" size={16} />
            <span className="text-gray-700">{category}</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="text-purple-400 mr-2" size={16} />
            <span className="text-gray-700">{typeof coursePrice === 'number' ? `$${coursePrice.toFixed(2)}` : coursePrice || 'Free'}</span>
          </div>
          
          <div className="flex items-center">
            <Globe className="text-purple-400 mr-2" size={16} />
            <span className="text-gray-700">{language || 'English'}</span>
          </div>
          
          <div className="flex items-center">
            <BarChart className="text-purple-400 mr-2" size={16} />
            <span className="text-gray-700">{level || 'Beginner'}</span>
          </div>
        </div>
      </div>
      
      {/* Footer Action */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <FileText className="text-purple-400 mr-2" size={18} />
          <span className="text-gray-700">{mergeRequest.courseChapters?.length || 0} Chapters</span>
        </div>
        
        <button className="flex items-center px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <span className="mr-1">Review Request</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default MergeRequestCard;