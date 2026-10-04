import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// In-Memory Database (Pre-populated matching Sri Lankan dataset & Technical Spec schema)
const db = {
  users: [
    {
      id: 'usr-nadeesha',
      email: 'nadeesha@hirelanka.care',
      password_hash: '$2b$10$e8Z...',
      phone_number: '+94 77 341 8920',
      user_type: 'individual',
      is_verified: true,
      created_at: '2025-08-14T08:00:00Z'
    },
    {
      id: 'usr-suwasevana',
      email: 'agency@suwasevana.lk',
      password_hash: '$2b$10$e8Z...',
      phone_number: '+94 11 250 8912',
      user_type: 'agency',
      is_verified: true,
      created_at: '2025-01-05T08:00:00Z'
    }
  ],
  hospitals: [
    {
      id: 'hosp-nhsl',
      name: 'National Hospital of Sri Lanka (NHSL)',
      location: 'Regent Street, Colombo 10',
      district: 'Colombo',
      latitude: 6.9195,
      longitude: 79.8687,
      hospital_type: 'government',
      phone: '+94 11 269 1111'
    },
    {
      id: 'hosp-kalubowila',
      name: 'Colombo South Teaching Hospital (Kalubowila)',
      location: 'Kalubowila, Dehiwala',
      district: 'Colombo',
      latitude: 6.8719,
      longitude: 79.8821,
      hospital_type: 'government',
      phone: '+94 11 276 3064'
    },
    {
      id: 'hosp-ragama',
      name: 'Colombo North Teaching Hospital (Ragama)',
      location: 'Ragama Town',
      district: 'Gampaha',
      latitude: 7.0278,
      longitude: 79.9242,
      hospital_type: 'government',
      phone: '+94 11 295 9261'
    },
    {
      id: 'hosp-sjp',
      name: 'Sri Jayewardenepura General Hospital',
      location: 'Thalapathpitiya, Nugegoda',
      district: 'Colombo',
      latitude: 6.8647,
      longitude: 79.9213,
      hospital_type: 'government',
      phone: '+94 11 277 8610'
    },
    {
      id: 'hosp-kandy',
      name: 'Teaching Hospital Kandy',
      location: 'William Gopallawa Mawatha, Kandy',
      district: 'Kandy',
      latitude: 7.2882,
      longitude: 80.6278,
      hospital_type: 'government',
      phone: '+94 81 223 3337'
    },
    {
      id: 'hosp-karapitiya',
      name: 'Teaching Hospital Karapitiya',
      location: 'Karapitiya, Galle',
      district: 'Galle',
      latitude: 6.0658,
      longitude: 80.2294,
      hospital_type: 'government',
      phone: '+94 91 223 2250'
    },
    {
      id: 'hosp-asiri',
      name: 'Asiri Central Hospital',
      location: '114 Norris Canal Road, Colombo 10',
      district: 'Colombo',
      latitude: 6.9247,
      longitude: 79.8665,
      hospital_type: 'private',
      phone: '+94 11 466 5500'
    }
  ],
  caregiver_profiles: [
    {
      id: 'cg-nadeesha',
      user_id: 'usr-nadeesha',
      full_name: 'Nadeesha Perera',
      age: 38,
      bio: 'Dedicated patient attendant with 7+ years of clinical ward experience at NHSL and Kalubowila.',
      primary_hospital_id: 'hosp-nhsl',
      secondary_hospitals: ['hosp-kalubowila', 'hosp-asiri'],
      price_per_hour: 650,
      price_per_day: 4500,
      price_per_shift: 5000,
      availability_type: 'whole_day',
      experience_years: 7,
      qualifications: 'NVQ Level 4 Certified Caregiver (NAITA)',
      contact_phone: true,
      contact_email: true,
      contact_whatsapp: true,
      phone_number: '+94 77 341 8920',
      whatsapp_number: '+94 77 341 8920',
      email: 'nadeesha@hirelanka.care',
      profile_image_url: 'https://images.unsplash.com/photo-1594824813571-2b533411efa0?auto=format&fit=crop&w=400&q=80',
      is_active: true,
      is_verified: true,
      rating: 4.9,
      review_count: 28,
      created_at: '2025-08-14T08:00:00Z'
    },
    {
      id: 'cg-kumar',
      user_id: 'usr-kumar',
      full_name: 'K. Kumarasamy',
      age: 46,
      bio: 'Strong, compassionate patient attendant specializing in heavy mobility transfer and male patient care.',
      primary_hospital_id: 'hosp-kalubowila',
      secondary_hospitals: ['hosp-sjp'],
      price_per_hour: 700,
      price_per_day: 5000,
      price_per_shift: 5500,
      availability_type: 'whole_day',
      experience_years: 10,
      qualifications: 'Elderly Patient Care Certificate (St. John Ambulance)',
      contact_phone: true,
      contact_email: true,
      contact_whatsapp: true,
      phone_number: '+94 76 529 7311',
      whatsapp_number: '+94 76 529 7311',
      email: 'kumar@hirelanka.care',
      profile_image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      is_active: true,
      is_verified: true,
      rating: 5.0,
      review_count: 34,
      created_at: '2025-06-20T09:00:00Z'
    }
  ],
  agency_profiles: [
    {
      id: 'agency-suwasevana',
      user_id: 'usr-suwasevana',
      agency_name: 'Suwasevana Healthcare Services',
      description: 'Premier registered healthcare caregiver agency in Colombo, providing vetted hospital attendants.',
      num_caregivers: 35,
      primary_hospital_id: 'hosp-nhsl',
      price_range_min: 4000,
      price_range_max: 7500,
      contact_phone: '+94 11 250 8912',
      contact_email: 'inquiries@suwasevana.lk',
      contact_whatsapp: '+94 77 712 3456',
      show_staff_profiles: true,
      logo_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
      is_active: true,
      rating: 4.9,
      review_count: 52
    }
  ],
  agency_staff: [
    {
      id: 'staff-1',
      agency_id: 'agency-suwasevana',
      staff_name: 'Chandani Weerasinghe',
      staff_age: 41,
      specialization: 'Post-operative orthopedic care',
      contact_info: { phone: '+94 77 123 9900' },
      is_visible: true
    }
  ],
  availability: [
    { id: 'av-1', caregiver_id: 'cg-nadeesha', date: '2026-10-04', is_available: true, time_slot: 'whole_day' },
    { id: 'av-2', caregiver_id: 'cg-nadeesha', date: '2026-10-05', is_available: false, time_slot: 'whole_day', notes: 'Booked' }
  ],
  reviews: [
    {
      id: 'rev-1',
      reviewer_id: 'usr-family-ravi',
      reviewee_id: 'cg-nadeesha',
      reviewee_type: 'individual',
      rating: 5,
      title: 'Extremely caring at NHSL Ward 14',
      comment: 'Nadeesha took wonderful care of my mother post surgery.',
      is_verified: true,
      created_at: '2026-09-18T14:20:00Z'
    }
  ]
};

// Error Helper
const createErrorResponse = (res, statusCode, code, message, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: { code, message, details }
  });
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'HireLanka Care Express REST API', timestamp: new Date() });
});

// -------------------------------------------------------------
// 3.1 AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { email, password, user_type, phone_number } = req.body;
  if (!email || !password || !user_type) {
    return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Email, password, and user_type are required');
  }

  const existing = db.users.find(u => u.email === email);
  if (existing) {
    return createErrorResponse(res, 409, 'DUPLICATE_ENTRY', 'User with this email already exists');
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    password_hash: `$2b$10$fakehash_${Date.now()}`,
    phone_number: phone_number || '',
    user_type,
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.users.push(newUser);

  res.status(201).json({
    success: true,
    user_id: newUser.id,
    user_type: newUser.user_type,
    token: `mock_jwt_token_${newUser.id}_${Date.now()}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Email and password are required');
  }

  const user = db.users.find(u => u.email === email);
  if (!user) {
    return createErrorResponse(res, 401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  res.json({
    success: true,
    token: `mock_jwt_token_${user.id}_${Date.now()}`,
    user_id: user.id,
    user_type: user.user_type
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// 3.2 CAREGIVER PROFILE MANAGEMENT
// -------------------------------------------------------------
app.post('/api/caregivers/create', (req, res) => {
  const { full_name, age, primary_hospital_id, price_per_day, availability_type } = req.body;
  if (!full_name || !primary_hospital_id) {
    return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Full name and primary hospital are required');
  }

  const newProfile = {
    id: `cg-${Date.now()}`,
    user_id: req.body.user_id || 'usr-guest',
    full_name,
    age: age || 30,
    bio: req.body.bio || '',
    primary_hospital_id,
    secondary_hospitals: req.body.secondary_hospitals || [],
    price_per_hour: req.body.price_per_hour || 500,
    price_per_day: price_per_day || 4000,
    price_per_shift: req.body.price_per_shift || 4500,
    availability_type: availability_type || 'whole_day',
    experience_years: req.body.experience_years || 1,
    qualifications: req.body.qualifications || '',
    contact_phone: req.body.contact_phone ?? true,
    contact_email: req.body.contact_email ?? false,
    contact_whatsapp: req.body.contact_whatsapp ?? true,
    phone_number: req.body.phone_number || '',
    whatsapp_number: req.body.whatsapp_number || '',
    email: req.body.email || '',
    profile_image_url: req.body.profile_image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
    is_active: true,
    is_verified: false,
    rating: 5.0,
    review_count: 0,
    created_at: new Date().toISOString()
  };

  db.caregiver_profiles.push(newProfile);

  res.status(201).json({
    success: true,
    caregiver_id: newProfile.id,
    profile_status: 'created'
  });
});

app.get('/api/caregivers/:caregiver_id', (req, res) => {
  const cg = db.caregiver_profiles.find(c => c.id === req.params.caregiver_id);
  if (!cg) {
    return createErrorResponse(res, 404, 'NOT_FOUND', 'Caregiver profile not found');
  }
  const hospital = db.hospitals.find(h => h.id === cg.primary_hospital_id);
  res.json({ success: true, caregiver: { ...cg, hospital } });
});

app.put('/api/caregivers/:caregiver_id', (req, res) => {
  const cgIndex = db.caregiver_profiles.findIndex(c => c.id === req.params.caregiver_id);
  if (cgIndex === -1) {
    return createErrorResponse(res, 404, 'NOT_FOUND', 'Caregiver profile not found');
  }

  db.caregiver_profiles[cgIndex] = { ...db.caregiver_profiles[cgIndex], ...req.body, updated_at: new Date().toISOString() };
  res.json({ success: true, updated_fields: Object.keys(req.body) });
});

// -------------------------------------------------------------
// 3.3 AGENCY PROFILE MANAGEMENT
// -------------------------------------------------------------
app.post('/api/agencies/create', (req, res) => {
  const { agency_name, primary_hospital_id } = req.body;
  if (!agency_name || !primary_hospital_id) {
    return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Agency name and primary hospital are required');
  }

  const newAgency = {
    id: `agency-${Date.now()}`,
    user_id: req.body.user_id || 'usr-agency-guest',
    agency_name,
    description: req.body.description || '',
    num_caregivers: req.body.num_caregivers || 5,
    primary_hospital_id,
    price_range_min: req.body.price_range_min || 3500,
    price_range_max: req.body.price_range_max || 7000,
    contact_phone: req.body.contact_phone || '',
    contact_email: req.body.contact_email || '',
    contact_whatsapp: req.body.contact_whatsapp || '',
    show_staff_profiles: req.body.show_staff_profiles ?? true,
    logo_url: req.body.logo_url || '',
    is_active: true,
    rating: 5.0,
    review_count: 0
  };

  db.agency_profiles.push(newAgency);
  res.status(201).json({ success: true, agency_id: newAgency.id, profile_status: 'created' });
});

app.get('/api/agencies/:agency_id', (req, res) => {
  const agency = db.agency_profiles.find(a => a.id === req.params.agency_id);
  if (!agency) {
    return createErrorResponse(res, 404, 'NOT_FOUND', 'Agency profile not found');
  }
  const staff = agency.show_staff_profiles ? db.agency_staff.filter(s => s.agency_id === agency.id && s.is_visible) : [];
  res.json({ success: true, agency: { ...agency, staff } });
});

app.post('/api/agencies/:agency_id/staff', (req, res) => {
  const { staff_name, staff_age, specialization } = req.body;
  const newStaff = {
    id: `staff-${Date.now()}`,
    agency_id: req.params.agency_id,
    staff_name,
    staff_age,
    specialization: specialization || '',
    contact_info: req.body.contact_info || {},
    is_visible: true,
    created_at: new Date().toISOString()
  };

  db.agency_staff.push(newStaff);
  res.status(201).json({ success: true, staff_id: newStaff.id });
});

// -------------------------------------------------------------
// 3.4 SEARCH & FILTERING (Section 3.4 Spec Query Logic)
// -------------------------------------------------------------
app.get('/api/search', (req, res) => {
  const { hospital_id, age_min, age_max, availability, price_max, sort_by } = req.query;

  let results = db.caregiver_profiles.filter(cg => {
    if (!cg.is_active) return false;

    if (hospital_id && cg.primary_hospital_id !== hospital_id && !cg.secondary_hospitals?.includes(hospital_id)) {
      return false;
    }

    if (age_min && cg.age < Number(age_min)) return false;
    if (age_max && cg.age > Number(age_max)) return false;

    if (availability && availability !== 'all' && cg.availability_type !== availability) {
      return false;
    }

    if (price_max && cg.price_per_day > Number(price_max)) return false;

    return true;
  });

  // Sorting
  if (sort_by === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort_by === 'price_asc') {
    results.sort((a, b) => a.price_per_day - b.price_per_day);
  } else if (sort_by === 'price_desc') {
    results.sort((a, b) => b.price_per_day - a.price_per_day);
  }

  res.json({
    success: true,
    results,
    total_count: results.length,
    page: 1,
    has_more: false
  });
});

// -------------------------------------------------------------
// 3.5 AVAILABILITY CALENDAR
// -------------------------------------------------------------
app.get('/api/caregivers/:caregiver_id/availability', (req, res) => {
  const slots = db.availability.filter(a => a.caregiver_id === req.params.caregiver_id);
  res.json({
    success: true,
    caregiver_id: req.params.caregiver_id,
    booked_dates: slots.filter(s => !s.is_available).map(s => s.date),
    available_dates: slots.filter(s => s.is_available).map(s => s.date),
    calendar_data: slots
  });
});

app.post('/api/caregivers/:caregiver_id/availability/update', (req, res) => {
  const { date, is_available, time_slot } = req.body;
  const existing = db.availability.find(a => a.caregiver_id === req.params.caregiver_id && a.date === date);

  if (existing) {
    existing.is_available = is_available;
    existing.time_slot = time_slot || existing.time_slot;
  } else {
    db.availability.push({
      id: `av-${Date.now()}`,
      caregiver_id: req.params.caregiver_id,
      date,
      is_available,
      time_slot: time_slot || 'whole_day'
    });
  }

  res.json({ success: true });
});

// -------------------------------------------------------------
// 3.6 RATINGS & REVIEWS
// -------------------------------------------------------------
app.post('/api/reviews', (req, res) => {
  const { reviewee_id, reviewee_type, rating, title, comment } = req.body;
  if (!reviewee_id || !rating || !comment) {
    return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Reviewee ID, rating, and comment are required');
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    reviewer_id: req.body.reviewer_id || 'usr-family-guest',
    reviewee_id,
    reviewee_type: reviewee_type || 'individual',
    rating: Number(rating),
    title: title || '',
    comment,
    is_verified: true,
    created_at: new Date().toISOString()
  };

  db.reviews.push(newReview);
  res.status(201).json({ success: true, review_id: newReview.id });
});

app.get('/api/caregivers/:caregiver_id/reviews', (req, res) => {
  const caregiverReviews = db.reviews.filter(r => r.reviewee_id === req.params.caregiver_id);
  const avg = caregiverReviews.length ? (caregiverReviews.reduce((sum, r) => sum + r.rating, 0) / caregiverReviews.length).toFixed(1) : 5.0;

  res.json({
    success: true,
    reviews: caregiverReviews,
    avg_rating: Number(avg),
    total_reviews: caregiverReviews.length
  });
});

// -------------------------------------------------------------
// 3.7 HOSPITALS
// -------------------------------------------------------------
app.get('/api/hospitals', (req, res) => {
  res.json({ success: true, hospitals: db.hospitals });
});

app.get('/api/hospitals/search', (req, res) => {
  const query = (req.query.query || '').toString().toLowerCase();
  const matched = db.hospitals.filter(h =>
    h.name.toLowerCase().includes(query) ||
    h.location.toLowerCase().includes(query) ||
    h.district.toLowerCase().includes(query)
  );
  res.json({ success: true, hospitals: matched });
});

app.listen(PORT, () => {
  console.log(`🚀 HireLanka Care Express REST API server running on port ${PORT}`);
});
