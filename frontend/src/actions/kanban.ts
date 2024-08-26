import type { UniqueIdentifier } from '@dnd-kit/core';
import type { IKanban, IKanbanTask, IKanbanColumn } from 'src/types/kanban';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const enableServer = true;

const KANBAN_ENDPOINT = endpoints.kanban;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type BoardData = {
  result: {
    board: IKanban;
  }
};

export function useGetBoard() {
  const { data, isLoading, error, isValidating } = useSWR<BoardData>(
    KANBAN_ENDPOINT,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    // const tasks = data?.board.tasks ?? {};
    // const columns = data?.board.columns ?? [];

    const tasks = data?.result?.board.tasks ?? {};
    const columns = data?.result?.board.columns ?? [];

    return {
      board: { tasks, columns },
      boardLoading: isLoading,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !isLoading && !columns.length,
    };
  }, [data?.result?.board.columns, data?.result?.board.tasks, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

// Not Needed
// export async function createColumn(columnData: IKanbanColumn) {
//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { columnData };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'create-column' } });
//   }

//   /**
//    * Work in local
//    */
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       const { board } = currentData as BoardData;

//       // add new column in board.columns
//       const columns = [...board.columns, columnData];

//       // add new task in board.tasks
//       const tasks = { ...board.tasks, [columnData.id]: [] };

//       return { ...currentData, board: { ...board, columns, tasks } };
//     },
//     false
//   );
// }

// // ----------------------------------------------------------------------

// export async function updateColumn(columnId: UniqueIdentifier, columnName: string) {
//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { columnId, columnName };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-column' } });
//   }

//   /**
//    * Work in local
//    */
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       const { board } = currentData as BoardData;

//       const columns = board.columns.map((column) =>
//         column.id === columnId
//           ? {
//             // Update data when found
//             ...column,
//             name: columnName,
//           }
//           : column
//       );

//       return { ...currentData, board: { ...board, columns } };
//     },
//     false
//   );
// }

// // ----------------------------------------------------------------------

// export async function moveColumn(updateColumns: IKanbanColumn[]) {
//   /**
//    * Work in local
//    */
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       const { board } = currentData as BoardData;

//       return { ...currentData, board: { ...board, columns: updateColumns } };
//     },
//     false
//   );

//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { updateColumns };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'move-column' } });
//   }
// }

// // ----------------------------------------------------------------------

// export async function clearColumn(columnId: UniqueIdentifier) {
//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { columnId };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'clear-column' } });
//   }

//   /**
//    * Work in local
//    */
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       const { board } = currentData as BoardData;

//       // remove all tasks in column
//       const tasks = { ...board.tasks, [columnId]: [] };

//       return { ...currentData, board: { ...board, tasks } };
//     },
//     false
//   );
// }

// // ----------------------------------------------------------------------

// export async function deleteColumn(columnId: UniqueIdentifier) {
//   /**
//    * Work on server
//    */
//   if (enableServer) {
//     const data = { columnId };
//     await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'delete-column' } });
//   }

//   /**
//    * Work in local
//    */
//   mutate(
//     KANBAN_ENDPOINT,
//     (currentData) => {
//       const { board } = currentData as BoardData;

//       // delete column in board.columns
//       const columns = board.columns.filter((column) => column.id !== columnId);

//       // delete tasks by column deleted
//       const tasks = Object.keys(board.tasks)
//         .filter((key) => key !== columnId)
//         .reduce((obj: IKanban['tasks'], key) => {
//           obj[key] = board.tasks[key];
//           return obj;
//         }, {});

//       return { ...currentData, board: { ...board, columns, tasks } };
//     },
//     false
//   );
// }

// Not Needed


// ----------------------------------------------------------------------

export async function createTask(columnId: UniqueIdentifier, taskData: IKanbanTask) {

  /**
   * Work on server
   */
  if (enableServer) {
    // const data = { columnId, taskData };

    const data = {
      name: taskData.name,
      priority: taskData.priority,
      status: taskData.status
    }
    await axios.post(endpoints.task.create, data, {});
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {      
      const { result } = currentData as BoardData;
      const { board} = result;
      
      // add task in board.tasks
      const tasks = { ...result.board.tasks, [columnId]: [taskData, ...board.tasks[columnId]] };

      console.log('returned value', { ...currentData, board: { ...board, tasks } });

      
      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateTask(columnId: UniqueIdentifier, taskData: IKanbanTask) {

  console.log('update called');

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskData };
    await axios.post(KANBAN_ENDPOINT, data, { params: { endpoint: 'update-task' } });
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      const { board } = currentData as BoardData;

      // tasks in column
      const tasksInColumn = board.tasks[columnId];

      // find and update task
      const updateTasks = tasksInColumn.map((task) =>
        task.id === taskData.id
          ? {
            // Update data when found
            ...task,
            ...taskData,
          }
          : task
      );

      const tasks = { ...board.tasks, [columnId]: updateTasks };

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function moveTask(updateTasks: IKanban['tasks'], updatedColumn: string) {
  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      // const { board } = currentData as BoardData;

      const { result } = currentData as BoardData;
      const { board} = result;

      // update board.tasks
      const tasks = updateTasks;

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
  

  let newStatus: string;
  switch (updatedColumn) {
    case '1':
      newStatus = "To Do"
      break;
    case '2':
      newStatus = "In Progress"
      break;
    case '3':
      newStatus = "In Review"
      break;
    case '4':
      newStatus = "Completed"
      break;
    default:
      newStatus = "To Do"
      break;
  }

  /**
   * Work on server
   */
  if (enableServer) {
    const data = {
      status: newStatus
    };

    await axios.patch(`${endpoints.task.update}/${updateTasks.id}`, data, {});
  }
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId: UniqueIdentifier, taskId: UniqueIdentifier) {
    
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { columnId, taskId };
    await axios.delete(`${endpoints.task.delete}/${taskId}`, {});
  }

  /**
   * Work in local
   */
  mutate(
    KANBAN_ENDPOINT,
    (currentData) => {
      // const { board } = currentData as BoardData;

      const { result } = currentData as BoardData;
      const { board} = result;

      // delete task in column
      const tasks = {
        ...board.tasks,
        [columnId]: board.tasks[columnId].filter((task) => task.id !== taskId),
      };

      console.log('latest data', { ...currentData, board: { ...board, tasks } });
      

      return { ...currentData, board: { ...board, tasks } };
    },
    false
  );
}
