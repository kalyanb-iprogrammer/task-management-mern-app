import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
  CollisionDetection,
} from '@dnd-kit/core';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  rectIntersection,
  getFirstCollision,
  MeasuringStrategy,
} from '@dnd-kit/core';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { hideScrollY } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { moveTask, useGetBoard } from 'src/actions/kanban';

import { EmptyContent } from 'src/components/empty-content';

import { kanbanClasses } from '../classes';
import { coordinateGetter } from '../utils';
import { KanbanColumn } from '../column/kanban-column';
import { KanbanTaskItem } from '../item/kanban-task-item';
// import { KanbanColumnAdd } from '../column/kanban-column-add';
import { KanbanColumnSkeleton } from '../components/kanban-skeleton';
import { KanbanDragOverlay } from '../components/kanban-drag-overlay';

// ----------------------------------------------------------------------

const PLACEHOLDER_ID = 'placeholder'; // not needed

const cssVars = {
  '--item-gap': '16px',
  '--item-radius': '12px',
  '--column-gap': '24px',
  '--column-width': '336px',
  '--column-radius': '16px',
  '--column-padding': '20px 16px 16px 16px',
};

export function KanbanView() {

  console.log('got called again');
  
  const { board, boardLoading, boardEmpty } = useGetBoard();

  console.log('new data', board);
  
  // Determines if columns are fixed in place or scrollable.
  const [columnFixed, setColumnFixed] = useState(true);

  // recentlyMovedToNewContainer and lastOverId: Refs to track drag events and the last container a task was moved to.
  const recentlyMovedToNewContainer = useRef(false);

  const lastOverId = useRef<UniqueIdentifier | null>(null);

  // The ID of the currently dragged item.
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const columnIds = board.columns.map((column) => column.id);

  const isSortingContainer = activeId ? columnIds.includes(activeId) : false;

  // Configured with mouse, touch, and keyboard sensors for handling drag-and-drop.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  // Custom collision detection strategy to determine the closest drop target.
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in board.tasks) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (column) => column.id in board.tasks
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);

      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
          pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in board.tasks) {
          const columnItems = board.tasks[overId].map((task) => task.id);

          // If a column is matched and it contains items (columns 'A', 'B', 'C')
          if (columnItems.length > 0) {
            // Return the closest droppable within that column
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (column) => column.id !== overId && columnItems.includes(column.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new column, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new column, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, board?.tasks]
  );

  // const findColumn = (id: UniqueIdentifier) => {    
  //   // if (id in board.tasks) {
  //   //   return id;
  //   // }

  //   return Object.keys(board.tasks).find((key) =>
  //     board.tasks[key].map((task) => task.id).includes(id)
  //   );
  // };

  const findColumn = (id: UniqueIdentifier) => Object.keys(board.tasks).find((key) =>
      board.tasks[key].map((task) => task.id).includes(id)
    );

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, []);

  /**
   * onDragStart - Sets the active item when dragging begins.
   */
  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  /**
   * onDragOver -  Handles the logic when an item is dragged over another item or column, updating the task positions.
   */
  // const onDragOver = ({ active, over }: DragOverEvent) => {
  //   const overId = over?.id;

  //   if (overId == null || active.id in board.tasks) {
  //     return;
  //   }

  //   const overColumn = findColumn(overId);

  //   const activeColumn = findColumn(active.id);

  //   if (!overColumn || !activeColumn) {
  //     return;
  //   }

  //   if (activeColumn !== overColumn) {
  //     const activeItems = board.tasks[activeColumn].map((task) => task.id);
  //     const overItems = board.tasks[overColumn].map((task) => task.id);
  //     const overIndex = overItems.indexOf(overId);
  //     const activeIndex = activeItems.indexOf(active.id);

  //     let newIndex: number;

  //     if (overId in board.tasks) {
  //       newIndex = overItems.length + 1;
  //     } else {
  //       const isBelowOverItem =
  //         over &&
  //         active.rect.current.translated &&
  //         active.rect.current.translated.top > over.rect.top + over.rect.height;

  //       const modifier = isBelowOverItem ? 1 : 0;

  //       newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
  //     }

  //     recentlyMovedToNewContainer.current = true;

  //     const updateTasks = {
  //       ...board.tasks,
  //       [activeColumn]: board.tasks[activeColumn].filter((task) => task.id !== active.id),
  //       [overColumn]: [
  //         ...board.tasks[overColumn].slice(0, newIndex),
  //         board.tasks[activeColumn][activeIndex],
  //         ...board.tasks[overColumn].slice(newIndex, board.tasks[overColumn].length),
  //       ],
  //     };

  //     moveTask(updateTasks);
  //   }
  // };

  /**
   * onDragEnd - Finalizes the item’s new position after dragging ends, moving columns or tasks as needed
   */
  const onDragEnd = ({ active, over }: DragEndEvent) => {

    console.log('active here', active.id);
    console.log('over here', over?.id);


    // if (active.id in board.tasks && over?.id) {
    //   const activeIndex = columnIds.indexOf(active.id);
    //   const overIndex = columnIds.indexOf(over.id);

    //   const updateColumns = arrayMove(board.columns, activeIndex, overIndex);

    //   moveColumn(updateColumns);
    // }

    const activeColumn = findColumn(active.id);

    console.log('activeColumn', activeColumn);
    

    // If not active column to acive id to null
    if (!activeColumn) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    // If no over id to acive id to null
    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overColumn = findColumn(overId);

    console.log('overColumn', overColumn);

    // If start and drop column is same then do nothing
    if (activeColumn === overColumn) {
      setActiveId(null);
      return;
    }

    if (overColumn) {
      // const activeContainerTaskIds = board.tasks[activeColumn].map((task) => task.id);
      // console.log('activeContainerTaskIds', activeContainerTaskIds);

      // const overContainerTaskIds = board.tasks[overColumn].map((task) => task.id);
      // console.log('overContainerTaskIds', overContainerTaskIds);

      // const activeIndex = activeContainerTaskIds.indexOf(active.id);
      // const overIndex = overContainerTaskIds.indexOf(overId);

      // console.log('active index', activeIndex);
      // console.log('over index', activeIndex);

      // if (activeIndex !== overIndex) {
      //   const updateTasks = {
      //     ...board.tasks,
      //     [overColumn]: arrayMove(board.tasks[overColumn], activeIndex, overIndex),
      //   };

      //   moveTask(updateTasks);
      // }
      const updatedTask = {
        id: active.id
      }
      moveTask(updatedTask, overColumn);
    }

    setActiveId(null);
  };

  /**
 * Show Skeleton When Fetching data
 */
  const renderLoading = (
    <Stack direction="row" alignItems="flex-start" sx={{ gap: 'var(--column-gap)' }}>
      <KanbanColumnSkeleton />
    </Stack>
  );

  // Shows an empty state if no columns or tasks are found
  const renderEmpty = <EmptyContent filled sx={{ py: 10, maxHeight: { md: 480 } }} />;

  // Displays the Kanban board with columns and tasks, wrapped in a DndContext for drag-and-drop functionality.
  const renderList = (
    <DndContext
      id="dnd-kanban"
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      // onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Stack sx={{ flex: '1 1 auto', overflowX: 'auto' }}>
        <Stack
          sx={{
            pb: 3,
            display: 'unset',
            ...(columnFixed && { minHeight: 0, display: 'flex', flex: '1 1 auto' }),
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 'var(--column-gap)',
              ...(columnFixed && {
                minHeight: 0,
                flex: '1 1 auto',
                [`& .${kanbanClasses.columnList}`]: { ...hideScrollY, flex: '1 1 auto' },
              }),
            }}
          >
            <SortableContext
              items={[...columnIds, PLACEHOLDER_ID]}
              strategy={horizontalListSortingStrategy}
            >
              {board?.columns.map((column) => (
                <KanbanColumn key={column.id} column={column} tasks={board.tasks[column.id]}>
                  <SortableContext
                    items={board.tasks[column.id]}
                    strategy={verticalListSortingStrategy}
                  >
                    {board.tasks[column.id].map((task) => (
                      <KanbanTaskItem
                        task={task}
                        key={task.id}
                        columnId={column.id}
                        disabled={isSortingContainer}
                      />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              ))}

              {/* <KanbanColumnAdd id={PLACEHOLDER_ID} /> */}
            </SortableContext>
          </Stack>
        </Stack>
      </Stack>

      <KanbanDragOverlay
        columns={board?.columns}
        tasks={board?.tasks}
        activeId={activeId}
        sx={cssVars}
      />
    </DndContext>
  );

  return (
    // Renders the Kanban board using the DashboardContent layout.
    <DashboardContent
      maxWidth={false}
      sx={{
        ...cssVars,
        pb: 0,
        pl: { sm: 3 },
        pr: { sm: 0 },
        flex: '1 1 0',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pr: { sm: 3 }, mb: { xs: 3, md: 5 } }}
      >
        <Typography variant="h4">Kanban</Typography>

        <FormControlLabel
          label="Column fixed"
          labelPlacement="start"
          control={
            <Switch
              checked={columnFixed}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setColumnFixed(event.target.checked);
              }}
              inputProps={{ id: 'column-fixed-switch' }}
            />
          }
        />
      </Stack>

      {boardLoading ? renderLoading : <>{boardEmpty ? renderEmpty : renderList}</>}
    </DashboardContent>
  );
}
