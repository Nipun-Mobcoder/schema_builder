"use client";
import { useState } from "react";
import styles from "./component.module.css";

type FieldDefinition = {
  name: string;
  type: "string" | "number" | "boolean" | "date";
};

export default function SchemaBuilder() {
  const [collectionName, setCollectionName] = useState("");
  const [fields, setFields] = useState<FieldDefinition[]>([]);

  const handleSubmit = async () => {
    if (!collectionName || fields.some((f) => !f.name)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/schema/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectionName, fields }),
      });

      if (!response.ok) throw new Error("Failed to create schema");
      alert("Schema created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating schema");
    }
  };

  const updateField = (
    index: number,
    key: keyof FieldDefinition,
    value: string
  ) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Schema Builder</h1>

      <div className={styles.formGroup}>
        <label>Collection Name:</label>
        <input
          type="text"
          placeholder="e.g. 'products'"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldsContainer}>
        {fields.map((field, index) => (
          <div key={index} className={styles.fieldRow}>
            <input
              type="text"
              placeholder="Field name"
              value={field.name}
              onChange={(e) => updateField(index, "name", e.target.value)}
              className={styles.input}
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, "type", e.target.value)}
              className={styles.select}
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={() => setFields(fields.filter((_, i) => i !== index))}
              className={styles.removeButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={() => setFields([...fields, { name: "", type: "string" }])}
          className={styles.addButton}
        >
          Add Field
        </button>

        <button onClick={handleSubmit} className={styles.submitButton}>
          Create Schema
        </button>
      </div>
    </div>
  );
}
