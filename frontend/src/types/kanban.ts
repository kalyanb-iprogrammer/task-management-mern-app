import { UniqueIdentifier } from "@dnd-kit/core";

import type { IDateValue } from './common';

export type IKanbanTask = {
    id?: UniqueIdentifier;
    name?: string;
    status?: string;
    priority?: string;
    // description?: string; 
    // due: [IDateValue, IDateValue];
};

export type IKanbanColumn = {
    id: UniqueIdentifier;
    name: string;
};

export type IKanban = {
    tasks: Record<UniqueIdentifier, IKanbanTask[]>;
    columns: IKanbanColumn[];
};