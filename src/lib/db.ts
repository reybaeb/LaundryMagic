import { openDB, DBSchema } from 'idb';

interface LaundryMagicDB extends DBSchema {
  images: {
    key: string;
    value: {
      id: string;
      fileName: string;
      originalBlob: Blob;
      processedBlob: Blob | null;
      createdAt: number;
    };
    indexes: { 'by-date': number };
  };
}

const DB_NAME = 'laundry-magic-db';
const STORE_NAME = 'images';

export const db = {
  async getDB() {
    return openDB<LaundryMagicDB>(DB_NAME, 1, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('by-date', 'createdAt');
      },
    });
  },

  async getAllImages() {
    const db = await this.getDB();
    return db.getAllFromIndex(STORE_NAME, 'by-date');
  },

  async addImage(image: { id: string; fileName: string; originalBlob: Blob; createdAt: number }) {
    const db = await this.getDB();
    return db.put(STORE_NAME, {
      ...image,
      processedBlob: null,
    });
  },

  async updateProcessedImage(id: string, processedBlob: Blob) {
    const db = await this.getDB();
    const item = await db.get(STORE_NAME, id);
    if (item) {
      item.processedBlob = processedBlob;
      await db.put(STORE_NAME, item);
    }
  },

  async deleteImage(id: string) {
    const db = await this.getDB();
    await db.delete(STORE_NAME, id);
  },
};
