"use client";

import { useState } from "react";
import ListSkillForm from "./ListSkillForm";

export default function ListSkillButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        List a Skill
      </button>
      <ListSkillForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}
