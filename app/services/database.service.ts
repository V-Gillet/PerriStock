import * as SQLite from "expo-sqlite";
import dmcThreads from "../../data/dmc-threads.json";

export interface DMCThread {
  //double ID in case I make a feature where you can have multiple brands
  id: number;
  dmcId: string;
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
}

export interface StockThread {
  id: number;
  dmcThreadId: number;
  dmcId: string;
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync("perristock.db");

      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        
        -- Table de référence DMC (tous les fils de la marque)
        CREATE TABLE IF NOT EXISTS dmc_threads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          dmcId TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          hex TEXT NOT NULL,
          r INTEGER NOT NULL,
          g INTEGER NOT NULL,
          b INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS stock_threads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          dmcThreadId INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          notes TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (dmcThreadId) REFERENCES dmc_threads(id) ON DELETE CASCADE
        );
        
        CREATE INDEX IF NOT EXISTS idx_dmc_threads_dmcId ON dmc_threads(dmcId);
        CREATE INDEX IF NOT EXISTS idx_dmc_threads_name ON dmc_threads(name);
        CREATE INDEX IF NOT EXISTS idx_stock_threads_dmcThreadId ON stock_threads(dmcThreadId);
      `);

      console.log("Database initialized successfully");

      await this.seedDMCThreads();
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  async seedDMCThreads(): Promise<void> {
    try {
      const count = await this.getDMCThreadCount();

      if (count > 0) {
        console.log("DMC threads already loaded, skipping seed");
        return;
      }

      console.log(`Loading ${dmcThreads.length} DMC threads...`);

      const batchSize = 50;
      for (let i = 0; i < dmcThreads.length; i += batchSize) {
        const batch = dmcThreads.slice(i, i + batchSize);

        await this.db!.execAsync("BEGIN TRANSACTION");

        for (const thread of batch) {
          await this.db!.runAsync(
            `INSERT OR IGNORE INTO dmc_threads (dmcId, name, hex, r, g, b) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [thread.id, thread.name, thread.hex, thread.r, thread.g, thread.b]
          );
        }

        await this.db!.execAsync("COMMIT");
      }

      console.log("DMC threads loaded successfully");
    } catch (error) {
      console.error("Error seeding DMC threads:", error);
      await this.db!.execAsync("ROLLBACK");
      throw error;
    }
  }

  async getAllDMCThreads(): Promise<DMCThread[]> {
    try {
      if (!this.db) await this.initDatabase();

      const threads = await this.db!.getAllAsync<DMCThread>(
        "SELECT * FROM dmc_threads ORDER BY CAST(dmcId AS INTEGER) ASC"
      );

      return threads;
    } catch (error) {
      console.error("Error getting DMC threads:", error);
      return [];
    }
  }

  async searchDMCThreads(query: string): Promise<DMCThread[]> {
    try {
      if (!this.db) await this.initDatabase();

      // Supprimer le # si présent dans la recherche hex
      const cleanQuery = query.replace("#", "");

      const threads = await this.db!.getAllAsync<DMCThread>(
        `SELECT * FROM dmc_threads 
         WHERE name LIKE ? 
         OR dmcId LIKE ? 
         OR hex LIKE ?
         OR REPLACE(hex, '#', '') LIKE ?
         ORDER BY CAST(dmcId AS INTEGER) ASC
         LIMIT 50`,
        [`%${query}%`, `%${query}%`, `%${cleanQuery}%`, `%${cleanQuery}%`]
      );

      return threads;
    } catch (error) {
      console.error("Error searching DMC threads:", error);
      return [];
    }
  }

  async searchDMCThreadsByColor(
    r: number,
    g: number,
    b: number,
    limit: number = 10
  ): Promise<DMCThread[]> {
    try {
      if (!this.db) await this.initDatabase();

      const threads = await this.db!.getAllAsync<DMCThread>(
        `SELECT *, 
         ((r - ?) * (r - ?) + (g - ?) * (g - ?) + (b - ?) * (b - ?)) as distance
         FROM dmc_threads 
         ORDER BY distance ASC 
         LIMIT ?`,
        [r, r, g, g, b, b, limit]
      );

      return threads;
    } catch (error) {
      console.error("Error searching DMC threads by color:", error);
      return [];
    }
  }

  async getDMCThreadById(id: number): Promise<DMCThread | null> {
    try {
      if (!this.db) await this.initDatabase();

      const thread = await this.db!.getFirstAsync<DMCThread>(
        "SELECT * FROM dmc_threads WHERE id = ?",
        [id]
      );

      return thread || null;
    } catch (error) {
      console.error("Error getting DMC thread by id:", error);
      return null;
    }
  }

  async getDMCThreadCount(): Promise<number> {
    try {
      if (!this.db) await this.initDatabase();

      const result = await this.db!.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM dmc_threads"
      );

      return result?.count || 0;
    } catch (error) {
      console.error("Error getting DMC thread count:", error);
      return 0;
    }
  }

  async getStockThreads(): Promise<StockThread[]> {
    try {
      if (!this.db) await this.initDatabase();

      const threads = await this.db!.getAllAsync<StockThread>(
        `SELECT 
          st.id,
          st.dmcThreadId,
          dt.dmcId,
          dt.name,
          dt.hex,
          dt.r,
          dt.g,
          dt.b,
          st.quantity,
          st.notes,
          st.createdAt,
          st.updatedAt
         FROM stock_threads st
         JOIN dmc_threads dt ON st.dmcThreadId = dt.id
         ORDER BY CAST(dt.dmcId AS INTEGER) ASC`
      );

      return threads;
    } catch (error) {
      console.error("Error getting stock threads:", error);
      return [];
    }
  }

  async addStockThread(
    dmcThreadId: number,
    quantity: number = 1,
    notes?: string
  ): Promise<StockThread> {
    try {
      if (!this.db) await this.initDatabase();

      // Vérifier si le fil existe déjà dans le stock
      const existing = await this.db!.getFirstAsync<{ id: number }>(
        "SELECT id FROM stock_threads WHERE dmcThreadId = ?",
        [dmcThreadId]
      );

      if (existing) {
        throw new Error("Ce fil est déjà dans votre stock");
      }

      const now = new Date().toISOString();

      const result = await this.db!.runAsync(
        `INSERT INTO stock_threads (dmcThreadId, quantity, notes, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?)`,
        [dmcThreadId, quantity, notes || null, now, now]
      );

      const newThread = await this.db!.getFirstAsync<StockThread>(
        `SELECT 
          st.id,
          st.dmcThreadId,
          dt.dmcId,
          dt.name,
          dt.hex,
          dt.r,
          dt.g,
          dt.b,
          st.quantity,
          st.notes,
          st.createdAt,
          st.updatedAt
         FROM stock_threads st
         JOIN dmc_threads dt ON st.dmcThreadId = dt.id
         WHERE st.id = ?`,
        [result.lastInsertRowId]
      );

      if (!newThread) {
        throw new Error("Failed to retrieve newly created stock thread");
      }

      return newThread;
    } catch (error) {
      console.error("Error adding stock thread:", error);
      throw error;
    }
  }

  async updateStockThread(
    id: number,
    updates: {
      quantity?: number;
      notes?: string;
    }
  ): Promise<StockThread> {
    try {
      if (!this.db) await this.initDatabase();

      const now = new Date().toISOString();
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.quantity !== undefined) {
        fields.push("quantity = ?");
        values.push(updates.quantity);
      }
      if (updates.notes !== undefined) {
        fields.push("notes = ?");
        values.push(updates.notes || null);
      }

      fields.push("updatedAt = ?");
      values.push(now);
      values.push(id);

      await this.db!.runAsync(
        `UPDATE stock_threads SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

      const updatedThread = await this.db!.getFirstAsync<StockThread>(
        `SELECT 
          st.id,
          st.dmcThreadId,
          dt.dmcId,
          dt.name,
          dt.hex,
          dt.r,
          dt.g,
          dt.b,
          st.quantity,
          st.notes,
          st.createdAt,
          st.updatedAt
         FROM stock_threads st
         JOIN dmc_threads dt ON st.dmcThreadId = dt.id
         WHERE st.id = ?`,
        [id]
      );

      if (!updatedThread) {
        throw new Error("Stock thread not found after update");
      }

      return updatedThread;
    } catch (error) {
      console.error("Error updating stock thread:", error);
      throw error;
    }
  }

  async deleteStockThread(id: number): Promise<void> {
    try {
      if (!this.db) await this.initDatabase();

      await this.db!.runAsync("DELETE FROM stock_threads WHERE id = ?", [id]);
    } catch (error) {
      console.error("Error deleting stock thread:", error);
      throw error;
    }
  }

  async searchStockThreads(query: string): Promise<StockThread[]> {
    try {
      if (!this.db) await this.initDatabase();

      const threads = await this.db!.getAllAsync<StockThread>(
        `SELECT 
          st.id,
          st.dmcThreadId,
          dt.dmcId,
          dt.name,
          dt.hex,
          dt.r,
          dt.g,
          dt.b,
          st.quantity,
          st.notes,
          st.createdAt,
          st.updatedAt
         FROM stock_threads st
         JOIN dmc_threads dt ON st.dmcThreadId = dt.id
         WHERE dt.name LIKE ? OR dt.dmcId LIKE ?
         ORDER BY CAST(dt.dmcId AS INTEGER) ASC`,
        [`%${query}%`, `%${query}%`]
      );

      return threads;
    } catch (error) {
      console.error("Error searching stock threads:", error);
      return [];
    }
  }

  async getStockThreadCount(): Promise<number> {
    try {
      if (!this.db) await this.initDatabase();

      const result = await this.db!.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM stock_threads"
      );

      return result?.count || 0;
    } catch (error) {
      console.error("Error getting stock thread count:", error);
      return 0;
    }
  }

  async clearStock(): Promise<void> {
    try {
      if (!this.db) await this.initDatabase();

      await this.db!.runAsync("DELETE FROM stock_threads");
    } catch (error) {
      console.error("Error clearing stock:", error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
