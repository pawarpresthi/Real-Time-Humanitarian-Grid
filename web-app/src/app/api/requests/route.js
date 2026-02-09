import { NextResponse } from 'next/server';
import { getRequests, addRequest } from '@/lib/data';
import { GoogleGenerativeAI } from '@google/generative-ai';

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function GET() {
    const requests = getRequests();
    return NextResponse.json(requests);
}

export async function POST(req) {
    const body = await req.json();

    const allRequests = getRequests();
    let duplicateOf = null;

    if (body.coords) {
        for (const existing of allRequests) {
            if (existing.coords && existing.status !== 'Completed') {
                const dist = calculateDistance(
                    body.coords.lat, body.coords.lng,
                    existing.coords.lat, existing.coords.lng
                );

                // If within 200 meters and similar need - it's a crowd report
                if (dist < 200) {
                    existing.reportCount = (existing.reportCount || 1) + 1;
                    existing.urgency = existing.reportCount > 3 ? 'Critical' : 'High';
                    duplicateOf = existing;
                    break;
                }
            }
        }
    }

    if (duplicateOf) {
        return NextResponse.json({ ...duplicateOf, message: 'Existing alert escalated due to crowd verification.' }, { status: 200 });
    }

    const newRequest = addRequest(body);
    newRequest.reportCount = 1;

    // AI/NLP Layer for Prioritization
    if (process.env.GEMINI_API_KEY) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Analyze this disaster request:
            Needs: ${body.needs ? body.needs.join(', ') : 'General'}
            Location: ${body.location}
            Categorize priority as "Critical", "High", "Medium", or "Standard" based on life-threat levels (Injuries/Medical > Trapped/Shelter > Food/Water). 
            Provide reasoning.
            Format response as JSON: {"priority": "...", "reason": "..."}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiData = JSON.parse(response.text().replace(/```json|```/g, '').trim());
            newRequest.urgency = aiData.priority;
            newRequest.aiReason = aiData.reason;
        } catch (err) {
            console.error("AI Prioritization failed", err);
            // Fallback rules
            if (body.needs && body.needs.includes('Medical')) newRequest.urgency = 'Critical';
            else if (body.needs && body.needs.includes('Shelter')) newRequest.urgency = 'High';
            else newRequest.urgency = 'Standard';
        }
    } else {
        // Fallback Heuristic Prioritization (medical > food > shelter)
        const needsText = (body.needs ? body.needs.join(' ') : '').toLowerCase();

        if (needsText.includes('medical') || needsText.includes('doctor') || needsText.includes('blood')) {
            newRequest.urgency = 'Critical';
        } else if (needsText.includes('shelter') || needsText.includes('trapped')) {
            newRequest.urgency = 'High';
        } else if (needsText.includes('food') || needsText.includes('water')) {
            newRequest.urgency = 'Medium';
        } else {
            newRequest.urgency = 'Standard';
        }
    }

    // Auto-translation for NGOs
    if (process.env.GEMINI_API_KEY) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Translate the following disaster request details to English for NGO coordination. 
            Original Language: ${body.language || 'Detect'}
            Location: ${body.location}
            Needs: ${body.needs ? body.needs.join(', ') : 'None'}
            Format response as JSON: {"translatedLocation": "...", "translatedNeeds": "..."}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json|```/g, '').trim();
            const translations = JSON.parse(text);

            newRequest.location_translated = translations.translatedLocation;
            newRequest.needs_translated = translations.translatedNeeds;
        } catch (err) {
            console.error("Translation failed", err);
            newRequest.location_translated = body.location; // Fallback
            newRequest.needs_translated = body.needs ? body.needs.join(', ') : '';
        }
    } else {
        newRequest.location_translated = body.location;
        newRequest.needs_translated = body.needs ? body.needs.join(', ') : '';
    }

    return NextResponse.json(newRequest, { status: 201 });
}
