"use client";

import React, { useState } from "react";

interface CommandBarProps {
  onSearch?: (query: string) => void;
  defaultTag?: string;
  placeholder?: string;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  onSearch,
  defaultTag = "/billable",
  placeholder = "Chcę wiedzieć, skąd spadek między zatwierdzonymi godzinami a",
}) => {
  const [val, setVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(val);
  };

  return (
    <div className="cmdbar float" role="search" aria-label="Pasek poleceń">
      <div className="q">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2c.6 4.6 3.4 7.4 8 8-4.6.6-7.4 3.4-8 8-.6-4.6-3.4-7.4-8-8 4.6-.6 7.4-3.4 8-8zM19 15c.3 2 1.2 2.9 3 3.2-1.8.3-2.7 1.2-3 3.2-.3-2-1.2-2.9-3-3.2 1.8-.3 2.7-1.2 3-3.2z" />
        </svg>
        <span>Co chcesz sprawdzić dalej?</span>
      </div>
      <form onSubmit={handleSubmit} className="f">
        <span>{placeholder}</span>
        {defaultTag && <span className="tag">{defaultTag}</span>}
        <span className="caret" aria-hidden="true" />
      </form>
    </div>
  );
};
