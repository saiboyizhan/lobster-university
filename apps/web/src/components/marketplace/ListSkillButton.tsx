"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ListSkillForm from "./ListSkillForm";

export default function ListSkillButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("listSkillForm");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {t("title")}
      </button>
      <ListSkillForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}
