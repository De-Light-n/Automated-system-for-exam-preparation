import React, { useState } from 'react';
import { MindMapNode } from '../types';
import { ChevronRight, ChevronDown, Circle } from 'lucide-react';

interface NodeProps {
  node: MindMapNode;
  isRoot?: boolean;
}

const TreeNode: React.FC<NodeProps> = ({ node, isRoot = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-start relative">
      <div className="flex items-center relative z-10">
         {/* Connector for non-roots */}
         {!isRoot && (
            <div className="w-8 h-px bg-slate-300 mr-2"></div>
         )}

        <div 
          className={`
            flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer transition-all select-none
            ${isRoot 
              ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20' 
              : 'bg-white text-slate-700 border-slate-200 hover:border-primary hover:shadow-md hover:text-primary'}
          `}
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          {hasChildren ? (
            <div className={`p-0.5 rounded-full ${isRoot ? 'bg-white/20' : 'bg-slate-100'}`}>
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-accent/50"></div>
          )}
          <span className={`font-heading font-bold ${isRoot ? 'text-lg' : 'text-sm'}`}>
            {node.label}
          </span>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="flex flex-col ml-[calc(1rem+24px)] border-l-2 border-slate-200/60 pl-0 my-3 space-y-4 animate-in slide-in-from-left-2 duration-300 origin-top-left">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

interface MindMapProps {
  data: MindMapNode;
}

export const MindMap: React.FC<MindMapProps> = ({ data }) => {
  return (
    <div className="h-[600px] w-full p-10 bg-slate-50 rounded-3xl border border-slate-200 overflow-auto relative shadow-inner">
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        
        <div className="min-w-fit relative z-10">
            <TreeNode node={data} isRoot={true} />
        </div>
    </div>
  );
};