"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import NewPostForm from "./NewPostForm";

export default function NewPostButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("community");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("newPost")}
      </button>
      <NewPostForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}
