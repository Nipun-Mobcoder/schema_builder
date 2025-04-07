"use client";
import { useEffect, useState } from "react";
import SchemaBuilder from "@/components/SchemaBuilder";
import SchemaService from "@/components/api/main";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadSchemas = async () => {
      try {
        const response = await SchemaService.fetchAllSchemas();
        setApiData(response.data);
      } catch (error) {
        console.error("Failed to load schemas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSchemas();
  }, []);

  return (
    <div>
      {!loading ? (
        <main style={{ display: "flex", height: "100vh" }}>
          <Sidebar modelData={apiData} />
          <SchemaBuilder />
        </main>
      ) : (
        <main>Loading...</main>
      )}
    </div>
  );
}
