'use server'

import { desc } from 'drizzle-orm'
import db from '@/db/db'
import { projectsTable } from '@/db/schema'

export async function getProjects() {
  try {
    const projects = await db
      .select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.id))
    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw new Error('Failed to fetch projects')
  }
}