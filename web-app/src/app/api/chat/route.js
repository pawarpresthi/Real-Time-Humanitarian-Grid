
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req) {
    try {
        const { message } = await req.json();

        if (!apiKey) {
            // Robust Heuristic Fallback ("Emergency Brain")
            const lowMsg = message.toLowerCase();

            if (lowMsg.includes('wound') || lowMsg.includes('cut') || lowMsg.includes('bleed')) {
                return NextResponse.json({ response: "For wounds: Apply firm pressure with a clean cloth to stop bleeding. Clean the area with water and keep it elevated. If the wound is deep, please call 108 immediately." });
            } else if (lowMsg.includes('flood')) {
                return NextResponse.json({ response: "In case of floods: Move to higher ground immediately. Avoid walking or driving through floodwater. Switch off your main power supply to prevent electric shocks." });
            } else if (lowMsg.includes('earthquake')) {
                return NextResponse.json({ response: "During an earthquake: Drop to your hands and knees. Cover your head and neck. Hold on to something sturdy until the shaking stops. Stay away from glass." });
            } else if (lowMsg.includes('fire')) {
                return NextResponse.json({ response: "For fire emergencies: Stay low to avoid smoke. Call 101. If your clothes catch fire, Stop, Drop, and Roll. Use the nearest safe exit." });
            } else if (lowMsg.includes('thank') || lowMsg.includes('nice') || lowMsg.includes('bye')) {
                return NextResponse.json({ response: "You're welcome! Stay safe. I'm here if you have any more emergency or safety questions." });
            } else if (lowMsg.includes('help') || lowMsg.includes('stuck')) {
                return NextResponse.json({ response: "If you need immediate rescue, use the 'I Need Help' button on our homepage. It will send your live location and needs to the nearest NGOs and volunteers." });
            } else {
                return NextResponse.json({ response: "I am your Suraksha Assistant. I can provide safety tips for floods, earthquakes, fires, and basic first aid. How can I assist you in staying safe today?" });
            }
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are 'Suraksha AI', a high-stakes disaster response intelligence system. Your objective is to save lives by providing instant, localized emergency protocols for India. \n\nCORE PROTOCOLS:\n1. EMERGENCY CONTACTS: Always prioritize 112 (National Disaster), 108 (Ambulance), and 100 (Police).\n2. FIRST AID: Provide step-by-step, calm instructions for wounds, burns, or fractures.\n3. DISASTER ADVICE: Give specific drills for Floods (Vertical Evacuation), Earthquakes (Drop/Cover/Hold), and Fires (Stay Low).\n4. APP GUIDANCE: Direct users to the 'I Need Help' button for rescue requests.\n\nSTYLE: Professional, urgent, zero-fluff, calm, and humanitarian. Use formatting like bold text for critical steps.",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 256,
            },
        });

        const chat = model.startChat({ history: [] });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return NextResponse.json({ response: response.text() });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({
            response: "I am having trouble connecting to the neural engine. For immediate help: Apply pressure to any wounds, stay on high ground if flooding, and call 112.",
            error: error.message
        });
    }
}
