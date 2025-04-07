/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { FieldDefinition } from "@/types/schema";
import { api } from "./api/main";
import styles from "./component.module.css";

interface CollectionItem {
  _id: string;
  [key: string]: any;
}

interface CollectionManagerProps {
  collectionName: string;
}

const CollectionManager = ({ collectionName }: CollectionManagerProps) => {
  const [data, setData] = useState<CollectionItem[]>([]);
  const [schema, setSchema] = useState<FieldDefinition[]>([]);
  const [newItem, setNewItem] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schemaRes, dataRes] = await Promise.all([
          api.get(`/schema/fetch?collectionName=${collectionName}`),
          api.get(`/crud/?collectionName=${collectionName}`),
        ]);

        setSchema(schemaRes.data);
        setData(dataRes.data);
        setNewItem(createEmptyItem(schemaRes.data));
      } catch (error) {
        console.log(error);
        setError("Failed to load collection data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  const createEmptyItem = (fields: FieldDefinition[]) => {
    return fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as Record<string, any>);
  };

  const handleCreate = async () => {
    try {
      const response = await api.post(
        `/crud/?collectionName=${collectionName}`,
        newItem
      );
      setData([...data, response.data]);
      setNewItem(createEmptyItem(schema));
    } catch (error) {
      console.log(error);
      setError("Failed to create item");
    }
  };

  const handleUpdate = async (id: string, updatedData: Record<string, any>) => {
    try {
      await api.put(`/crud/?collectionName=${collectionName}`, {
        updatedData,
        _id: id,
      });
      setData(
        data.map((item) =>
          item._id === id ? { ...item, ...updatedData } : item
        )
      );
    } catch (error) {
      console.log(error);
      setError("Failed to update item");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/crud/?collectionName=${collectionName}`, {
        data: { _id: id },
      });
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
      setError("Failed to delete item");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.collectionContainer}>
      <div className={styles.createSection}>
        <h2>Create New Item</h2>
        <div className={styles.formGrid}>
          {schema.map((field) => (
            <input
              key={field.name}
              type={field.type === "number" ? "number" : "text"}
              placeholder={field.name}
              value={newItem[field.name] || ""}
              onChange={(e) =>
                setNewItem({ ...newItem, [field.name]: e.target.value })
              }
              className={styles.formInput}
            />
          ))}
        </div>
        <button onClick={handleCreate} className={styles.createButton}>
          Create
        </button>
      </div>
      {data.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                {schema.map((field) => (
                  <th key={field.name}>{field.name}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id}>
                  {schema.map((field) => (
                    <td key={field.name}>{item[field.name]}</td>
                  ))}
                  <td className={styles.actionCell}>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        const {
                          _id,
                          createdAt,
                          updatedAt,
                          __v,
                          ...editableItem
                        } = item;
                        const updatedData = prompt(
                          "Enter updated data (JSON):",
                          JSON.stringify(editableItem)
                        );
                        if (updatedData) {
                          handleUpdate(item._id, JSON.parse(updatedData));
                        }
                      }}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default CollectionManager;
