INSERT INTO hospitals (name, location, district, latitude, longitude, hospital_type, phone) VALUES
  ('National Hospital of Sri Lanka (NHSL)', 'Regent Street, Colombo 10', 'Colombo', 6.919500, 79.868700, 'government', '+94 11 269 1111'),
  ('Colombo South Teaching Hospital (Kalubowila)', 'Kalubowila, Dehiwala', 'Colombo', 6.871900, 79.882100, 'government', '+94 11 276 3064'),
  ('Colombo North Teaching Hospital (Ragama)', 'Ragama Town', 'Gampaha', 7.027800, 79.924200, 'government', '+94 11 295 9261'),
  ('Sri Jayewardenepura General Hospital', 'Thalapathpitiya, Nugegoda', 'Colombo', 6.864700, 79.921300, 'government', '+94 11 277 8610'),
  ('Teaching Hospital Kandy', 'William Gopallawa Mawatha, Kandy', 'Kandy', 7.288200, 80.627800, 'government', '+94 81 223 3337'),
  ('Teaching Hospital Karapitiya', 'Karapitiya, Galle', 'Galle', 6.065800, 80.229400, 'government', '+94 91 223 2250'),
  ('District General Hospital Negombo', 'Colombo Road, Negombo', 'Gampaha', 7.200800, 79.843600, 'government', '+94 31 222 2261'),
  ('District General Hospital Kalutara (Nagoda)', 'Nagoda, Kalutara', 'Kalutara', 6.585400, 79.960700, 'government', '+94 34 222 2261'),
  ('Teaching Hospital Jaffna', 'Hospital Road, Jaffna', 'Jaffna', 9.664700, 80.016700, 'government', '+94 21 222 2261'),
  ('Asiri Central Hospital', '114 Norris Canal Road, Colombo 10', 'Colombo', 6.924700, 79.866500, 'private', '+94 11 466 5500'),
  ('Lanka Hospitals', '578 Elvitigala Mawatha, Colombo 05', 'Colombo', 6.892400, 79.877800, 'private', '+94 11 543 0000'),
  ('Nawaloka Hospital', '23 Deshamanya H.K. Dharmadasa Mw, Colombo 02', 'Colombo', 6.922100, 79.855300, 'private', '+94 11 557 7111'),
  ('Durdans Hospital', '3 Alfred Place, Colombo 03', 'Colombo', 6.899200, 79.853200, 'private', '+94 11 214 0000')
ON CONFLICT (name) DO UPDATE SET
  location = EXCLUDED.location,
  district = EXCLUDED.district,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  hospital_type = EXCLUDED.hospital_type,
  phone = EXCLUDED.phone;

INSERT INTO users (id, email, password_hash, phone_number, full_name, user_type, is_verified) VALUES
  ('00000000-0000-4000-8000-000000000001', 'ravi.jayawardena@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf', 10)), '+94 77 123 4567', 'Ravi Jayawardena', 'family', true),
  ('00000000-0000-4000-8000-000000000002', 'nadeesha.perera@hirelanka.care', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf', 10)), '+94 77 341 8920', 'Nadeesha Perera', 'individual', true),
  ('00000000-0000-4000-8000-000000000003', 'admin@suwasevana.lk', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf', 10)), '+94 11 250 8912', 'Suwasevana Healthcare Admin', 'agency', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO caregiver_profiles
  (user_id, full_name, age, gender, bio, primary_hospital_id, secondary_hospitals,
   price_per_hour, price_per_day, price_per_shift, availability_type, experience_years,
   qualifications, specializations, languages, contact_phone, contact_email, contact_whatsapp,
   phone_number, whatsapp_number, email, profile_image_url, is_verified)
SELECT u.id, 'Nadeesha Perera', 38, 'Female',
       'Dedicated patient attendant with 7+ years of clinical ward experience at NHSL and Kalubowila.',
       h.id, jsonb_build_array((SELECT id::text FROM hospitals WHERE name = 'Colombo South Teaching Hospital (Kalubowila)'), (SELECT id::text FROM hospitals WHERE name = 'Asiri Central Hospital')),
       650, 4500, 5000, 'whole_day', 7,
       ARRAY['NVQ Level 4 Certified Caregiver (NAITA)'], ARRAY['General Care', 'Post-operative care'], ARRAY['Sinhala', 'English'],
       true, true, true, u.phone_number, u.phone_number, u.email,
       'https://images.unsplash.com/photo-1594824813571-2b533411efa0?auto=format&fit=crop&w=400&q=80', true
FROM users u CROSS JOIN hospitals h
WHERE u.email = 'nadeesha.perera@hirelanka.care' AND h.name = 'National Hospital of Sri Lanka (NHSL)'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO agency_profiles
  (user_id, agency_name, registration_number, description, num_caregivers, primary_hospital_id,
   price_range_min, price_range_max, contact_phone, contact_email, contact_whatsapp,
   show_staff_profiles, logo_url, services, is_verified)
SELECT u.id, 'Suwasevana Healthcare Services', 'AG-SUWASEVANA-001',
       'Registered healthcare caregiver agency in Colombo, providing vetted hospital attendants.',
       35, h.id, 4000, 7500, u.phone_number, 'inquiries@suwasevana.lk', '+94 77 712 3456', true,
       'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
       ARRAY['General Care', 'Hospital Support'], true
FROM users u CROSS JOIN hospitals h
WHERE u.email = 'admin@suwasevana.lk' AND h.name = 'National Hospital of Sri Lanka (NHSL)'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO availability (caregiver_id, date, is_available, time_slot, notes)
SELECT c.id, seed.date::date, seed.is_available, 'whole_day', seed.notes
FROM caregiver_profiles c
CROSS JOIN (VALUES ('2026-10-04', true, NULL::text), ('2026-10-05', false, 'Booked')) AS seed(date, is_available, notes)
WHERE c.full_name = 'Nadeesha Perera'
ON CONFLICT (caregiver_id, date) DO NOTHING;

INSERT INTO reviews (reviewer_id, reviewee_id, reviewee_type, rating, title, comment, hospital_name, is_verified)
SELECT reviewer.id, reviewee.id, 'individual', 5, 'Extremely caring at NHSL Ward 14',
       'Nadeesha took wonderful care of my mother post surgery.', 'National Hospital of Sri Lanka (NHSL)', true
FROM users reviewer CROSS JOIN users reviewee
WHERE reviewer.email = 'ravi.jayawardena@gmail.com' AND reviewee.email = 'nadeesha.perera@hirelanka.care'
  AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.reviewer_id = reviewer.id AND r.reviewee_id = reviewee.id);