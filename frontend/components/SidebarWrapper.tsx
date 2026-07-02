"use client";

import { useState } from "react";
import SidebarNav from "@/components/SidebarNav";
import UploadModal from "@/components/UploadModal";

export default function SidebarWrapper() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <SidebarNav onUploadClick={() => setUploadOpen(true)} />
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => setUploadOpen(false)}
      />
    </>
  );
}
