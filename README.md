# Suraksha Signal - Disaster Relief Coordination

**Suraksha Signal** connects victims, NGOs, and volunteers in real-time during disasters.

## Features
- **Multilingual Support**: Select from 14+ regional languages.
- **Victim Request Portal**: Minimalistic form to request food, medicine, or shelter. Auto-geolocation.
- **NGO Command Center**: Dashboard to match requests with resources (Green pins) using a map interface.
- **Screen Mirroring Mode**: High-contrast display for emergency alerts in public spaces.
- **Smart Prioritization**: ML-simulated urgency scoring (Medical > Food > Shelter).

## Tech Stack
- **Frontend**: Next.js 16 (React) with Vanilla CSS Modules.
- **Backend API**: Next.js API Routes (Node.js).
- **Data**: In-memory JSON store (simulated DB).

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
   - Go to [http://localhost:3000](http://localhost:3000)

## Demo Workflow

1. **User (Victim)**:
   - Open home page.
   - Select Language (e.g., Hindi).
   - Click **"I Need Help"**.
   - Fill the form (Name, Needs: Medical, Location). Click **"Send Help Now"**.

2. **NGO / Volunteer**:
   - Open [http://localhost:3000/ngo](http://localhost:3000/ngo).
   - See the new Red Pin on the map.
   - Click the pin -> Click **"Match Resource"**.
   - Confirm Delivery -> Earn **Impact Points**.

3. **Public Display**:
   - Open [http://localhost:3000/mirror](http://localhost:3000/mirror).
   - View flashing critical alerts impacting the community.

## Troubleshooting
- If `npm install` fails, ensure you have internet access and Node.js installed.
- Reset the demo by restarting the server (clears in-memory data).
