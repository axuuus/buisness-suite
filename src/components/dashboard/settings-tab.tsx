"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { SegmentedControl, Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Role, getRoleLabel, can } from "@/lib/permissions";

export const SettingsTab: React.FC = () => {
  const {
    currentWorkspace,
    currentRole,
    members,
    invitations,
    inviteMember,
    theme,
    setTheme,
    animationsEnabled,
    setAnimationsEnabled,
  } = useWorkspace();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member");
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    try {
      await inviteMember(inviteEmail, inviteRole);
      setInviteFeedback(`Wysłano zaproszenie na adres ${inviteEmail} jako ${getRoleLabel(inviteRole)}!`);
      setInviteEmail("");
      setTimeout(() => setInviteFeedback(null), 4000);
    } catch {
      setInviteFeedback("Błąd podczas wysyłania zaproszenia.");
    }
  };

  const canManageInvitations = can(currentRole, "invitations:manage");

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold">Ustawienia Przestrzeni Roboczej</h2>
        <p className="text-xs text-[var(--muted)]">Konfiguracja wyglądu, animacji, zespołu i uprawnień</p>
      </div>

      {/* Wygląd & Interfejs */}
      <div className="p-5 rounded-2xl glass space-y-4">
        <h3 className="text-sm font-bold text-[var(--text)] border-b border-[var(--line)] pb-2">
          Wygląd & Motyw Liquid Glass
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div>
            <div className="text-xs font-semibold">Motyw kolorystyczny</div>
            <div className="text-[0.68rem] text-[var(--muted)]">Dostosuj do preferencji lub systemu</div>
          </div>
          <SegmentedControl
            value={theme}
            options={["auto", "light", "dark"]}
            onChange={setTheme}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-t border-[var(--line)]">
          <div>
            <div className="text-xs font-semibold">Animacja pionowych pasów banera (drift 40s)</div>
            <div className="text-[0.68rem] text-[var(--muted)]">Wyłącza płynne przesuwanie pasów w tle banera</div>
          </div>
          <Switch
            checked={animationsEnabled}
            onChange={setAnimationsEnabled}
            label="Animacja tła"
          />
        </div>
      </div>

      {/* Informacje o Workspace */}
      <div className="p-5 rounded-2xl glass space-y-4">
        <h3 className="text-sm font-bold text-[var(--text)] border-b border-[var(--line)] pb-2">
          Szczegóły Workspace ({currentWorkspace.name})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[var(--muted)] block">Nazwa:</span>
            <span className="font-semibold text-sm">{currentWorkspace.name}</span>
          </div>
          <div>
            <span className="text-[var(--muted)] block">Identyfikator (Slug):</span>
            <span className="font-mono opacity-80">{currentWorkspace.slug}</span>
          </div>
          <div>
            <span className="text-[var(--muted)] block">Waluta domyślna:</span>
            <span className="font-semibold">{currentWorkspace.default_currency}</span>
          </div>
          <div>
            <span className="text-[var(--muted)] block">Twoja rola:</span>
            <span className="font-semibold text-[var(--rose)]">{getRoleLabel(currentRole)}</span>
          </div>
        </div>
      </div>

      {/* Członkowie & Zaproszenia */}
      <div className="p-5 rounded-2xl glass space-y-4">
        <h3 className="text-sm font-bold text-[var(--text)] border-b border-[var(--line)] pb-2">
          Członkowie Zespołu & Role
        </h3>

        {/* Formularz zapraszania (widoczny tylko dla ról z uprawnieniem invitations:manage) */}
        {canManageInvitations ? (
          <form onSubmit={handleInvite} className="flex flex-wrap gap-2 items-center pb-3">
            <input
              type="email"
              placeholder="Wpisz e-mail współpracownika..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="text-xs px-3 py-2 rounded-xl bg-[var(--chip)] border border-[var(--line)] flex-1 min-w-[14rem] outline-none"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as Role)}
              className="text-xs px-3 py-2 rounded-xl bg-[var(--chip)] border border-[var(--line)] outline-none"
            >
              <option value="admin">Administrator</option>
              <option value="manager">Menedżer</option>
              <option value="member">Członek</option>
              <option value="viewer">Obserwator</option>
            </select>
            <Button variant="rose" type="submit">
              Zaproś do zespołu
            </Button>
          </form>
        ) : (
          <p className="text-xs text-[var(--muted)]">Tylko właściciel i administrator mogą zapraszać nowych członków.</p>
        )}

        {inviteFeedback && (
          <div className="text-xs p-2 rounded-lg bg-[rgba(175,71,105,0.15)] text-[var(--rose)] font-medium">
            {inviteFeedback}
          </div>
        )}

        {/* Tabela członków */}
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Imię i nazwisko</th>
                <th>E-mail</th>
                <th>Rola</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td data-l="Osoba" className="font-medium text-[var(--text)]">
                    {m.profile.full_name}
                  </td>
                  <td data-l="E-mail" className="opacity-80">
                    {m.profile.email}
                  </td>
                  <td data-l="Rola">
                    <span className="chip font-medium text-[var(--rose)]">
                      {getRoleLabel(m.role)}
                    </span>
                  </td>
                  <td data-l="Status">
                    <span className="st ok">{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
