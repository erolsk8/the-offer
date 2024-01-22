const path = require('path');
const fs = require('fs');
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('@fastify/static');

const distPath = path.join(__dirname, '../dist');

if (!fs.existsSync(distPath)) {
  console.error("Error: 'dist' folder does not exist. Please run 'npm run build' first.");
  process.exit(1);
}

// Serve static files from the 'dist' directory
fastify.register(fastifyStatic, {
  root: distPath,
});

const port = process.env.PORT ?? 8002;

(async () => {
  try {
    await fastify.listen({ port });
    fastify.log.info(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
