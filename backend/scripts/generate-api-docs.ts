import fs from "fs";
import path from "path";

interface Route {
  method: string;
  path: string;
  description: string;
  headers?: Record<string, string>;
  body?: Record<string, any>;
  response: Record<string, any>;
}

const routes = {
  authentication: [
    {
      method: "POST",
      path: "/api/auth/register",
      description: "Register a new user",
      body: {
        email: "string (required)",
        password: "string (required, min 8 chars)",
      },
      response: {
        user: { id: "uuid", email: "string" },
        session: { access_token: "string", expires_at: "number" },
      },
    },
    {
      method: "POST",
      path: "/api/auth/login",
      description: "Login existing user",
      body: {
        email: "string (required)",
        password: "string (required)",
      },
      response: {
        user: { id: "uuid", email: "string" },
        session: { access_token: "string" },
      },
    },
  ],
  workouts: [
    {
      method: "POST",
      path: "/api/workouts/generate",
      description: "Generate AI-powered workout",
      headers: {
        Authorization: "Bearer <token>",
      },
      response: {
        id: "uuid",
        name: "string",
        exercises: "array",
        estimated_duration: "number",
      },
    },
  ],
};

const generateRouteMarkdown = (route: Route) => `
### ${route.method} ${route.path}

${route.description}

${
  route.headers
    ? `**Headers:**
\`\`\`
${Object.entries(route.headers)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}
\`\`\`
`
    : ""
}
${
  route.body
    ? `**Request Body:**
\`\`\`json
${JSON.stringify(route.body, null, 2)}
\`\`\`
`
    : ""
}
**Response:**
\`\`\`json
${JSON.stringify(route.response, null, 2)}
\`\`\`
`;

const markdown = `
# FitForge API Documentation

## Authentication Endpoints
${routes.authentication.map(generateRouteMarkdown).join("")}

## Workout Endpoints
${routes.workouts.map(generateRouteMarkdown).join("")}
`;

// Corrected path to write to 'backend/docs/API.md'
fs.writeFileSync(path.join(__dirname, "../docs/API.md"), markdown.trim());

console.log("✅ API documentation generated!");
