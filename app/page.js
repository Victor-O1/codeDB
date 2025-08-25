"use client";

import CodeSnippetList from "@/components/code_snippet_list";
import Header from "@/components/Header";
import useAuth from "@/hooks/useAuth";
import { getCode } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function HomePage() {

  const { user, loading } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const snippetsFunction = async () => {
      const snippets = await getCode();
      setSnippets(snippets);
    }
    snippetsFunction();
  }, [])

  if (!loading && user) {
    router.push("/dashboard");
    return null;
  }


  return (<><Header /><CodeSnippetList snippets={snippets} /></>);

}
