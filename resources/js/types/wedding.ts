export interface Wedding {
    id: number;
    user_id: number;
    title: string;
    bride_name: string;
    groom_name: string;
    wedding_date: string | null;
    ceremony_time: string | null;
    reception_time: string | null;
    wedding_style: string | null;
    color_scheme: string | null;
    theme_description: string | null;
    status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
    total_budget: number | null;
    currency: string;
    cover_image: string | null;
    settings: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    // Counts
    guests_count?: number;
    confirmed_guests_count?: number;
    pending_guests_count?: number;
    declined_guests_count?: number;
    tasks_count?: number;
    completed_tasks_count?: number;
    pending_tasks_count?: number;
    vendors_count?: number;
    booked_vendors_count?: number;
    // Relations
    venues?: Venue[];
    wedding_party_members?: WeddingPartyMember[];
    budget_categories?: BudgetCategory[];
}

export interface Venue {
    id: number;
    wedding_id: number;
    name: string;
    type: 'ceremony' | 'reception' | 'both';
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    latitude: number | null;
    longitude: number | null;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    website: string | null;
    capacity: number | null;
    cost: number | null;
    deposit: number | null;
    deposit_due_date: string | null;
    deposit_paid: boolean;
    is_booked: boolean;
    booking_date: string | null;
    notes: string | null;
    amenities: string[] | null;
    images: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface WeddingPartyMember {
    id: number;
    wedding_id: number;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    side: 'bride' | 'groom';
    relationship: string | null;
    responsibilities: string | null;
    attire_status: 'pending' | 'ordered' | 'fitted' | 'ready';
    attire_details: string | null;
    attire_cost: number | null;
    notes: string | null;
    photo: string | null;
    order: number;
    created_at: string;
    updated_at: string;
    assigned_tasks?: Task[];
}

export interface Guest {
    id: number;
    wedding_id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
    group: string | null;
    side: 'bride' | 'groom' | 'both' | null;
    relationship: string | null;
    rsvp_status: 'pending' | 'confirmed' | 'declined' | 'maybe';
    rsvp_date: string | null;
    attending_ceremony: boolean;
    attending_reception: boolean;
    plus_one_allowed: number;
    plus_one_count: number;
    plus_one_name: string | null;
    dietary_restrictions: string[] | null;
    meal_choice: string | null;
    special_requests: string | null;
    table_id: number | null;
    seat_number: number | null;
    is_child: boolean;
    age: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    seating_table?: SeatingTable;
    invitation?: Invitation;
    gifts?: Gift[];
}

export interface VendorCategory {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    order: number;
}

export interface Vendor {
    id: number;
    wedding_id: number;
    vendor_category_id: number;
    name: string;
    company_name: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    status: 'considering' | 'contacted' | 'booked' | 'declined' | 'cancelled';
    quoted_price: number | null;
    final_price: number | null;
    deposit_amount: number | null;
    deposit_due_date: string | null;
    deposit_paid: boolean;
    balance_due: number | null;
    balance_due_date: string | null;
    balance_paid: boolean;
    contract_signed_date: string | null;
    contract_file: string | null;
    rating: number | null;
    review: string | null;
    notes: string | null;
    services: string[] | null;
    images: string[] | null;
    created_at: string;
    updated_at: string;
    category?: VendorCategory;
}

export interface BudgetCategory {
    id: number;
    wedding_id: number;
    name: string;
    icon: string | null;
    estimated_amount: number;
    actual_amount: number;
    percentage: number | null;
    notes: string | null;
    order: number;
    created_at: string;
    updated_at: string;
    items?: BudgetItem[];
    items_sum_estimated_cost?: number;
    items_sum_actual_cost?: number;
    items_sum_paid_amount?: number;
}

export interface BudgetItem {
    id: number;
    wedding_id: number;
    budget_category_id: number;
    vendor_id: number | null;
    name: string;
    description: string | null;
    estimated_cost: number;
    actual_cost: number;
    paid_amount: number;
    payment_status: 'pending' | 'partial' | 'paid';
    due_date: string | null;
    is_paid: boolean;
    paid_date: string | null;
    payment_method: string | null;
    notes: string | null;
    receipt: string | null;
    priority: number;
    created_at: string;
    updated_at: string;
    category?: BudgetCategory;
    vendor?: Vendor;
}

export interface Task {
    id: number;
    wedding_id: number;
    assigned_to: number | null;
    title: string;
    description: string | null;
    category: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date: string | null;
    completed_date: string | null;
    timeline_phase: string | null;
    notes: string | null;
    checklist: { item: string; completed: boolean }[] | null;
    order: number;
    created_at: string;
    updated_at: string;
    assigned_member?: WeddingPartyMember;
}

export interface TimelineEvent {
    id: number;
    wedding_id: number;
    venue_id: number | null;
    vendor_id: number | null;
    title: string;
    description: string | null;
    type: string;
    start_time: string;
    end_time: string | null;
    duration_minutes: number | null;
    location: string | null;
    participants: string[] | null;
    notes: string | null;
    color: string | null;
    order: number;
    created_at: string;
    updated_at: string;
    venue?: Venue;
    vendor?: Vendor;
}

export interface SeatingTable {
    id: number;
    wedding_id: number;
    name: string;
    shape: 'round' | 'rectangular' | 'square' | 'oval' | 'u_shape' | 'head_table';
    capacity: number;
    location: string | null;
    position_x: number | null;
    position_y: number | null;
    notes: string | null;
    order: number;
    created_at: string;
    updated_at: string;
    guests?: Guest[];
}

export interface GiftRegistry {
    id: number;
    wedding_id: number;
    store_name: string;
    registry_url: string | null;
    registry_id: string | null;
    notes: string | null;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface Gift {
    id: number;
    wedding_id: number;
    guest_id: number | null;
    gift_registry_id: number | null;
    name: string;
    description: string | null;
    value: number | null;
    status: 'received' | 'returned' | 'exchanged';
    received_date: string | null;
    thank_you_sent: boolean;
    thank_you_date: string | null;
    notes: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
    guest?: Guest;
    registry?: GiftRegistry;
}

export interface Invitation {
    id: number;
    wedding_id: number;
    guest_id: number;
    type: string;
    delivery_method: 'mail' | 'email' | 'hand_delivered';
    status: 'pending' | 'sent' | 'delivered' | 'returned';
    sent_date: string | null;
    delivered_date: string | null;
    tracking_number: string | null;
    address_used: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    guest?: Guest;
}

export interface MarriageCertificate {
    id: number;
    wedding_id: number;
    certificate_number: string | null;
    license_number: string | null;
    license_issue_date: string | null;
    license_expiry_date: string | null;
    issuing_authority: string | null;
    issuing_location: string | null;
    bride_legal_name: string;
    groom_legal_name: string;
    marriage_date: string | null;
    marriage_location: string | null;
    officiant_name: string | null;
    officiant_title: string | null;
    witness_1_name: string | null;
    witness_2_name: string | null;
    status: 'pending' | 'applied' | 'received' | 'filed';
    application_date: string | null;
    received_date: string | null;
    fee: number | null;
    fee_paid: boolean;
    certificate_file: string | null;
    license_file: string | null;
    notes: string | null;
    requirements_checklist: { item: string; completed: boolean }[] | null;
    created_at: string;
    updated_at: string;
}

export interface Accommodation {
    id: number;
    wedding_id: number;
    hotel_name: string;
    address: string | null;
    city: string | null;
    phone: string | null;
    website: string | null;
    booking_code: string | null;
    rate_per_night: number | null;
    block_start_date: string | null;
    block_end_date: string | null;
    booking_deadline: string | null;
    rooms_blocked: number | null;
    rooms_booked: number;
    distance_to_venue: string | null;
    amenities: string | null;
    notes: string | null;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    guest_accommodations_count?: number;
}

export interface Menu {
    id: number;
    wedding_id: number;
    name: string;
    type: string;
    description: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
    items?: MenuItem[];
}

export interface MenuItem {
    id: number;
    menu_id: number;
    name: string;
    description: string | null;
    course: string | null;
    price_per_person: number | null;
    dietary_info: string[] | null;
    allergens: string[] | null;
    is_available: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}
