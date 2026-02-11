'use client';

import { Header, MobileNav } from '@/components';
import { GrugChat } from '@/components/GrugChat';

export default function TalkPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow flex flex-col max-w-3xl">
        <GrugChat />
      </div>

      <MobileNav />
    </div>
  );
}
