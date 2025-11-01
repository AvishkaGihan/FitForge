import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:3000";

async function checkHealth() {
  try {
    console.log("🏥 Checking backend health...");

    const response = await axios.get(`${API_URL}/api/health`);

    if (response.status === 200) {
      console.log("✅ Backend is healthy!");
      console.log("Response:", response.data);
      process.exit(0);
    } else {
      console.error("❌ Unexpected status:", response.status);
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Health check failed:", message);
    process.exit(1);
  }
}

checkHealth();
