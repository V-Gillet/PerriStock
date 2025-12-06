import { useState } from "react";
import { databaseService, DMCThread } from "../services/database.service";

export function useDMCThreads() {
  const [dmcThreads, setDMCThreads] = useState<DMCThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDMCThreads = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!query.trim()) {
        setDMCThreads([]);
        return;
      }

      const results = await databaseService.searchDMCThreads(query);
      setDMCThreads(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error searching DMC threads:", err);
      setDMCThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByColor = async (
    r: number,
    g: number,
    b: number,
    limit: number = 10
  ) => {
    try {
      setLoading(true);
      setError(null);

      const results = await databaseService.searchDMCThreadsByColor(
        r,
        g,
        b,
        limit
      );
      setDMCThreads(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error searching DMC threads by color:", err);
      setDMCThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const getDMCThreadById = async (id: number): Promise<DMCThread | null> => {
    try {
      return await databaseService.getDMCThreadById(id);
    } catch (err) {
      console.error("Error getting DMC thread by id:", err);
      return null;
    }
  };

  const clearResults = () => {
    setDMCThreads([]);
    setError(null);
  };

  return {
    dmcThreads,
    loading,
    error,
    searchDMCThreads,
    searchByColor,
    getDMCThreadById,
    clearResults,
  };
}
