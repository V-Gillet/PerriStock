import { useState, useEffect } from "react";
import { databaseService, StockThread } from "../services/database.service";

export function useThreads() {
  const [threads, setThreads] = useState<StockThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      await databaseService.initDatabase();
      const data = await databaseService.getStockThreads();
      setThreads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error loading stock threads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const addThread = async (
    dmcThreadId: number,
    quantity: number = 1,
    notes?: string
  ) => {
    try {
      const newThread = await databaseService.addStockThread(
        dmcThreadId,
        quantity,
        notes
      );
      setThreads((prev) => [newThread, ...prev]);
      return newThread;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  const updateThread = async (
    id: number,
    updates: { quantity?: number; notes?: string }
  ) => {
    try {
      const updatedThread = await databaseService.updateStockThread(
        id,
        updates
      );
      setThreads((prev) => prev.map((t) => (t.id === id ? updatedThread : t)));
      return updatedThread;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  const deleteThread = async (id: number) => {
    try {
      await databaseService.deleteStockThread(id);
      setThreads((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    }
  };

  const searchThreads = async (query: string) => {
    try {
      if (!query.trim()) {
        const data = await databaseService.getStockThreads();
        setThreads(data);
        return;
      }
      const results = await databaseService.searchStockThreads(query);
      setThreads(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error searching stock threads:", err);
    }
  };

  return {
    threads,
    loading,
    error,
    addThread,
    updateThread,
    deleteThread,
    searchThreads,
    refreshThreads: loadThreads,
  };
}
