"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SaveAlert from "@/components/SaveAlert";

export default function SaveNotification({ message }: { message: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Derived from the URL instead of state+effect: the alert shows while
  // ?saved=1 is present and hides once dismissed (which clears the param).
  const show = searchParams.get("saved") === "1";

  if (!show) return null;

  return (
    <SaveAlert
      message={message}
      onDismiss={() => router.replace(pathname)}
    />
  );
}
