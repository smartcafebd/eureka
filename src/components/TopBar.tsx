import React from 'react';

interface TopBarProps {
  onOpenTrackModal?: () => void;
  onOpenHappinessModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  return (
    <div className="bg-[#282828] text-white text-[13px] sm:text-[14px] font-medium py-2 px-4 border-b border-[#383838] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <p className="flex items-center justify-center gap-2 font-medium tracking-wide">
          <span>সারা বাংলাদেশ ক্যাশ অন ডেলিভারি</span>
          <span className="text-base sm:text-lg select-none">🚚</span>
        </p>
      </div>
    </div>
  );
};

