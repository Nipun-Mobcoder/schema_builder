"use client";
import SchemaService from "@/components/api/main";
import CollectionManager from "@/components/CollectionManager";
import Sidebar from "@/components/Sidebar";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import styles from "./page.module.css"

export default function Page() {
  const params = useParams();
  const collectionName = params?.collectionName as string;

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

  if (!collectionName || loading) return <div>Loading...</div>;
  return (
    <main style={{ display: "flex", height: "100vh" }}>
      <Sidebar modelData={apiData} />
      <div className={styles.collection}>
        <h1>{collectionName.toUpperCase()} Collection</h1>
        <CollectionManager collectionName={collectionName} />
      </div>
    </main>
  );
}
