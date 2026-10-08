<div align="center">

</div>



This contains everything you need to run your app locally.



## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`

2. Run the app:
   `npm run dev`

## PostgreSQL and Express API

1. Install PostgreSQL locally or create an AWS RDS PostgreSQL instance. Copy `.env.example` to `.env` and set `DATABASE_URL` and a long random `JWT_SECRET`. `CLIENT_ORIGIN` accepts comma-separated origins for Vite on ports 3000 and 3001. Keep `.env` out of source control.
2. Enable the Google Maps Geocoding API and set `GOOGLE_MAPS_API_KEY` in `.env`. The key is used by Express and must not use a `VITE_` prefix.
3. Create the database named in `DATABASE_URL`, then run:

   ```powershell
   npm run db:migrate
   ```

   This creates the relational tables/indexes and inserts the Sri Lankan hospital catalog and safe sample profiles. The supplied sample accounts have random, unusable passwords; create accounts through registration.

   The catalog includes hospital labels from the [Kaggle Hospital Records dataset](https://www.kaggle.com/datasets/mrnize/hospital-records/data) as searchable aliases. The dataset describes simulated admissions; patient admission records are not imported. The dataset's "Kurunegala Base Hospital" label is shown as an alias for the catalog's Teaching Hospital Kurunegala entry. Its coordinates are from [OpenStreetMap](https://www.openstreetmap.org/copyright). Rerun `npm run db:migrate` on an existing database to add the hospital.

   The catalog also includes 371 named, geocoded hospital records from `sri_lanka_hospitals.csv`. Districts were assigned using OpenStreetMap-derived Sri Lankan district boundaries distributed by [geoBoundaries](https://www.geoboundaries.org/). Records clearly tagged as pharmacies, laboratories, dental practices, and other non-hospital facilities were excluded; unknown operator types remain marked as unknown. OpenStreetMap data is © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) and available under the Open Database License (ODbL).

4. Create the first admin from a PowerShell terminal session. Use a unique password of at least 12 characters and do not commit or paste it into a tracked file:

   ```powershell
   $env:ADMIN_EMAIL = 'admin@example.com'
   $env:ADMIN_NAME = 'Platform Administrator'
   $env:ADMIN_PASSWORD = 'use-a-unique-secret-here'
   npm run db:create-admin
   Remove-Item Env:ADMIN_EMAIL, Env:ADMIN_NAME, Env:ADMIN_PASSWORD
   ```

5. Run `npm run server` in one terminal and `npm run dev` in another. Check `http://localhost:5000/api/health`; a healthy response includes `"database":"connected"`.

The frontend uses React Router and a custom date calendar. It sends search, profile, availability, review, inquiry, and hospital operations to the Express API. The API hashes passwords with bcrypt, signs JWTs, uses parameterized PostgreSQL queries, restricts CORS to `CLIENT_ORIGIN`, and applies a 100-request-per-minute API limit.

## AWS Deployment

Use EC2 (or another Node.js host) for Express and private RDS PostgreSQL for persistence. Allow inbound port 5432 to RDS only from the EC2 security group; do not expose the database publicly. Set `DATABASE_SSL=true`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`, `GOOGLE_MAPS_API_KEY`, and `VITE_API_URL` as deployment secrets/configuration. Put the web/API endpoints behind HTTPS (for example, an Application Load Balancer with an ACM certificate), and restrict the Google key to the Geocoding API and the server's egress IP. Run `npm run db:migrate` as a deployment step before starting the API.

No payment integration is included.
