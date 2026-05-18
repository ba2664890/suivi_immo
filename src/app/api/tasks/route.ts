import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const taskStates = await db.taskState.findMany();
    // Return them in an object: taskId -> StoredTask format
    const tasksMap: Record<string, { id: string; assignedTo: string[]; status: any }> = {};
    
    taskStates.forEach(ts => {
      tasksMap[ts.id] = {
        id: ts.id,
        assignedTo: ts.assignedTo ? [ts.assignedTo] : [],
        status: ts.status,
      };
    });
    
    return NextResponse.json({ tasks: tasksMap });
  } catch (error) {
    console.error('Error fetching task states:', error);
    return NextResponse.json({ error: 'Failed to fetch task states' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, assignedTo, status } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing task id' }, { status: 400 });
    }

    // Since we only allow 1 assignee max, assignedTo in DB is stored as a string.
    // If request sent assignedTo as an array, extract the first element or empty string.
    const assigneeId = Array.isArray(assignedTo) ? (assignedTo[0] ?? '') : (assignedTo ?? '');

    const updated = await db.taskState.upsert({
      where: { id },
      update: {
        assignedTo: assigneeId,
        status: status ?? 'À faire',
      },
      create: {
        id,
        assignedTo: assigneeId,
        status: status ?? 'À faire',
      },
    });

    return NextResponse.json({ success: true, task: updated });
  } catch (error) {
    console.error('Error updating task state:', error);
    return NextResponse.json({ error: 'Failed to update task state' }, { status: 500 });
  }
}
