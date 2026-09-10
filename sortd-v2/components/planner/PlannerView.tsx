"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  AdhocTask,
  PlannerOverride,
  PlannerPeriod,
  Routine,
  RoutineTask,
  ScheduleSettings,
  ScheduledBlock,
  Task,
} from "@/lib/types";

import {
  buildRollingSchedule,
  getScheduleDateKeys,
  SchedulableProjectTask,
} from "@/lib/scheduler";

import ItemDetailsModal from "@/components/task_management/ItemDetailsModal";

type PlannerViewProps = {
  tasks: SchedulableProjectTask[];
  routines: Routine[];
  adhocTasks: AdhocTask[];
  settings: ScheduleSettings;
  plannerOverrides: PlannerOverride[];

  onChangeSettings: (settings: ScheduleSettings) => void;
  onChangePlannerOverrides: (overrides: PlannerOverride[]) => void;

  onCompleteProjectTask: (projectId: string, taskId: string) => void;
  onCompleteRoutineTask: (routineId: string, taskId: string) => void;

  onUpdateProjectTask: (
    projectId: string,
    taskId: string,
    updates: Partial<Task>,
  ) => void;

  onUpdateRoutineTask: (
    routineId: string,
    taskId: string,
    updates: Partial<RoutineTask>,
  ) => void;

  onDeleteProjectTask: (projectId: string, taskId: string) => void;
  onDeleteRoutineTask: (routineId: string, taskId: string) => void;

  onAddAdhocTask: (task: AdhocTask) => void;
  onCompleteAdhocTask: (taskId: string) => void;
  onUpdateAdhocTask: (taskId: string, updates: Partial<AdhocTask>) => void;
  onDeleteAdhocTask: (taskId: string) => void;
};


function getDateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getTimeInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";

  return `${hour}:${minute}`;
}

function formatDayHeader(dateKey: string, timeZone: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const safeDate = new Date(Date.UTC(year, month - 1, day, 12));

  const weekday = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
  }).format(safeDate);

  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "numeric",
    month: "short",
  }).format(safeDate);

  return { weekday, date };
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;

  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${hours.toFixed(1)} hrs`;
}

function getPlannerPeriod(startTime: string): PlannerPeriod {
  const [hours] = startTime.split(":").map(Number);

  if (hours < 12) return "morning";
  if (hours < 17) return "afternoon";
  return "evening";
}

function matchesOverride(block: ScheduledBlock, override: PlannerOverride) {
  if (
    block.sourceType !== override.sourceType ||
    block.sourceId !== override.sourceId ||
    block.parentId !== override.parentId
  ) {
    return false;
  }

  if (block.sourceType === "routine") {
    return block.occurrenceDate === override.occurrenceDate;
  }

  return true;
}

function getRoutineTaskForBlock(routines: Routine[], block: ScheduledBlock) {
  if (block.sourceType !== "routine") return undefined;

  return routines
    .find((routine) => routine.id === block.parentId)
    ?.tasks.find((task) => task.id === block.sourceId);
}

function DraggablePlannerCard({
  block,
  anchored,
  manuallyPlaced,
  onComplete,
  onEdit,
  onResetToAuto,
}: {
  block: ScheduledBlock;
  anchored: boolean;
  manuallyPlaced: boolean;
  onComplete: () => void;
  onEdit: () => void;
  onResetToAuto: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
    disabled: anchored,
    data: { block },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-white p-3 shadow-sm transition ${
        isDragging
          ? "z-50 border-[#cd6ce7] opacity-80 shadow-xl"
          : anchored
            ? "border-slate-200"
            : manuallyPlaced
              ? "border-[#d9a7e7]"
              : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onComplete}
          aria-label={`Complete ${block.title}`}
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#cd6ce7] text-[10px] font-bold text-[#9d3db7] transition hover:bg-[#cd6ce7] hover:text-white"
        >
          ✓
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="min-w-0 flex-1 text-left"
            >
              <p className="break-words text-sm font-semibold leading-snug text-slate-900">
                {block.title}
              </p>
            </button>

            <button
              type="button"
              {...(!anchored ? attributes : {})}
              {...(!anchored ? listeners : {})}
              aria-label={anchored ? `${block.title} is anchored` : `Move ${block.title}`}
              title={anchored ? "Anchored routine" : "Drag to reschedule"}
              className={`shrink-0 rounded px-1 text-sm leading-none ${
                anchored
                  ? "cursor-default text-slate-300"
                  : "cursor-grab text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing"
              }`}
            >
              {anchored ? "🔒" : "⋮⋮"}
            </button>
          </div>

          <p className="mt-1 text-[11px] font-medium text-[#8d369f]">
            {block.startTime}–{block.endTime}
          </p>

          <p className="mt-1 break-words text-[11px] leading-snug text-slate-500">
            {block.sourceType === "adhoc"
              ? "Ad hoc"
              : `${block.parentName} · ${
                  block.sourceType === "routine" ? "Routine" : "Project"
                }`}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1">
            {anchored && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                anchored
              </span>
            )}

            {manuallyPlaced && !anchored && (
              <button
                type="button"
                onClick={onResetToAuto}
                className="rounded-full bg-purple-50 px-1.5 py-0.5 text-[9px] font-medium text-purple-700 hover:bg-purple-100"
                title="Let Sort'd choose the time again"
              >
                ↺ auto
              </button>
            )}

            {block.sessionIndex &&
              block.totalDurationMinutes &&
              block.totalDurationMinutes > block.durationMinutes && (
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600">
                  session {block.sessionIndex}
                </span>
              )}
          </div>
        </div>
      </div>
    </article>
  );
}

function DayDropZone({
  date,
  blocks,
  routines,
  plannerOverrides,
  onComplete,
  onEdit,
  onResetToAuto,
}: {
  date: string;
  blocks: ScheduledBlock[];
  routines: Routine[];
  plannerOverrides: PlannerOverride[];
  onComplete: (block: ScheduledBlock) => void;
  onEdit: (block: ScheduledBlock) => void;
  onResetToAuto: (block: ScheduledBlock) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${date}`,
    data: { date },
  });

  return (
    <section
      ref={setNodeRef}
      className={`min-h-[420px] p-3 transition ${
        isOver ? "bg-purple-50/80" : "bg-white/40"
      }`}
    >
      <div className="space-y-2">
        {blocks.length > 0 ? (
          blocks.map((block) => {
            const routineTask = getRoutineTaskForBlock(routines, block);

            const anchored =
              Boolean(block.anchored) ||
              (routineTask?.scheduleMode === "anchored" &&
                Boolean(routineTask.fixedStartTime));

            const manuallyPlaced =
              Boolean(block.manuallyPlaced) ||
              plannerOverrides.some((override) =>
                matchesOverride(block, override),
              );

            return (
              <DraggablePlannerCard
                key={block.id}
                block={block}
                anchored={anchored}
                manuallyPlaced={manuallyPlaced}
                onComplete={() => onComplete(block)}
                onEdit={() => onEdit(block)}
                onResetToAuto={() => onResetToAuto(block)}
              />
            );
          })
        ) : (
          <div
            className={`flex min-h-28 items-center justify-center rounded-xl border border-dashed px-3 text-center text-xs ${
              isOver
                ? "border-[#cd6ce7] text-[#9d3db7]"
                : "border-slate-200 text-slate-300"
            }`}
          >
            {isOver ? "Drop here" : "Nothing scheduled"}
          </div>
        )}
      </div>
    </section>
  );
}

export default function PlannerView({
  tasks,
  routines,
  adhocTasks,
  settings,
  plannerOverrides,

  onCompleteProjectTask,
  onCompleteRoutineTask,
  onCompleteAdhocTask,

  onUpdateProjectTask,
  onUpdateRoutineTask,
  onUpdateAdhocTask,

  onDeleteProjectTask,
  onDeleteRoutineTask,
  onDeleteAdhocTask,

  onAddAdhocTask,
  onChangePlannerOverrides,
}: PlannerViewProps) {
  const [clock, setClock] = useState(() => new Date());
  const [selectedItem, setSelectedItem] = useState<{
    sourceType: "task" | "routine" | "adhoc";
    sourceId: string;
    parentId: string;
  } | null>(null);

  const [newAdhocDate, setNewAdhocDate] = useState<string | null>(null);
  const [newAdhocTitle, setNewAdhocTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const today = getDateKeyInTimeZone(clock, settings.timeZone);
  const currentTime = getTimeInTimeZone(clock, settings.timeZone);

  const schedule = useMemo(
    () =>
      buildRollingSchedule({
        tasks,
        routines,
        adhocTasks,
        settings,
        today,
        currentTime,
        plannerOverrides,
      }),
    [
      tasks,
      routines,
      adhocTasks,
      settings,
      today,
      currentTime,
      plannerOverrides,
    ],
  );

  // The Planner is deliberately always a seven-day decision surface.
  // planningHorizonDays can still be used by the wider scheduling system elsewhere.
  const dateKeys = useMemo(() => getScheduleDateKeys(today, 7), [today]);

  const plannedMinutes = schedule.blocks.reduce(
    (total, block) => total + block.durationMinutes,
    0,
  );

  const selectedProjectTask =
    selectedItem?.sourceType === "task"
      ? tasks.find(
          (task) =>
            task.id === selectedItem.sourceId &&
            task.projectId === selectedItem.parentId,
        )
      : undefined;

  const selectedRoutineTask =
    selectedItem?.sourceType === "routine"
      ? routines
          .find((routine) => routine.id === selectedItem.parentId)
          ?.tasks.find((task) => task.id === selectedItem.sourceId)
      : undefined;

  const selectedAdhocTask =
    selectedItem?.sourceType === "adhoc"
      ? adhocTasks.find((task) => task.id === selectedItem.sourceId)
      : undefined;

  function completeBlock(block: ScheduledBlock) {
    if (block.sourceType === "routine") {
      onCompleteRoutineTask(block.parentId, block.sourceId);
      return;
    }

    if (block.sourceType === "adhoc") {
      onCompleteAdhocTask(block.sourceId);
      return;
    }

    onCompleteProjectTask(block.parentId, block.sourceId);
  }

  function openBlock(block: ScheduledBlock) {
    setSelectedItem({
      sourceType: block.sourceType,
      sourceId: block.sourceId,
      parentId: block.parentId,
    });
  }

  function removeOverride(block: ScheduledBlock) {
    onChangePlannerOverrides(
      plannerOverrides.filter((override) => !matchesOverride(block, override)),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const block = event.active.data.current?.block as ScheduledBlock | undefined;
    const date = event.over?.data.current?.date as string | undefined;

    if (!block || !date) return;

    // The board no longer exposes Morning / Afternoon / Evening lanes.
    // When an item moves to another day, keep roughly the same time-of-day
    // preference and let the scheduler choose the exact slot.
    const period: PlannerPeriod = getPlannerPeriod(block.startTime);

    const routineTask = getRoutineTaskForBlock(routines, block);
    const anchored =
      Boolean(block.anchored) ||
      (routineTask?.scheduleMode === "anchored" &&
        Boolean(routineTask.fixedStartTime));

    if (anchored) return;

    const nextOverride: PlannerOverride = {
      sourceType: block.sourceType,
      sourceId: block.sourceId,
      parentId: block.parentId,
      occurrenceDate:
        block.sourceType === "routine" ? block.occurrenceDate : undefined,
      date,
      period,
      manuallyPlaced: true,
    };

    const withoutPrevious = plannerOverrides.filter(
      (override) => !matchesOverride(block, override),
    );

    onChangePlannerOverrides([...withoutPrevious, nextOverride]);
  }

  function addAdhocForDate(dateKey: string) {
    const title = newAdhocTitle.trim();
    if (!title) return;

    onAddAdhocTask({
      id: crypto.randomUUID(),
      title,
      plannedDate: dateKey,
      estimatedMinutes: 30,
      context: "personal",
      completed: false,
      createdAt: new Date().toISOString(),
      order: adhocTasks.length + 1,
    });

    setNewAdhocTitle("");
    setNewAdhocDate(null);
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 overflow-hidden">
      <div className="rounded-3xl bg-white/85 p-5 shadow-xl backdrop-blur-md md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9d3db7]">
              Planner
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Your week</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Sort&apos;d plans the week. Drag flexible work to tell it what you want,
              and everything else replans around that decision.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl bg-[#f3eeee] px-4 py-3 text-center">
              <p className="text-xl font-bold">{schedule.blocks.length}</p>
              <p className="text-xs text-slate-500">Planned</p>
            </div>
            <div className="rounded-xl bg-[#f3eeee] px-4 py-3 text-center">
              <p className="text-xl font-bold">{formatMinutes(plannedMinutes)}</p>
              <p className="text-xs text-slate-500">Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-3">
          <div className="grid w-max grid-flow-col auto-cols-[240px] gap-3 pr-1">
            {dateKeys.map((dateKey) => {
              const { weekday, date } = formatDayHeader(dateKey, settings.timeZone);
              const dayBlocks = schedule.blocks.filter(
                (block) => block.date === dateKey,
              );

              return (
                <section
                  key={dateKey}
                  className={`overflow-hidden rounded-2xl border shadow-sm ${
                    dateKey === today
                      ? "border-[#d9a7e7] bg-purple-50/30"
                      : "border-slate-200 bg-white/80"
                  }`}
                >
                  <header className="border-b border-slate-100 bg-white/90 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-sm font-bold ${
                            dateKey === today ? "text-[#9d3db7]" : "text-slate-900"
                          }`}
                        >
                          {weekday}
                        </p>
                        <p className="text-xs text-slate-500">{date}</p>
                        {dateKey === today && (
                          <p className="mt-0.5 text-[10px] font-semibold text-[#9d3db7]">
                            Today
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewAdhocDate(dateKey);
                          setNewAdhocTitle("");
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f3eeee] text-sm font-semibold text-[#9d3db7] transition hover:bg-[#eaddea]"
                        title="Add an ad hoc task"
                      >
                        +
                      </button>
                    </div>

                    {newAdhocDate === dateKey && (
                      <div className="mt-3 space-y-2">
                        <input
                          value={newAdhocTitle}
                          onChange={(event) => setNewAdhocTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") addAdhocForDate(dateKey);
                            if (event.key === "Escape") {
                              setNewAdhocDate(null);
                              setNewAdhocTitle("");
                            }
                          }}
                          placeholder="Add task…"
                          autoFocus
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs outline-none focus:border-[#cd6ce7]"
                        />
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            disabled={!newAdhocTitle.trim()}
                            onClick={() => addAdhocForDate(dateKey)}
                            className="rounded-lg bg-[#9d3db7] px-2.5 py-1.5 text-[10px] font-semibold text-white disabled:opacity-40"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewAdhocDate(null);
                              setNewAdhocTitle("");
                            }}
                            className="px-2 py-1.5 text-[10px] text-slate-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </header>

                  <DayDropZone
                    date={dateKey}
                    blocks={dayBlocks}
                    routines={routines}
                    plannerOverrides={plannerOverrides}
                    onComplete={completeBlock}
                    onEdit={openBlock}
                    onResetToAuto={removeOverride}
                  />
                </section>
              );
            })}
          </div>
        </div>
      </DndContext>

      {schedule.unscheduled.length > 0 && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">Couldn&apos;t fit everything</h2>
          <p className="mt-1 text-sm text-amber-800">
            These still need space. You can edit their duration or constraints,
            or move other flexible work out of the way.
          </p>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {schedule.unscheduled.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-white/70 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.reason}</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedItem({
                      sourceType: item.sourceType,
                      sourceId: item.sourceId,
                      parentId: item.parentId,
                    })
                  }
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedItem && selectedRoutineTask && (
        <ItemDetailsModal
          kind="routine"
          item={selectedRoutineTask}
          onChange={(updates) =>
            onUpdateRoutineTask(
              selectedItem.parentId,
              selectedRoutineTask.id,
              updates,
            )
          }
          onDelete={() =>
            onDeleteRoutineTask(selectedItem.parentId, selectedRoutineTask.id)
          }
          onClose={() => setSelectedItem(null)}
        />
      )}

      {selectedItem && selectedProjectTask && (
        <ItemDetailsModal
          kind="task"
          item={selectedProjectTask}
          onChange={(updates) =>
            onUpdateProjectTask(
              selectedItem.parentId,
              selectedProjectTask.id,
              updates,
            )
          }
          onDelete={() =>
            onDeleteProjectTask(selectedItem.parentId, selectedProjectTask.id)
          }
          onClose={() => setSelectedItem(null)}
        />
      )}

      {selectedItem && selectedAdhocTask && (
        <ItemDetailsModal
          kind="task"
          item={selectedAdhocTask}
          onChange={(updates) => onUpdateAdhocTask(selectedAdhocTask.id, updates)}
          onDelete={() => onDeleteAdhocTask(selectedAdhocTask.id)}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
