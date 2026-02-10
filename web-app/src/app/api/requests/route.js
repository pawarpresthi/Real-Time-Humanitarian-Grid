import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Request } from '@/lib/models';
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
    try {
        await connectDB();
        const requests = await Request.find({}).sort({ timestamp: -1 });
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // 1. Crowd-Source Verification (Duplicate Detection within 200m)
        if (body.coords) {
            const activeRequests = await Request.find({ status: { $ne: 'Completed' } });
            for (const existing of activeRequests) {
                if (existing.coords) {
                    const dist = calculateDistance(
                        body.coords.lat, body.coords.lng,
                        existing.coords.lat, existing.coords.lng
                    );

                    if (dist < 200) {
                        existing.reportCount = (existing.reportCount || 1) + 1;
                        existing.urgency = existing.reportCount > 3 ? 'Critical' : 'High';
                        await existing.save();
                        return NextResponse.json({
                            ...existing.toObject(),
                            message: 'Existing alert escalated due to crowd verification.'
                        }, { status: 200 });
                    }
                }
            }
        }

        const newRequestData = {
            ...body,
            reportCount: 1,
            status: 'Pending',
            timestamp: new Date()
        };

        // 2. AI/NLP Layer for Prioritization
        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `Analyze this disaster request:
                Needs: ${body.needs ? body.needs.join(', ') : 'General'}
                Location: ${body.location}
                Categorize priority as "Critical", "High", "Medium", or "Standard" based on life-threat levels (Injuries/Medical > Trapped/Shelter > Food/Water). 
                Provide reasoning in one short sentence.
                Format response as JSON: {"priority": "Critial|High|Medium|Standard", "reason": "..."}`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const aiData = JSON.parse(response.text().replace(/```json|```/g, '').trim());
                newRequestData.urgency = aiData.priority;
                newRequestData.aiReason = aiData.reason;
            } catch (err) {
                console.error("AI Prioritization failed", err);
                // Fallback rules
                if (body.needs && body.needs.includes('Medical')) newRequestData.urgency = 'Critical';
                else if (body.needs && body.needs.includes('Shelter')) newRequestData.urgency = 'High';
                else newRequestData.urgency = 'Standard';
            }
        } else {
            // Fallback Heuristic
            const needsText = (body.needs ? body.needs.join(' ') : '').toLowerCase();
            if (needsText.includes('medical')) newRequestData.urgency = 'Critical';
            else if (needsText.includes('shelter')) newRequestData.urgency = 'High';
            else if (needsText.includes('food')) newRequestData.urgency = 'Medium';
            else newRequestData.urgency = 'Standard';
        }

        // 3. Auto-translation for NGOs
        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `Translate to English for NGO coordination:
                Location: ${body.location}
                Needs: ${body.needs ? body.needs.join(', ') : 'None'}
                Format: {"translatedLocation": "...", "translatedNeeds": "..."}`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const translations = JSON.parse(response.text().replace(/```json|```/g, '').trim());

                newRequestData.location_translated = translations.translatedLocation;
                newRequestData.needs_translated = translations.translatedNeeds;
            } catch (err) {
                newRequestData.location_translated = body.location;
                newRequestData.needs_translated = body.needs ? body.needs.join(', ') : '';
            }
        } else {
            newRequestData.location_translated = body.location;
            newRequestData.needs_translated = body.needs ? body.needs.join(', ') : '';
        }

        const newRequest = await Request.create(newRequestData);
        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error("Request POST error:", error);
        return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }
}
