// Simple in-memory storage for the hackathon demo
// In a real app, this would be a database connection

export const initialRequests = [
    {
        id: 'req_1',
        name: 'Ramesh Gupta',
        location: 'Gomti Nagar, Lucknow',
        coords: { lat: 26.8467, lng: 80.9462 },
        needs: ['Food', 'Water'],
        urgency: 'High',
        status: 'Pending',
        timestamp: new Date().toISOString(),
        language: 'Hindi'
    },
    {
        id: 'req_2',
        name: 'Sita Devi',
        location: 'Indira Nagar, Lucknow',
        coords: { lat: 26.8900, lng: 81.0000 },
        needs: ['Medical'],
        urgency: 'Critical',
        status: 'Pending',
        timestamp: new Date().toISOString(),
        language: 'Hindi'
    }
];

export const initialResources = [
    {
        id: 'res_1',
        organization: 'Helping Hands NGO',
        location: 'Hazratganj, Lucknow',
        coords: { lat: 26.8500, lng: 80.9500 },
        inventory: ['Food Packets: 50', 'Water Bottles: 100'],
        status: 'Available'
    }
];

// We use a global variable to persist data across hot reloads in development if possible,
// but usually module scope is reset. For a demo, this is fine.
global.requests = global.requests || [...initialRequests];
global.resources = global.resources || [...initialResources];
global.volunteers = global.volunteers || [];

export const getRequests = () => global.requests;
export const addRequest = (req) => {
    const newReq = { ...req, id: `req_${Date.now()}`, status: 'Pending', timestamp: new Date().toISOString() };
    global.requests.push(newReq);
    return newReq;
};

export const getResources = () => global.resources;
export const addResource = (res) => {
    const newRes = { ...res, id: `res_${Date.now()}` };
    global.resources.push(newRes);
    return newRes;
};

export const getVolunteers = () => global.volunteers;
export const addVolunteer = (vol) => {
    const newVol = { ...vol, id: `vol_${Date.now()}` };
    global.volunteers.push(newVol);
    return newVol;
};

export const completeRequest = (id) => {
    const initialLen = global.requests.length;
    global.requests = global.requests.filter(r => r.id !== id);
    return global.requests.length < initialLen;
};
