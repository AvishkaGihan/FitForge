import { Pinecone } from "@pinecone-database/pinecone";
import { logger } from "../utils/logger";
import { Exercise } from "../types/index.js";

export class PineconeService {
  private client: Pinecone | null = null;
  private indexName: string;

  constructor() {
    this.indexName = process.env.PINECONE_INDEX_NAME || "fitforge-exercises";

    if (process.env.PINECONE_API_KEY) {
      this.initializeClient();
    } else {
      logger.warn("Pinecone API key not configured - vector search disabled");
    }
  }

  private async initializeClient() {
    try {
      this.client = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
      });
      logger.info("Pinecone client initialized");
    } catch (error) {
      logger.error("Failed to initialize Pinecone:", error);
    }
  }

  async searchSimilarExercises(
    query: string,
    topK: number = 5,
    filters?: Record<string, string | number | boolean>
  ) {
    if (!this.client) {
      logger.warn("Pinecone not configured, using fallback search");
      return [];
    }

    try {
      const index = this.client.index(this.indexName);

      // In production, you would generate embeddings for the query
      // For now, this is a placeholder
      const queryEmbedding = await this.generateEmbedding(query);

      const results = await index.query({
        vector: queryEmbedding,
        topK,
        filter: filters,
        includeMetadata: true,
      });

      return results.matches || [];
    } catch (error) {
      logger.error("Pinecone search error:", error);
      return [];
    }
  }

  private async generateEmbedding(_text: string): Promise<number[]> {
    // Placeholder - in production, use OpenAI embeddings or similar
    // For now, return a dummy vector
    return Array(1536)
      .fill(0)
      .map(() => Math.random());
  }

  async upsertExercise(exercise: Exercise) {
    if (!this.client) return;

    try {
      const index = this.client.index(this.indexName);
      const embedding = await this.generateEmbedding(
        `${exercise.name} ${exercise.description} ${exercise.muscle_groups.join(" ")}`
      );

      await index.upsert([
        {
          id: exercise.id,
          values: embedding,
          metadata: {
            name: exercise.name,
            muscle_groups: exercise.muscle_groups,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
          },
        },
      ]);

      // cspell:ignore upserted
      logger.info(`Exercise ${exercise.id} upserted to Pinecone`);
    } catch (error) {
      logger.error("Pinecone upsert error:", error);
    }
  }
}
