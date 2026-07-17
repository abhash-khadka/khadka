"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SaveAlert from "@/components/SaveAlert";

export default function SaveNotification({ message }: { message: string }) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      setShow(true);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <SaveAlert
      message={message}
      onDismiss={() => setShow(false)}
    />
  );
}
