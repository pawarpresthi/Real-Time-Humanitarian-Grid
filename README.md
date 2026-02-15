# Real Time Humanitarian Grid(Live)

 **Suraksha Signal** is a disaster relief coordination platform designed to connect victims, volunteers, and responders in real time.

 **Incident Dashboard**

<img width="1906" height="1019" alt="Screenshot 2026-02-15 223125" src="https://github.com/user-attachments/assets/73a88a22-1e82-4930-8667-ad51ff58ac17" />

<img width="1909" height="1021" alt="Screenshot 2026-02-15 223215" src="https://github.com/user-attachments/assets/5a66aee0-d975-4742-aa73-ab0177d18243" />

<img width="1917" height="1016" alt="Screenshot 2026-02-15 224002" src="https://github.com/user-attachments/assets/d84d0683-8558-4497-b66b-545fd2d90322" />

<img width="1912" height="1000" alt="Screenshot 2026-02-15 223249" src="https://github.com/user-attachments/assets/eb7dbf3a-008e-4b7d-befc-2400a2933460" />

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
  
🎯 **Vision**

Suraksha Signal is more than a project—it’s a social impact platform. By blending technology with inclusivity, it aims to ensure that no voice goes unheard in times of crisis.

🤝 **Contributing**

 We welcome contributions!

- Fork the repo
- Create a feature branch
- Submit a pull request

🙏 **Acknowledgements**

- Shatakshi Verma  – for ideation and support
- Open-source communities – React, Node.js, MongoDB
- Volunteers & responders – whose courage motivates this project

📜 **License**
MIT License – free to use, modify, and distribute.

## Troubleshooting
- If `npm install` fails, ensure you have internet access and Node.js installed.
- Reset by restarting the server.
