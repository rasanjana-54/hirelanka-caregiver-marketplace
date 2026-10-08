import express from 'express';

const caregiverSelect = `
  SELECT c.id, c.user_id AS "userId", c.full_name AS "fullName", c.age, c.gender, c.bio,
         c.primary_hospital_id AS "primaryHospitalId", c.secondary_hospitals AS "secondaryHospitalIds",
         c.price_per_hour AS "pricePerHour", c.price_per_day AS "pricePerDay",
         c.price_per_shift AS "pricePerShift", c.availability_type AS "availabilityType",
         c.experience_years AS "experienceYears", c.qualifications, c.specializations, c.languages,
         c.contact_phone AS "contactPhone", c.contact_email AS "contactEmail",
         c.contact_whatsapp AS "contactWhatsapp", c.phone_number AS "phoneNumber",
         c.whatsapp_number AS "whatsappNumber", c.email, c.profile_image_url AS "profileImageUrl",
         c.is_active AS "isActive", c.is_verified AS "isVerified", c.created_at AS "createdAt",
         h.name AS "hospitalName", h.latitude AS "hospitalLatitude", h.longitude AS "hospitalLongitude",
         COALESCE(AVG(r.rating), 0)::numeric(3,1) AS rating, COUNT(r.id)::int AS "reviewCount"
  FROM caregiver_profiles c
  JOIN hospitals h ON h.id = c.primary_hospital_id
         LEFT JOIN reviews r ON r.reviewee_id = c.user_id AND r.is_verified = true
`;

const agencySelect = `
  SELECT a.id, a.user_id AS "userId", a.agency_name AS "agencyName",
         a.registration_number AS "registrationNumber", a.description,
         a.num_caregivers AS "numCaregivers", a.primary_hospital_id AS "primaryHospitalId",
         a.secondary_hospitals AS "secondaryHospitalIds", a.price_range_min AS "priceRangeMin",
         a.price_range_max AS "priceRangeMax", a.contact_phone AS "contactPhone",
         a.contact_email AS "contactEmail", a.contact_whatsapp AS "contactWhatsapp",
         a.show_staff_profiles AS "showStaffProfiles", a.logo_url AS "logoUrl", a.services,
         a.is_active AS "isActive", a.is_verified AS "isVerified", a.created_at AS "createdAt",
         CASE WHEN a.show_staff_profiles THEN (
           SELECT COALESCE(json_agg(json_build_object(
             'id', s.id, 'agencyId', s.agency_id, 'staffName', s.staff_name,
             'staffAge', s.staff_age, 'gender', s.gender, 'specialization', s.specialization,
             'experienceYears', s.experience_years, 'contactInfo', s.contact_info,
             'isVisible', s.is_visible, 'createdAt', s.created_at
           ) ORDER BY s.created_at), '[]'::json)
           FROM agency_staff s WHERE s.agency_id = a.id AND s.is_visible = true
         ) ELSE '[]'::json END AS staff,
         COALESCE(AVG(r.rating), 0)::numeric(3,1) AS rating, COUNT(r.id)::int AS "reviewCount"
  FROM agency_profiles a
         LEFT JOIN reviews r ON r.reviewee_id = a.user_id AND r.is_verified = true
`;

const hospitalAliasesSql = `CASE h.name
  WHEN 'National Hospital of Sri Lanka (NHSL)' THEN ARRAY['Colombo National Hospital']::text[]
  WHEN 'Teaching Hospital Kandy' THEN ARRAY['Kandy Teaching Hospital']::text[]
  WHEN 'Teaching Hospital Karapitiya' THEN ARRAY['Karapitiya General Hospital']::text[]
  WHEN 'Teaching Hospital Kurunegala' THEN ARRAY['Kurunegala Base Hospital']::text[]
  WHEN 'Teaching Hospital Jaffna' THEN ARRAY['Jaffna Teaching Hospital']::text[]
  ELSE ARRAY[]::text[]
END`;

const addFilter = (filters, values, clause, value) => {
  values.push(value);
  filters.push(clause.replace('?', `$${values.length}`));
};

export const createMarketplaceRouter = ({ query, pool, requireAuth, createErrorResponse }) => {
  const router = express.Router();

  const handleError = (res, error, message = 'The request could not be completed') => {
    if (error.code === '23503') return createErrorResponse(res, 400, 'INVALID_HOSPITAL_ID', 'A referenced record does not exist');
    if (error.code === '23505') return createErrorResponse(res, 409, 'DUPLICATE_ENTRY', 'A conflicting record already exists');
    return createErrorResponse(res, 500, 'SERVER_ERROR', message);
  };

  const requireAdmin = (req, res, next) => {
    if (req.user.userType !== 'admin') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Administrator access is required');
    return next();
  };

  router.get('/admin/dashboard', requireAuth, requireAdmin, async (req, res) => {
    try {
      const [summaryResult, caregiversResult, reviewsResult] = await Promise.all([
        query(`SELECT
          (SELECT COUNT(*)::int FROM users WHERE user_type <> 'admin') AS "totalUsers",
          (SELECT COUNT(*)::int FROM caregiver_profiles) AS "totalCaregivers",
          (SELECT COUNT(*) FILTER (WHERE is_verified)::int FROM caregiver_profiles) AS "verifiedCaregivers",
          (SELECT COUNT(*) FILTER (WHERE NOT is_verified)::int FROM caregiver_profiles) AS "pendingCaregivers",
          (SELECT COUNT(*)::int FROM agency_profiles) AS "totalAgencies",
          (SELECT COUNT(*)::int FROM hospitals) AS "totalHospitals",
          (SELECT COUNT(*)::int FROM inquiries) AS "totalInquiries",
          (SELECT COUNT(*)::int FROM reviews) AS "totalReviews",
          (SELECT COUNT(*) FILTER (WHERE NOT is_verified)::int FROM reviews) AS "pendingReviews"`),
        query(`${caregiverSelect} GROUP BY c.id, h.id ORDER BY c.created_at DESC`),
        query(`SELECT r.id, r.reviewer_id AS "reviewerId", u.full_name AS "reviewerName",
                      r.reviewee_id AS "revieweeId", r.reviewee_type AS "revieweeType",
                      COALESCE(c.full_name, a.agency_name, 'Unknown profile') AS "revieweeName",
                      r.rating, r.title, r.comment, r.hospital_name AS "hospitalName",
                      r.is_verified AS "isVerified", r.created_at AS "createdAt"
               FROM reviews r
               JOIN users u ON u.id = r.reviewer_id
               LEFT JOIN caregiver_profiles c ON c.user_id = r.reviewee_id
               LEFT JOIN agency_profiles a ON a.user_id = r.reviewee_id
               ORDER BY r.created_at DESC`)
      ]);
      res.json({
        success: true,
        summary: summaryResult.rows[0],
        caregivers: caregiversResult.rows,
        reviews: reviewsResult.rows
      });
    } catch (error) {
      handleError(res, error, 'Could not load administrator dashboard');
    }
  });

  router.patch('/admin/reviews/:review_id/verification', requireAuth, requireAdmin, async (req, res) => {
    if (typeof req.body.is_verified !== 'boolean') {
      return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'is_verified must be a boolean');
    }
    try {
      const { rows } = await query(
        'UPDATE reviews SET is_verified = $2 WHERE id::text = $1 RETURNING id, is_verified AS "isVerified"',
        [req.params.review_id, req.body.is_verified]
      );
      if (!rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Review not found');
      res.json({ success: true, review: rows[0] });
    } catch (error) {
      handleError(res, error, 'Could not update review visibility');
    }
  });

  router.get('/hospitals', async (req, res) => {
    try {
      const { rows } = await query(
        `SELECT h.id, h.name, ${hospitalAliasesSql} AS aliases, h.location, h.district,
                h.latitude, h.longitude, h.hospital_type AS "hospitalType", h.phone
         FROM hospitals h ORDER BY h.district, h.name`
      );
      res.json({ success: true, hospitals: rows });
    } catch (error) {
      handleError(res, error, 'Could not load hospitals');
    }
  });

  router.get('/hospitals/search', async (req, res) => {
    const term = `%${String(req.query.query || '').trim()}%`;
    try {
      const { rows } = await query(
        `SELECT h.id, h.name, ${hospitalAliasesSql} AS aliases, h.location, h.district,
                h.latitude, h.longitude, h.hospital_type AS "hospitalType", h.phone
         FROM hospitals h
         WHERE h.name ILIKE $1 OR h.location ILIKE $1 OR h.district ILIKE $1
            OR EXISTS (SELECT 1 FROM unnest(${hospitalAliasesSql}) AS alias(name) WHERE alias.name ILIKE $1)
         ORDER BY CASE WHEN lower(h.name) = lower($2) THEN 0 ELSE 1 END, h.name
         LIMIT 20`,
        [term, String(req.query.query || '').trim()]
      );
      res.json({ success: true, hospitals: rows });
    } catch (error) {
      handleError(res, error, 'Could not search hospitals');
    }
  });

  router.post('/hospitals/geocode', requireAuth, async (req, res) => {
    if (req.user.userType !== 'admin') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Administrator access is required');
    const address = String(req.body.address || '').trim();
    if (!address) return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Hospital address is required');
    if (!process.env.GOOGLE_MAPS_API_KEY) return createErrorResponse(res, 503, 'MAPS_NOT_CONFIGURED', 'Google Maps geocoding is not configured');
    try {
      const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
      url.searchParams.set('address', address);
      url.searchParams.set('region', 'lk');
      url.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY);
      const response = await fetch(url);
      const result = await response.json();
      const location = result.results?.[0]?.geometry?.location;
      if (!response.ok || result.status !== 'OK' || !location) {
        return createErrorResponse(res, 422, 'GEOCODING_FAILED', 'Google Maps could not resolve this address');
      }
      res.json({ success: true, latitude: location.lat, longitude: location.lng, formatted_address: result.results[0].formatted_address });
    } catch (error) {
      handleError(res, error, 'Could not geocode hospital address');
    }
  });

  router.post('/hospitals', requireAuth, async (req, res) => {
    if (req.user.userType !== 'admin') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Administrator access is required');
    const { name, location, district, hospital_type: hospitalType, phone } = req.body;
    if (!name || !location || !district || !['government', 'private'].includes(hospitalType)) {
      return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Name, location, district, and hospital type are required');
    }
    try {
      let latitude = Number(req.body.latitude);
      let longitude = Number(req.body.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        if (!process.env.GOOGLE_MAPS_API_KEY) return createErrorResponse(res, 503, 'MAPS_NOT_CONFIGURED', 'Google Maps geocoding is not configured');
        const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
        url.searchParams.set('address', `${location}, Sri Lanka`);
        url.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY);
        const response = await fetch(url);
        const result = await response.json();
        if (!response.ok || result.status !== 'OK' || !result.results?.[0]) {
          return createErrorResponse(res, 422, 'GEOCODING_FAILED', 'Google Maps could not resolve this address');
        }
        ({ lat: latitude, lng: longitude } = result.results[0].geometry.location);
      }
      const { rows: [hospital] } = await query(
        `INSERT INTO hospitals (name, location, district, latitude, longitude, hospital_type, phone)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         RETURNING id, name, location, district, latitude, longitude, hospital_type AS "hospitalType", phone`,
        [name.trim(), location.trim(), district.trim(), latitude, longitude, hospitalType, phone || null]
      );
      res.status(201).json({ success: true, hospital });
    } catch (error) {
      handleError(res, error, 'Could not add hospital');
    }
  });

  router.get('/search', async (req, res) => {
    const values = [];
    const filters = ['c.is_active = true'];
    const {
      hospital_id: hospitalId, age_min: ageMin, age_max: ageMax, availability,
      price_min: priceMin, price_max: priceMax, district, gender, available_on: availableOn,
      radius_km: radiusKm
    } = req.query;
    if (hospitalId) {
      values.push(hospitalId, hospitalId);
      filters.push(`(c.primary_hospital_id::text = $${values.length - 1} OR c.secondary_hospitals @> jsonb_build_array($${values.length}::text))`);
    }
    if (ageMin) addFilter(filters, values, 'c.age >= ?', Number(ageMin));
    if (ageMax) addFilter(filters, values, 'c.age <= ?', Number(ageMax));
    if (availability && availability !== 'all') addFilter(filters, values, 'c.availability_type = ?', availability);
    if (district && district !== 'All Districts') addFilter(filters, values, 'h.district = ?', district);
    if (gender && gender !== 'all') addFilter(filters, values, 'c.gender = ?', gender);
    if (availableOn) {
      values.push(availableOn);
      filters.push(`EXISTS (SELECT 1 FROM availability av WHERE av.caregiver_id = c.id AND av.date = $${values.length} AND av.is_available = true)`);
    }
    if (hospitalId && Number.isFinite(Number(radiusKm))) {
      values.push(hospitalId, Number(radiusKm));
      filters.push(`EXISTS (
        SELECT 1 FROM hospitals origin
        WHERE origin.id::text = $${values.length - 1}
          AND 6371 * acos(LEAST(1, GREATEST(-1,
            sin(radians(origin.latitude::float8)) * sin(radians(h.latitude::float8)) +
            cos(radians(origin.latitude::float8)) * cos(radians(h.latitude::float8)) *
            cos(radians(origin.longitude::float8 - h.longitude::float8))
          ))) <= $${values.length}
      )`);
    }
    if (priceMin) {
      values.push(Number(priceMin), Number(priceMin));
      filters.push(`(c.price_per_hour >= $${values.length - 1} OR c.price_per_day >= $${values.length})`);
    }
    if (priceMax) {
      values.push(Number(priceMax), Number(priceMax));
      filters.push(`(c.price_per_hour <= $${values.length - 1} OR c.price_per_day <= $${values.length})`);
    }

    const sortOptions = {
      rating: 'rating DESC, c.created_at DESC',
      price_asc: 'c.price_per_day ASC',
      price_desc: 'c.price_per_day DESC',
      newest: 'c.created_at DESC'
    };
    const sort = sortOptions[req.query.sort_by] || sortOptions.newest;
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    try {
      const { rows } = await query(
        `${caregiverSelect}
         WHERE ${filters.join(' AND ')}
         GROUP BY c.id, h.id
         ORDER BY ${sort}
         LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values
      );
      const countValues = values.slice(0, -2);
      const countResult = await query(
        `SELECT COUNT(*)::int AS total_count
         FROM caregiver_profiles c JOIN hospitals h ON h.id = c.primary_hospital_id
         WHERE ${filters.join(' AND ')}`,
        countValues
      );
      const totalCount = countResult.rows[0].total_count;
      res.json({ success: true, results: rows, total_count: totalCount, page, has_more: offset + rows.length < totalCount });
    } catch (error) {
      handleError(res, error, 'Could not search caregiver profiles');
    }
  });

  router.get('/caregivers/me', requireAuth, async (req, res) => {
    try {
      const { rows } = await query(
        `${caregiverSelect} WHERE c.user_id = $1 GROUP BY c.id, h.id LIMIT 1`,
        [req.user.id]
      );
      if (!rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Caregiver profile not found');
      res.json({ success: true, caregiver: rows[0] });
    } catch (error) {
      handleError(res, error, 'Could not load caregiver profile');
    }
  });

  router.get('/caregivers/:caregiver_id', async (req, res) => {
    try {
      const { rows } = await query(
        `${caregiverSelect}
         WHERE c.id::text = $1 OR c.user_id::text = $1
         GROUP BY c.id, h.id LIMIT 1`,
        [req.params.caregiver_id]
      );
      if (!rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Caregiver profile not found');
      res.json({ success: true, caregiver: rows[0] });
    } catch (error) {
      handleError(res, error, 'Could not load caregiver profile');
    }
  });

  router.patch('/caregivers/:caregiver_id/verification', requireAuth, async (req, res) => {
    if (req.user.userType !== 'admin') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Administrator access is required');
    try {
      const { rows } = await query(
        'UPDATE caregiver_profiles SET is_verified = $2 WHERE id::text = $1 RETURNING id',
        [req.params.caregiver_id, !!req.body.is_verified]
      );
      if (!rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Caregiver profile not found');
      res.json({ success: true });
    } catch (error) {
      handleError(res, error, 'Could not update verification status');
    }
  });

  router.patch('/users/:user_id/verification', requireAuth, async (req, res) => {
    if (req.user.userType !== 'admin') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Administrator access is required');
    try {
      const { rows } = await query(
        'UPDATE users SET is_verified = $2 WHERE id::text = $1 RETURNING id',
        [req.params.user_id, !!req.body.is_verified]
      );
      if (!rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'User not found');
      res.json({ success: true });
    } catch (error) {
      handleError(res, error, 'Could not update user verification status');
    }
  });

  router.post('/caregivers/create', requireAuth, async (req, res) => {
    const body = req.body;
    if (req.user.userType !== 'individual') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Only caregiver accounts can create caregiver profiles');
    if (!body.full_name || !body.primary_hospital_id || !Number.isFinite(Number(body.age))) {
      return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Full name, age, and primary hospital are required');
    }
    try {
      const { rows: [profile] } = await query(
        `INSERT INTO caregiver_profiles
          (user_id, full_name, age, gender, bio, primary_hospital_id, secondary_hospitals,
           price_per_hour, price_per_day, price_per_shift, availability_type, experience_years,
           qualifications, specializations, languages, contact_phone, contact_email,
           contact_whatsapp, phone_number, whatsapp_number, email, profile_image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
         RETURNING id`,
        [req.user.id, body.full_name, body.age, body.gender || 'Female', body.bio || '', body.primary_hospital_id,
          JSON.stringify(body.secondary_hospitals || []), body.price_per_hour || 0, body.price_per_day || 0,
          body.price_per_shift || 0, body.availability_type || 'whole_day', body.experience_years || 0,
          body.qualifications || [], body.specializations || [], body.languages || [], body.contact_phone ?? true,
          body.contact_email ?? false, body.contact_whatsapp ?? true, body.phone_number || '',
          body.whatsapp_number || body.phone_number || '', body.email || '', body.profile_image_url || '']
      );
      res.status(201).json({ success: true, caregiver_id: profile.id, profile_status: 'created' });
    } catch (error) {
      handleError(res, error, 'Could not create caregiver profile');
    }
  });

  router.put('/caregivers/:caregiver_id', requireAuth, async (req, res) => {
    const columns = {
      full_name: 'full_name', age: 'age', gender: 'gender', bio: 'bio', primary_hospital_id: 'primary_hospital_id',
      secondary_hospitals: 'secondary_hospitals', price_per_hour: 'price_per_hour', price_per_day: 'price_per_day',
      price_per_shift: 'price_per_shift', availability_type: 'availability_type', experience_years: 'experience_years',
      qualifications: 'qualifications', specializations: 'specializations', languages: 'languages',
      contact_phone: 'contact_phone', contact_email: 'contact_email', contact_whatsapp: 'contact_whatsapp',
      phone_number: 'phone_number', whatsapp_number: 'whatsapp_number', email: 'email',
      profile_image_url: 'profile_image_url', is_active: 'is_active'
    };
    const entries = Object.entries(req.body).filter(([key]) => columns[key]);
    try {
      const owner = await query('SELECT user_id FROM caregiver_profiles WHERE id::text = $1', [req.params.caregiver_id]);
      if (!owner.rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Caregiver profile not found');
      if (owner.rows[0].user_id !== req.user.id && req.user.userType !== 'admin') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'You cannot edit this profile');
      if (!entries.length) return res.json({ success: true, updated_fields: [] });
      const values = entries.map(([key, value]) => key === 'secondary_hospitals' ? JSON.stringify(value) : value);
      const updates = entries.map(([key], index) => `${columns[key]} = $${index + 2}`).join(', ');
      const { rows } = await query(
        `UPDATE caregiver_profiles SET ${updates} WHERE id::text = $1 RETURNING id`,
        [req.params.caregiver_id, ...values]
      );
      res.json({ success: true, updated_fields: entries.map(([key]) => key) });
    } catch (error) {
      handleError(res, error, 'Could not update caregiver profile');
    }
  });

  router.get('/caregivers/:caregiver_id/availability', async (req, res) => {
    const month = typeof req.query.month === 'string' && /^\d{4}-\d{2}$/.test(req.query.month) ? req.query.month : '';
    const values = [req.params.caregiver_id];
    const monthFilter = month ? (() => {
      values.push(`${month}-01`);
      return 'AND date >= $2::date AND date < ($2::date + INTERVAL \'1 month\')';
    })() : '';
    try {
      const { rows } = await query(
        `SELECT id, caregiver_id AS "caregiverId", to_char(date, 'YYYY-MM-DD') AS date,
                is_available AS "isAvailable", time_slot AS "timeSlot", notes
         FROM availability WHERE caregiver_id::text = $1 ${monthFilter} ORDER BY date`,
        values
      );
      res.json({ success: true, caregiver_id: req.params.caregiver_id,
        booked_dates: rows.filter(slot => !slot.isAvailable).map(slot => slot.date),
        available_dates: rows.filter(slot => slot.isAvailable).map(slot => slot.date), calendar_data: rows });
    } catch (error) {
      handleError(res, error, 'Could not load caregiver availability');
    }
  });

  const saveAvailability = async (caregiverId, user, slots, res) => {
    const owner = await query('SELECT user_id FROM caregiver_profiles WHERE id::text = $1', [caregiverId]);
    if (!owner.rows[0]) {
      createErrorResponse(res, 404, 'NOT_FOUND', 'Caregiver profile not found');
      return false;
    }
    if (owner.rows[0].user_id !== user.id && user.userType !== 'admin') {
      createErrorResponse(res, 403, 'UNAUTHORIZED', 'You cannot update this caregiver calendar');
      return false;
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const slot of slots) {
        await client.query(
          `INSERT INTO availability (caregiver_id, date, is_available, time_slot, notes)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (caregiver_id, date) DO UPDATE
           SET is_available = EXCLUDED.is_available, time_slot = EXCLUDED.time_slot, notes = EXCLUDED.notes`,
          [owner.rows[0] ? caregiverId : null, slot.date, !!slot.is_available, slot.time_slot || 'whole_day', slot.notes || null]
        );
      }
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  router.post('/caregivers/:caregiver_id/availability/update', requireAuth, async (req, res) => {
    try {
      const saved = await saveAvailability(req.params.caregiver_id, req.user, [req.body], res);
      if (saved) res.json({ success: true });
    } catch (error) {
      handleError(res, error, 'Could not update availability');
    }
  });

  router.put('/caregivers/:caregiver_id/availability/bulk-update', requireAuth, async (req, res) => {
    if (!Array.isArray(req.body.dates) || req.body.dates.length > 366) {
      return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'dates must contain at most 366 availability entries');
    }
    try {
      const saved = await saveAvailability(req.params.caregiver_id, req.user, req.body.dates.map(slot => ({
        date: slot.date, is_available: slot.is_available, time_slot: slot.time_slot, notes: slot.notes
      })), res);
      if (saved) res.json({ success: true, updated_count: req.body.dates.length });
    } catch (error) {
      handleError(res, error, 'Could not update availability');
    }
  });

  const listReviews = async (res, userId, revieweeType) => {
    const { rows } = await query(
      `SELECT r.id, r.reviewer_id AS "reviewerId", u.full_name AS "reviewerName",
              r.reviewee_id AS "revieweeId", r.reviewee_type AS "revieweeType", r.rating,
              r.title, r.comment, r.hospital_name AS "hospitalName", r.is_verified AS "isVerified",
              r.created_at AS "createdAt"
       FROM reviews r JOIN users u ON u.id = r.reviewer_id
      WHERE r.reviewee_id = $1 AND r.reviewee_type = $2 AND r.is_verified = true ORDER BY r.created_at DESC`,
      [userId, revieweeType]
    );
    const average = rows.length ? rows.reduce((sum, review) => sum + review.rating, 0) / rows.length : 0;
    res.json({ success: true, reviews: rows, avg_rating: Number(average.toFixed(1)), total_reviews: rows.length });
  };

  router.get('/caregivers/:caregiver_id/reviews', async (req, res) => {
    try {
      const profile = await query('SELECT user_id FROM caregiver_profiles WHERE id::text = $1 OR user_id::text = $1 LIMIT 1', [req.params.caregiver_id]);
      if (!profile.rows[0]) return res.json({ success: true, reviews: [], avg_rating: 0, total_reviews: 0 });
      await listReviews(res, profile.rows[0].user_id, 'individual');
    } catch (error) {
      handleError(res, error, 'Could not load reviews');
    }
  });

  router.post('/reviews', requireAuth, async (req, res) => {
    const { reviewee_id: revieweeId, reviewee_type: revieweeType, rating, title, comment } = req.body;
    if (!revieweeId || !['individual', 'agency'].includes(revieweeType) || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 || !comment) {
      return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Reviewee, type, rating from 1 to 5, and comment are required');
    }
    try {
      const { rows: [reviewer] } = await query('SELECT user_type, is_verified FROM users WHERE id = $1', [req.user.id]);
      if (!reviewer || reviewer.user_type !== 'family') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Only family accounts can submit reviews');
      if (!reviewer.is_verified) return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Your family account must be verified before reviewing');
      const profileTable = revieweeType === 'individual' ? 'caregiver_profiles' : 'agency_profiles';
      const profile = await query(`SELECT user_id FROM ${profileTable} WHERE id::text = $1`, [revieweeId]);
      if (!profile.rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Profile to review was not found');
      const { rows: [review] } = await query(
        `INSERT INTO reviews (reviewer_id, reviewee_id, reviewee_type, rating, title, comment, hospital_name, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING id`,
        [req.user.id, profile.rows[0].user_id, revieweeType, Number(rating), title || '', comment, req.body.hospital_name || null]
      );
      res.status(201).json({ success: true, review_id: review.id });
    } catch (error) {
      handleError(res, error, 'Could not submit review');
    }
  });

  router.get('/agencies', async (req, res) => {
    try {
      const { rows } = await query(`${agencySelect} WHERE a.is_active = true GROUP BY a.id ORDER BY a.created_at DESC`);
      res.json({ success: true, agencies: rows });
    } catch (error) {
      handleError(res, error, 'Could not load agencies');
    }
  });

  router.get('/agencies/me', requireAuth, async (req, res) => {
    try {
      const { rows } = await query(`${agencySelect} WHERE a.user_id = $1 GROUP BY a.id LIMIT 1`, [req.user.id]);
      if (!rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Agency profile not found');
      const { rows: staff } = await query(
        `SELECT id, agency_id AS "agencyId", staff_name AS "staffName", staff_age AS "staffAge",
                gender, specialization, experience_years AS "experienceYears", contact_info AS "contactInfo",
                is_visible AS "isVisible", created_at AS "createdAt"
         FROM agency_staff WHERE agency_id = $1 ORDER BY created_at`,
        [rows[0].id]
      );
      res.json({ success: true, agency: { ...rows[0], staff } });
    } catch (error) {
      handleError(res, error, 'Could not load agency profile');
    }
  });

  router.post('/agencies/create', requireAuth, async (req, res) => {
    if (req.user.userType !== 'agency') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Only agency accounts can create agency profiles');
    const { agency_name: agencyName, primary_hospital_id: hospitalId } = req.body;
    if (!agencyName || !hospitalId) return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Agency name and primary hospital are required');
    try {
      const { rows: [agency] } = await query(
        `INSERT INTO agency_profiles (user_id, agency_name, description, num_caregivers, primary_hospital_id,
          price_range_min, price_range_max, contact_phone, contact_email, contact_whatsapp, show_staff_profiles, logo_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
        [req.user.id, agencyName, req.body.description || '', req.body.num_caregivers || 0, hospitalId,
          req.body.price_range_min || 0, req.body.price_range_max || 0, req.body.contact_phone || '',
          req.body.contact_email || '', req.body.contact_whatsapp || '', req.body.show_staff_profiles ?? false, req.body.logo_url || '']
      );
      res.status(201).json({ success: true, agency_id: agency.id, profile_status: 'created' });
    } catch (error) {
      handleError(res, error, 'Could not create agency profile');
    }
  });

  router.get('/agencies/:agency_id', async (req, res) => {
    try {
      const { rows } = await query(`${agencySelect} WHERE a.id::text = $1 OR a.user_id::text = $1 GROUP BY a.id LIMIT 1`, [req.params.agency_id]);
      if (!rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Agency profile not found');
      const staff = rows[0].showStaffProfiles
        ? await query(`SELECT id, agency_id AS "agencyId", staff_name AS "staffName", staff_age AS "staffAge", gender, specialization, experience_years AS "experienceYears", contact_info AS "contactInfo", is_visible AS "isVisible", created_at AS "createdAt" FROM agency_staff WHERE agency_id = $1 AND is_visible = true ORDER BY created_at`, [rows[0].id])
        : { rows: [] };
      res.json({ success: true, agency: { ...rows[0], staff: staff.rows } });
    } catch (error) {
      handleError(res, error, 'Could not load agency profile');
    }
  });

  router.put('/agencies/:agency_id', requireAuth, async (req, res) => {
    const columns = {
      agency_name: 'agency_name', registration_number: 'registration_number', description: 'description',
      num_caregivers: 'num_caregivers', primary_hospital_id: 'primary_hospital_id',
      secondary_hospitals: 'secondary_hospitals', price_range_min: 'price_range_min', price_range_max: 'price_range_max',
      contact_phone: 'contact_phone', contact_email: 'contact_email', contact_whatsapp: 'contact_whatsapp',
      show_staff_profiles: 'show_staff_profiles', logo_url: 'logo_url', services: 'services', is_active: 'is_active'
    };
    const entries = Object.entries(req.body).filter(([key]) => columns[key]);
    try {
      const owner = await query('SELECT user_id FROM agency_profiles WHERE id::text = $1', [req.params.agency_id]);
      if (!owner.rows[0]) return createErrorResponse(res, 404, 'NOT_FOUND', 'Agency profile not found');
      if (owner.rows[0].user_id !== req.user.id && req.user.userType !== 'admin') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'You cannot edit this agency');
      if (!entries.length) return res.json({ success: true, updated_fields: [] });
      const updates = entries.map(([key], index) => `${columns[key]} = $${index + 2}`).join(', ');
      const { rows } = await query(
        `UPDATE agency_profiles SET ${updates} WHERE id::text = $1 RETURNING id`,
        [req.params.agency_id, ...entries.map(([key, value]) => key === 'secondary_hospitals' ? JSON.stringify(value) : value)]
      );
      res.json({ success: true, updated_fields: entries.map(([key]) => key) });
    } catch (error) {
      handleError(res, error, 'Could not update agency profile');
    }
  });

  router.get('/agencies/:agency_id/staff', async (req, res) => {
    try {
      const { rows } = await query(
        `SELECT s.id, s.staff_name AS "staffName", s.staff_age AS "staffAge", s.specialization,
                s.experience_years AS "experienceYears", s.contact_info AS "contactInfo"
         FROM agency_staff s JOIN agency_profiles a ON a.id = s.agency_id
         WHERE a.id::text = $1 AND a.show_staff_profiles = true AND s.is_visible = true`,
        [req.params.agency_id]
      );
      res.json({ success: true, staff: rows });
    } catch (error) {
      handleError(res, error, 'Could not load agency staff');
    }
  });

  router.post('/agencies/:agency_id/staff', requireAuth, async (req, res) => {
    const { staff_name: staffName, staff_age: staffAge, specialization } = req.body;
    if (!staffName || !Number.isInteger(Number(staffAge)) || Number(staffAge) < 18) {
      return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Staff name and valid age are required');
    }
    try {
      const { rows: [staff] } = await query(
        `WITH added_staff AS (
           INSERT INTO agency_staff (agency_id, staff_name, staff_age, gender, specialization, experience_years, contact_info)
           SELECT id, $3, $4, $5, $6, $7, $8 FROM agency_profiles WHERE id::text = $1 AND user_id = $2
           RETURNING id, agency_id
         )
         UPDATE agency_profiles SET num_caregivers = num_caregivers + 1
         FROM added_staff WHERE agency_profiles.id = added_staff.agency_id
         RETURNING added_staff.id`,
        [req.params.agency_id, req.user.id, staffName, Number(staffAge), req.body.gender || 'Female', specialization || '', req.body.experience_years || 0, req.body.contact_info || {}]
      );
      if (!staff) return createErrorResponse(res, 404, 'NOT_FOUND', 'Agency not found or not owned by this user');
      res.status(201).json({ success: true, staff_id: staff.id });
    } catch (error) {
      handleError(res, error, 'Could not add agency staff');
    }
  });

  router.get('/agencies/:agency_id/reviews', async (req, res) => {
    try {
      const profile = await query('SELECT user_id FROM agency_profiles WHERE id::text = $1 OR user_id::text = $1 LIMIT 1', [req.params.agency_id]);
      if (!profile.rows[0]) return res.json({ success: true, reviews: [], avg_rating: 0, total_reviews: 0 });
      await listReviews(res, profile.rows[0].user_id, 'agency');
    } catch (error) {
      handleError(res, error, 'Could not load reviews');
    }
  });

  router.post('/inquiries', requireAuth, async (req, res) => {
    const { caregiver_id: caregiverId, agency_id: agencyId, family_name: familyName, phone, hospital_name: hospitalName, shift_needed: shiftNeeded, start_date: startDate, contact_method_used: contactMethod } = req.body;
    if (req.user.userType !== 'family') return createErrorResponse(res, 403, 'UNAUTHORIZED', 'Only family accounts can submit inquiries');
    if ((!caregiverId && !agencyId) || !familyName || !phone || !hospitalName || !shiftNeeded || !startDate || !['whatsapp', 'phone', 'email'].includes(contactMethod)) {
      return createErrorResponse(res, 400, 'VALIDATION_ERROR', 'Required inquiry details are missing');
    }
    try {
      const { rows: [inquiry] } = await query(
        `INSERT INTO inquiries (requester_id, caregiver_id, agency_id, family_name, patient_name, phone, hospital_name, shift_needed, start_date, message, contact_method_used)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id, created_at AS "createdAt"`,
        [req.user.id, caregiverId || null, agencyId || null, familyName, req.body.patient_name || null, phone, hospitalName, shiftNeeded, startDate, req.body.message || null, contactMethod]
      );
      res.status(201).json({ success: true, inquiry });
    } catch (error) {
      handleError(res, error, 'Could not submit inquiry');
    }
  });

  router.get('/inquiries/me', requireAuth, async (req, res) => {
    try {
      const { rows } = await query(
        `SELECT i.id, i.caregiver_id AS "caregiverId", i.agency_id AS "agencyId", i.family_name AS "familyName",
                i.patient_name AS "patientName", i.phone, i.hospital_name AS "hospitalName", i.shift_needed AS "shiftNeeded",
                to_char(i.start_date, 'YYYY-MM-DD') AS "startDate", i.message,
                i.contact_method_used AS "contactMethodUsed", i.created_at AS "createdAt"
         FROM inquiries i
         LEFT JOIN caregiver_profiles c ON c.id = i.caregiver_id
         LEFT JOIN agency_profiles a ON a.id = i.agency_id
        WHERE i.requester_id = $1
          OR i.caregiver_id IN (SELECT id FROM caregiver_profiles WHERE user_id = $1)
            OR i.agency_id IN (SELECT id FROM agency_profiles WHERE user_id = $1)
         ORDER BY i.created_at DESC`,
        [req.user.id]
      );
      res.json({ success: true, inquiries: rows });
    } catch (error) {
      handleError(res, error, 'Could not load inquiries');
    }
  });

  return router;
};