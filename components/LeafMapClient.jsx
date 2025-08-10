'use client';

import dynamic from "next/dynamic";

const LeafMap = dynamic(() => import("./LeafMap").then(mod => mod.LeafMap), {
  ssr: false,
});

export default function LeafMapClient() {
  return <LeafMap  />;
}
