import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    coords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    needs: [{ type: String }],
    urgency: { type: String, enum: ['Standard', 'Medium', 'High', 'Critical'], default: 'Standard' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    timestamp: { type: Date, default: Date.now },
    language: { type: String },
    reportCount: { type: Number, default: 1 },
    aiReason: { type: String },
    location_translated: { type: String },
    needs_translated: { type: String }
});

const ResourceSchema = new mongoose.Schema({
    organization: { type: String, required: true },
    location: { type: String, required: true },
    coords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    inventory: [{ type: String }],
    status: { type: String, enum: ['Available', 'Low', 'Empty'], default: 'Available' }
});

const VolunteerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In production, this SHOULD be hashed
    orgName: { type: String },
    phone: { type: String }
});

export const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
export const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
export const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);
