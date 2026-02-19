import UploadAvatars from "./ui/sliderAvtar";
import { useState } from "react";

export default function UploadWrapper() {
  const [avatarSrc, setAvatarSrc] = useState<string>("");

  return (
    <div className="flex justify-center items-center h-screen bg-[#0d1117]">
      <UploadAvatars avatarSrc={avatarSrc} setAvatarSrc={setAvatarSrc} />
    </div>
  );
}
