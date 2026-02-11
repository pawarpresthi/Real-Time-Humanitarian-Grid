# Real Time Humanitarian Grid(Live)

**Suraksha Signal** connects victims, NGOs, and volunteers in real-time during disasters.

## Features
- **Multilingual Support**: Select from  regional languages.
- **Victim Request Portal**: Minimalistic form to request food, medicine, or shelter. Auto-geolocation.
- **NGO Command Center**: Dashboard to match requests with resources (Green pins) using a map interface.
- **Smart Prioritization**: ML-simulated urgency scoring (Medical > Food > Shelter).

## Tech Stack
- **Frontend**: Next.js 16 (React) with Vanilla CSS Modules.
- **Backend API**: Next.js API Routes (Node.js).
- **Data**: MongoDB database 

## How to Run

1. **Install Dependencies** (if not already done):
   ```bash
   cd web-app
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Application**:
   - Go to https://suraksha-signal-seconds-save-life-g.vercel.app/

## Workflow

1. **User (Victim)**:
   - Open home page.
   - Select Language (e.g., Hindi).
   - Click **"I Need Help"**.
   - Fill the form (Name, Needs: Medical, Location). Click **"Send Help Now"**.

2. **NGO / Volunteer**:
   - See the new Red Pin on the map.
   - Click the pin -> Click **"Match Resource"**.
   - Confirm Delivery -> Earn **Impact Points**.

3. **Public Display**:
   - View flashing critical alerts impacting the community.

## Troubleshooting
- If `npm install` fails, ensure you have internet access and Node.js installed.
- Reset by restarting the server.
