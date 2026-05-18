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
        assignedTo: ts.assignedTo ? ts.assignedTo.split(',') : [],
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

    // Join assignedTo array into a comma-separated string to store in DB
    const assigneeString = Array.isArray(assignedTo) ? assignedTo.join(',') : (assignedTo ?? '');

    const updated = await db.taskState.upsert({
      where: { id },
      update: {
        assignedTo: assigneeString,
        status: status ?? 'À faire',
      },
      create: {
        id,
        assignedTo: assigneeString,
        status: status ?? 'À faire',
      },
    });

    return NextResponse.json({ success: true, task: updated });
  } catch (error) {
    console.error('Error updating task state:', error);
    return NextResponse.json({ error: 'Failed to update task state' }, { status: 500 });
  }
}
