// lib/actions.js
"use server";

import prisma_client from "@/app/api/prisma-client";
import supabase_client from "@/app/api/supabase-client";

export async function addCode(snippet) {  // C
    const { error, data } = await supabase_client.from("CodeSnippet").insert(snippet);
    if (error) console.error("Error adding snippet:", error);

    else console.log("Snippet added successfully");
}

export async function getCode() {  // R
    //     const { error, data } = await supabase_client.from("CodeSnippet").select("*").order('createdAt', { ascending: false });
    //     if (error) {
    //         console.error("Error fetching snippets:", error);
    //         return [];
    //     }
    //     return data;
    const snippets = await prisma_client.codeSnippet.findMany()
    return snippets
}


export async function editCode(id, snippet) {  // U

    // console.log("Editing snippet", snippet);
    // const { error, data } = await supabase_client.from("CodeSnippet").update(snippet).eq('id', id);
    // if (error) {
    //     console.error("Error updating snippet:", error);
    //     return null;
    // }
    const result = await prisma_client.codeSnippet.update({
        where: { id },
        data: snippet,
    });
    console.log("Snippet updated successfully");
    return result;
}
export async function deleteCode(id) { // D
    const { error, data } = await supabase_client.from("CodeSnippet").delete().eq('id', id);
    if (error) {
        console.error("Error deleting snippet:", error);
        return null;
    }
    // return await prisma_client.codeSnippet.delete({
    //     where: { id },
    // });
    console.log("Snippet deleted successfully");
}