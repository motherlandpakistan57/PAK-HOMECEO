# PAK-HOMECEO — Production Deployment Guide

## 1. Cloud Run / Docker Deployment

The application is built as a production-grade single-page application (SPA) running on Vite with TypeScript.

### Building Static Assets
```bash
npm run build
```
This produces an optimized, minified distribution directory in `/dist`.

### Dockerfile
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. Vercel / Netlify SPA Routing

For SPA routing on static hosting providers, configure rewrites so all route paths resolve to `index.html`:

### `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### `_redirects` (Netlify)
```text
/*    /index.html   200
```
