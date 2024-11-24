import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import db from '@/db/db'
import { projectsTable } from '@/db/schema'

export async function GET() {
  try {
    const projects = await db
      .select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.id))

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}