import api from "./api";
import type { Event, Participant, Transaction } from "../types";

// Helper to map backend snake_case to frontend camelCase
const mapEvent = (data: any): Event => ({
    id: data.id.toString(),
    name: data.name,
    description: data.description,
    startDate: data.start_date || new Date().toISOString().split("T")[0], // Fallback if missing
    endDate: data.end_date,
    status: data.status,
    totalBudget: Number(data.total_budget || 0),
    currentSpent: Number(data.current_spent || 0),
    participantCount: Number(data.participant_count || 1), // At least creator
    createdBy: data.created_by?.toString(),
    createdAt: data.created_at,
});

// Helper to map backend category to frontend Category
const mapCategory = (data: any): any => ({
    id: data.id.toString(),
    name: data.name,
    budget: Number(data.total_amount || 0),
    spent: 0, // Backend doesn't calculate this yet
    icon: 'other', // Default icon
    participantIds: [], // Default empty
});

export const eventService = {
    // Get all events for the current user
    getAll: async (): Promise<Event[]> => {
        const response = await api.get("events");
        return response.data.map(mapEvent);
    },

    // Get single event by ID
    getById: async (id: string): Promise<Event> => {
        const response = await api.get(`events/${id}`);
        return mapEvent(response.data);
    },

    // Create new event
    create: async (data: {
        name: string;
        description: string;
        startDate: string;
        endDate?: string;
        budget?: number; // Backend might not support this yet, but we'll send it
    }): Promise<{ eventId: string }> => {
        const response = await api.post("events", data);
        return response.data;
    },

    // Join event by ID (Code)
    join: async (eventId: string): Promise<void> => {
        await api.post(`events/${eventId}/join`);
    },

    // Get participants
    getParticipants: async (eventId: string): Promise<Participant[]> => {
        const response = await api.get(`events/${eventId}/participants`);
        // Note: Backend currently returns array of { user_id }, might need enrichment
        // For now, we'll return what we get or map if backend changes
        return response.data;
    },

    // Get payments/expenses
    getPayments: async (eventId: string): Promise<Transaction[]> => {
        const response = await api.get(`events/${eventId}/payments`);
        return response.data;
    },

    // Get categories
    getCategories: async (eventId: string): Promise<any[]> => {
        const response = await api.get(`events/${eventId}/categories`);
        return response.data.map(mapCategory);
    },

    // Add Expense (Manual)
    addExpense: async (eventId: string, data: any): Promise<void> => {
        await api.post(`events/${eventId}/expenses`, data);
    },

    // Delete Event
    delete: async (eventId: string): Promise<void> => {
        await api.delete(`events/${eventId}`);
    },

    // Update Event
    update: async (eventId: string, data: any): Promise<void> => {
        await api.put(`events/${eventId}`, data);
    },

    // Invite User
    inviteUser: async (eventId: string, email: string): Promise<void> => {
        // First find user by email (endpoint needed or search logic)
        // For hackathon, we might just pass email and let backend handle lookup if implemented
        // Or if backend expects userId, we need to find it.
        // Let's assume for now we need to ask backend to invite by email if possible?
        // Current backend invites by userId. 
        // We'll search first.
        const searchRes = await api.get(`users/search?email=${email}`);
        if (!searchRes.data || searchRes.data.length === 0) {
            throw new Error("User not found");
        }
        const userId = searchRes.data[0].id;
        await api.post(`events/${eventId}/invite`, { userId });
    },

    // Add Category
    addCategory: async (eventId: string, name: string): Promise<void> => {
        await api.post(`events/${eventId}/categories`, { name });
    }
};
