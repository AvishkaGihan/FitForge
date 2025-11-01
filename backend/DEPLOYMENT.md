# FitForge Backend Deployment Guide

## Prerequisites

- Supabase account and project
- Google Gemini API key
- Vercel account (for deployment)
- GitHub account (for CI/CD)

## Environment Setup

1. **Supabase Setup**
   - Create project at supabase.com
   - Run migrations from `database/migrations/`
   - Run seeds from `database/seeds/`
   - Copy project URL and keys

2. **Google Gemini API**
   - Get API key from ai.google.dev
   - Add to environment variables

3. **Environment Variables**
   ```bash
   # Production
   SUPABASE_URL=your_production_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   GOOGLE_GEMINI_API_KEY=your_gemini_key
   JWT_SECRET=generate_random_32_char_string
   NODE_ENV=production
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

Install Vercel CLI:

```bash
npm i -g vercel
```

Login and link project:

```bash
vercel login
vercel link
```

Add environment variables:

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GOOGLE_GEMINI_API_KEY
vercel env add JWT_SECRET
```

Deploy:

```bash
vercel --prod
```

### Option 2: Docker

Build image:

```bash
docker build -t fitforge-backend .
```

Run container:

```bash
docker run -p 3000:3000 \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_SERVICE_ROLE_KEY=your_key \
  -e GOOGLE_GEMINI_API_KEY=your_key \
  -e JWT_SECRET=your_secret \
  fitforge-backend
```

### Option 3: Traditional VPS

- SSH into server
- Install Node.js 22+
- Clone repository
- Install dependencies: `npm ci --production`
- Build: `npm run build`

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start dist/index.js --name fitforge-backend
pm2 save
pm2 startup
```

## Post-Deployment

### Health Check

```bash
curl https://your-domain.com/api/health
```

### Test Authentication

```bash
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test12345"}'
```

### Monitor Logs

- Vercel: Check dashboard logs
- Docker: `docker logs <container_id>`
- VPS: `pm2 logs fitforge-backend`

## Scaling Considerations

- Use Vercel's auto-scaling for production
- Monitor API usage for Gemini (rate limits)
- Consider caching for frequently accessed data
- Setup monitoring with Sentry or similar

## Troubleshooting

### Database Connection Issues

- Verify Supabase credentials
- Check RLS policies
- Ensure IP whitelist configured

### AI Generation Failures

- Verify Gemini API key
- Check API quota limits
- Review prompt structure

### Performance Issues

- Enable response caching
- Optimize database queries
- Consider CDN for static assets

## Security Checklist

- ✅ Environment variables secured
- ✅ HTTPS enabled
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ Input validation active
- ✅ Logging configured
- ✅ Error tracking setup

## Monitoring

Set up monitoring for:

- API response times
- Error rates
- Database query performance
- AI service usage and costs
- User registration/login rates

## Backup Strategy

- Supabase handles automatic backups
- Export critical data regularly
- Keep environment variables backed up
- Document deployment process
