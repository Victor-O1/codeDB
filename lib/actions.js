// lib/actions.ts
"use server"

import supabase_client from "./supabase-client"



// Create
export async function addCode(snippet) {
    const { data, error } = await supabase_client.from("CodeSnippet").insert(snippet)
    if (error) {
        console.error("Error adding snippet:", error)
        throw error
    }
    console.log("Snippet added successfully")
    return data
}

// Read
export async function getCode() {
    const { data, error } = await supabase_client
        .from("CodeSnippet")
        .select("*")
        .order("createdAt", { ascending: false })

    if (error) {
        console.error("Error fetching snippets:", error)
        return []
    }
    return data
}

// Update
export async function editCode(id, snippet) {
    const { data, error } = await supabase_client
        .from("CodeSnippet")
        .update(snippet)
        .eq("id", id)

    if (error) {
        console.error("Error updating snippet:", error)
        return null
    }
    console.log("Snippet updated successfully")
    return data
}

// Delete
export async function deleteCode(id) {
    const { data, error } = await supabase_client
        .from("CodeSnippet")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting snippet:", error)
        return null
    }
    console.log("Snippet deleted successfully")
    return data
}
