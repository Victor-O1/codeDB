"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Star, Pencil, Trash2, Plus } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import supabase_client from "@/lib/supabase-client";
import { addCode, deleteCode, editCode } from "@/lib/actions";

// 🎨 Language colors
const langColors = {
  javascript: "bg-yellow-200 text-yellow-800",
  typescript: "bg-blue-200 text-blue-800",
  python: "bg-blue-300 text-blue-900",
  sql: "bg-purple-200 text-purple-800",
  java: "bg-red-200 text-red-800",
  c: "bg-gray-300 text-gray-800",
  cpp: "bg-indigo-200 text-indigo-800",
  go: "bg-teal-200 text-teal-800",
  rust: "bg-orange-200 text-orange-800",
};

export default function CodeSnippetList({ snippets: snip }) {
  const [snippets, setSnippets] = useState(snip || []);
  const [filterLang, setFilterLang] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [showForm, setShowForm] = useState(false);
  const [editSnippet, setEditSnippet] = useState(null);

  console.log("SNIPPETS AND SNIP", snippets);
  useEffect(() => {
    setSnippets(snip || []); // update when parent prop changes
  }, [snip]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const handleAdd = () => {
    setEditSnippet(null);
    setShowForm(true);
  };

  const handleEdit = (snippet) => {
    setEditSnippet(snippet);
    setShowForm(true);
  };

  const handleDelete = (snippet) => {
    console.log("Deleting snippet:", snippet);
    setSnippets(snippets.filter((s) => s.id !== snippet.id));
    deleteCode(snippet.id);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.tags = data.tags.split(",").map((t) => t.trim());
    console.log(data);

    if (editSnippet) {
      console.log("Editing snippet", editSnippet.id);
      setSnippets(
        snippets.map((s) => (s.id === editSnippet.id ? { ...s, ...data } : s))
      );
      setShowForm(false);
      await editCode(editSnippet.id, data);
    } else {
      console.log("Adding snippet");
      setSnippets((prev) => [...prev, data]);
      setShowForm(false);
      await addCode(data);
    }
  };

  const filteredSnippets = snippets
    .filter((s) =>
      filterLang === "all" ? true : s.programming_language === filterLang
    )
    .filter((s) => {
      const term = search.toLowerCase();
      return (
        (s.title && s.title.toLowerCase().includes(term)) ||
        s.description.toLowerCase().includes(term) ||
        s.tags.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "language")
        return a.programming_language.localeCompare(b.programming_language);
      return 0;
    });

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto relative">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <Input
          placeholder="Search by title, description, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />

        <div className="flex gap-4 items-center">
          <Select
            onValueChange={(val) => setFilterLang(val)}
            defaultValue="all"
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {[...new Set(snippets.map((s) => s.programming_language))]
                .sort()
                .map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => setSortBy(val)} defaultValue="rating">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="language">Language</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Snippets */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSnippets.map((snippet, idx) => {
          const lang = snippet.programming_language?.toLowerCase();
          const badgeClass = langColors[lang] || "bg-gray-200 text-gray-800";

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div className="flex flex-col">
                      {snippet.title && (
                        <span className="text-lg font-semibold">
                          {snippet.title}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {snippet.description}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-yellow-500" />{" "}
                      {snippet.rating}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Language Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide ${badgeClass}`}
                    >
                      {snippet.programming_language}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(snippet)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this snippet?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(snippet)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Code Block */}
                  <SyntaxHighlighter
                    language={lang}
                    style={oneDark}
                    wrapLines={true}
                    customStyle={{ borderRadius: "0.75rem", padding: "1rem" }}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>

                  {/* Tags + Copy */}
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-2">
                      {snippet.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(snippet.code)}
                      className="flex gap-1"
                    >
                      <Copy className="h-4 w-4" /> Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Add Button */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-xl"
            onClick={handleAdd}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editSnippet ? "Edit Snippet" : "Add New Snippet"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Title"
              defaultValue={editSnippet?.title || ""}
              required
            />
            <Input
              name="description"
              placeholder="Description"
              defaultValue={editSnippet?.description || ""}
              required
            />
            <Input
              name="programming_language"
              placeholder="Programming Language"
              defaultValue={editSnippet?.programming_language || ""}
              required
            />
            <Input
              name="tags"
              placeholder="Tags (comma separated)"
              defaultValue={editSnippet?.tags || ""}
            />
            <Input
              name="rating"
              type="number"
              placeholder="Rating"
              defaultValue={editSnippet?.rating || ""}
            />
            <Textarea
              name="code"
              placeholder="Write your code here..."
              rows={6}
              defaultValue={editSnippet?.code || ""}
              required
            />
            <Button type="submit" className="w-full">
              {editSnippet ? "Save Changes" : "Add Snippet"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
