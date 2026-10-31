export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'couple' | 'vendor' | 'planner' | 'coordinator' | 'admin';
  is_active: boolean;
}

export interface Wedding {
  id: string;
  owner_id: string;
  planner_id?: string;
  couple_names: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string;
  destination_city: string;
  destination_state: string;
  estimated_guests: number;
  total_budget: number;
  allocated_budget: number;
  currency: string;
  style: string;
  ceremony_tradition: string;
  status: string;
  is_demo: boolean;
  primary_venue_name?: string;
}

export interface WeddingFunction {
  id: string;
  wedding_id: string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  venue_name?: string;
  venue_location?: string;
  guest_count: number;
  budget_allocation: number;
  notes?: string;
  order_index: number;
}

export interface Venue {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  address: string;
  capacity_min: number;
  capacity_max: number;
  price_range_start: number;
  price_range_end: number;
  description: string;
  facilities_json: string[];
  images_json: string[];
  contact_phone?: string;
  contact_email?: string;
  lat: number;
  lng: number;
  is_verified: boolean;
  is_sample: boolean;
}

export interface Vendor {
  id: string;
  user_id?: string;
  business_name: string;
  representative_name: string;
  category: string;
  city: string;
  state: string;
  address?: string;
  experience_years: number;
  description: string;
  portfolio_urls_json: string[];
  price_range: string;
  verified_status: 'submitted' | 'documents_pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  pan_gst?: string;
  rating: number;
  review_count: number;
  is_sample: boolean;
}

export interface Quotation {
  id: string;
  enquiry_id?: string;
  wedding_id: string;
  vendor_id: string;
  package_description: string;
  price_per_unit: number;
  unit_type: string;
  guest_count: number;
  subtotal: number;
  tax_amount: number;
  additional_charges: number;
  total_amount: number;
  inclusions_json: string[];
  exclusions_json: string[];
  validity_date?: string;
  payment_terms: string;
  status: string;
  is_recommended: boolean;
  comparison_notes?: string;
  vendor?: Vendor;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  committed: number;
  actual_spent: number;
  variance: number;
}

export interface BudgetOverview {
  wedding_id: string;
  couple_names: string;
  total_approved_budget: number;
  total_allocated: number;
  total_committed: number;
  total_actual_spent: number;
  remaining_balance: number;
  spending_percentage: number;
  is_overspending_risk: boolean;
  categories: BudgetCategory[];
  pending_requests_count: number;
}

export interface BudgetChangeRequest {
  id: string;
  wedding_id: string;
  requested_by_id: string;
  previous_budget: number;
  new_budget: number;
  additional_guests: number;
  estimated_cost_impact: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by_id?: string;
  approval_notes?: string;
  created_at?: string;
}

export interface PaymentRecord {
  id: string;
  wedding_id: string;
  vendor_id?: string;
  title: string;
  stage: 'booking' | 'advance' | 'pre_event' | 'final' | 'additional';
  amount: number;
  due_date: string;
  status: 'pending' | 'completed' | 'overdue' | 'refunded';
  payment_method: string;
  transaction_reference?: string;
  invoice_number?: string;
  is_simulated: boolean;
  paid_at?: string;
}

export interface Guest {
  id: string;
  wedding_id: string;
  name: string;
  email?: string;
  phone?: string;
  group_name: string;
  rsvp_status: 'attending' | 'declined' | 'tentative' | 'invited';
  dietary_preference: string;
  is_vip: boolean;
  plus_ones: number;
  table_id?: string;
  check_in_status: boolean;
  check_in_time?: string;
}

export interface SeatingTable {
  id: string;
  wedding_id: string;
  table_name: string;
  table_number: number;
  capacity: number;
  shape: string;
}

export interface Task {
  id: string;
  wedding_id: string;
  function_id?: string;
  title: string;
  description?: string;
  assigned_to_name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'to_plan' | 'in_progress' | 'waiting_approval' | 'completed' | 'delayed';
  due_date: string;
}

export interface ScheduleItem {
  id: string;
  wedding_id: string;
  function_id?: string;
  title: string;
  start_time: string;
  end_time: string;
  venue_area: string;
  vendor_name?: string;
  responsible_coordinator: string;
  status: 'scheduled' | 'in_progress' | 'delayed' | 'completed';
  delay_minutes: number;
  dependent_items_json: string[];
  notes?: string;
}

export interface Incident {
  id: string;
  wedding_id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reported_by: string;
  reported_at?: string;
  status: 'open' | 'investigating' | 'resolved';
  resolution_notes?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  wedding_id?: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at?: string;
}
