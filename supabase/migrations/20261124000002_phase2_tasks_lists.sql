-- ==============================================================================
-- Faza 2: Struktura pracy (ClickUp-style) - Spaces, Folders, Lists, Statuses, Tasks
-- Plik: supabase/migrations/20261124000002_phase2_tasks_lists.sql
-- ==============================================================================

-- 1. SPACES
CREATE TABLE IF NOT EXISTS public.spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#C93B6D',
    icon TEXT DEFAULT 'folder',
    position TEXT NOT NULL DEFAULT '0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. FOLDERS
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT NOT NULL DEFAULT '0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. LISTS
CREATE TABLE IF NOT EXISTS public.lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT NOT NULL DEFAULT '0',
    project_id UUID, -- powiązanie z projektem budżetowym
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. STATUSES
CREATE TABLE IF NOT EXISTS public.statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
    list_id UUID REFERENCES public.lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#8c3150',
    category TEXT NOT NULL CHECK (category IN ('todo', 'active', 'done')),
    position INT NOT NULL DEFAULT 0,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status_id UUID REFERENCES public.statuses(id) ON DELETE SET NULL,
    priority INT NOT NULL DEFAULT 2 CHECK (priority BETWEEN 1 AND 4), -- 1: Urgent, 2: High, 3: Normal, 4: Low
    start_date DATE,
    due_date DATE,
    estimate_minutes INT NOT NULL DEFAULT 0,
    position TEXT NOT NULL DEFAULT '0',
    completed_at TIMESTAMPTZ,
    recurring_rule TEXT,
    custom JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 6. TASK ASSIGNEES
CREATE TABLE IF NOT EXISTS public.task_assignees (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (task_id, user_id)
);

-- 7. CHECKLISTS & CHECKLIST ITEMS
CREATE TABLE IF NOT EXISTS public.checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Lista zadań',
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. TAGS & TASK TAGS
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#C93B6D',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_tags (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- 9. SAVED VIEWS
CREATE TABLE IF NOT EXISTS public.saved_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    scope TEXT NOT NULL DEFAULT 'list', -- 'workspace', 'space', 'list'
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'list', -- 'list', 'board', 'calendar', 'timeline'
    filters JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort JSONB NOT NULL DEFAULT '{}'::jsonb,
    group_by TEXT NOT NULL DEFAULT 'status',
    columns JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_shared BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEKSY WYDAJNOŚCIOWE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_spaces_ws ON public.spaces(workspace_id);
CREATE INDEX IF NOT EXISTS idx_folders_space ON public.folders(space_id);
CREATE INDEX IF NOT EXISTS idx_lists_space ON public.lists(space_id);
CREATE INDEX IF NOT EXISTS idx_lists_folder ON public.lists(folder_id);
CREATE INDEX IF NOT EXISTS idx_tasks_ws_list_pos ON public.tasks(workspace_id, list_id, position) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON public.tasks(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(workspace_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_task_assignees_user ON public.task_assignees(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items ON public.checklist_items(checklist_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_views ENABLE ROW LEVEL SECURITY;

-- 1. SPACES POLICIES
CREATE POLICY "Members can view spaces"
    ON public.spaces FOR SELECT
    USING (public.is_member(workspace_id));

CREATE POLICY "Managers and above can create/edit spaces"
    ON public.spaces FOR ALL
    USING (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager']));

-- 2. FOLDERS POLICIES
CREATE POLICY "Members can view folders"
    ON public.folders FOR SELECT
    USING (public.is_member(workspace_id));

CREATE POLICY "Managers and above can manage folders"
    ON public.folders FOR ALL
    USING (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager']));

-- 3. LISTS POLICIES
CREATE POLICY "Members can view lists"
    ON public.lists FOR SELECT
    USING (public.is_member(workspace_id));

CREATE POLICY "Managers and above can manage lists"
    ON public.lists FOR ALL
    USING (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager']));

-- 4. STATUSES POLICIES
CREATE POLICY "Members can view statuses"
    ON public.statuses FOR SELECT
    USING (public.is_member(workspace_id));

CREATE POLICY "Managers and above can manage statuses"
    ON public.statuses FOR ALL
    USING (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager']));

-- 5. TASKS POLICIES
CREATE POLICY "Members can view tasks"
    ON public.tasks FOR SELECT
    USING (public.is_member(workspace_id));

CREATE POLICY "Members and above can create/edit tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Members and above can update tasks"
    ON public.tasks FOR UPDATE
    USING (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Members and above can delete tasks"
    ON public.tasks FOR DELETE
    USING (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager', 'member']));

-- 6. TASK ASSIGNEES POLICIES
CREATE POLICY "Members can view task assignees"
    ON public.task_assignees FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_assignees.task_id
            AND public.is_member(t.workspace_id)
        )
    );

CREATE POLICY "Members can manage task assignees"
    ON public.task_assignees FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_assignees.task_id
            AND public.has_role(t.workspace_id, ARRAY['owner', 'admin', 'manager', 'member'])
        )
    );

-- 7. CHECKLISTS POLICIES
CREATE POLICY "Members can view checklists"
    ON public.checklists FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = checklists.task_id
            AND public.is_member(t.workspace_id)
        )
    );

CREATE POLICY "Members can manage checklists"
    ON public.checklists FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = checklists.task_id
            AND public.has_role(t.workspace_id, ARRAY['owner', 'admin', 'manager', 'member'])
        )
    );

CREATE POLICY "Members can view checklist items"
    ON public.checklist_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.checklists c
            JOIN public.tasks t ON t.id = c.task_id
            WHERE c.id = checklist_items.checklist_id
            AND public.is_member(t.workspace_id)
        )
    );

CREATE POLICY "Members can manage checklist items"
    ON public.checklist_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.checklists c
            JOIN public.tasks t ON t.id = c.task_id
            WHERE c.id = checklist_items.checklist_id
            AND public.has_role(t.workspace_id, ARRAY['owner', 'admin', 'manager', 'member'])
        )
    );

-- 8. TAGS POLICIES
CREATE POLICY "Members can view tags"
    ON public.tags FOR SELECT
    USING (public.is_member(workspace_id));

CREATE POLICY "Members can manage tags"
    ON public.tags FOR ALL
    USING (public.has_role(workspace_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Members can view and manage task tags"
    ON public.task_tags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_tags.task_id
            AND public.is_member(t.workspace_id)
        )
    );

-- 9. SAVED VIEWS POLICIES
CREATE POLICY "Members can view saved views"
    ON public.saved_views FOR SELECT
    USING (public.is_member(workspace_id) AND (is_shared OR user_id = auth.uid()));

CREATE POLICY "Members can manage their saved views"
    ON public.saved_views FOR ALL
    USING (public.is_member(workspace_id));
