'use client';

import dynamic from "next/dynamic";

const LeafMap = dynamic(() => import("./LeafMap").then(mod => mod.LeafMap), {
  ssr: false,
});

export default function LeafMapClient() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-gray-800">Define a Perimeter</h2>
      <LeafMap />
    </div>
  );
}
