# Real Time Humanitarian Grid(Live)

 **Suraksha Signal** is a disaster relief coordination platform designed to connect victims, volunteers, and responders in real time.

 **Incident Dashboard**
 
 <img width="1917" height="1016" alt="Screenshot 2026-02-15 224002" src="https://github.com/user-attachments/assets/239027c4-4ca6-4785-b123-ef7e50448fb5" />
 
 <img width="1912" height="1000" alt="Screenshot 2026-02-15 223249" src="https://github.com/user-attachments/assets/624ed51c-3da2-4f17-9b7f-e50839fe143b" />
 
 <img width="1909" height="1021" alt="Screenshot 2026-02-15 223215" src="https://github.com/user-attachments/assets/b2055885-613a-4370-80dd-2eec172a44b9" />
 
 <img width="1906" height="1019" alt="Screenshot 2026-02-15 223125" src="https://github.com/user-attachments/assets/40291484-48f9-42ef-b982-3c61629415c6" />

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
