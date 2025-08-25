// lib/actions.ts
"use server"

import prisma from "@/lib/prisma"

// Create
export async function addCode(snippet) {
    try {
        const result = await prisma.codeSnippet.create({ data: snippet })
        console.log("Snippet added successfully")
        return result
    } catch (error) {
        console.error("Error adding snippet:", error)
        throw error
    }
}

// Read
export async function getCode() {
    try {
        return await prisma.codeSnippet.findMany({
            orderBy: { createdAt: "desc" },
        })
    } catch (error) {
        console.error("Error fetching snippets:", error)
        return []
    }
}

// Update
export async function editCode(id, snippet) {
    try {
        const result = await prisma.codeSnippet.update({
            where: { id },
            data: snippet,
        })
        console.log("Snippet updated successfully")
        return result
    } catch (error) {
        console.error("Error updating snippet:", error)
        return null
    }
}

// Delete
export async function deleteCode(id) {
    try {
        await prisma.codeSnippet.delete({ where: { id } })
        console.log("Snippet deleted successfully")
        return true
    } catch (error) {
        console.error("Error deleting snippet:", error)
        return false
    }
}
