import type { APIRoute } from 'astro';
import { loadPortfolio } from '../lib/portfolio';

export const GET: APIRoute = async () => {
  const { projects } = await loadPortfolio();
  return new Response(JSON.stringify({ projects: projects.slice(6) }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
};
