

export const GET_UPCOMING_APPOINTMENTS = `
  SELECT 
    a.id,
    a.doctor_id,
    a.date,
    a.time,
    d.name as doctor_name,
    s.name as specialty_name
  FROM appointments a
  JOIN doctors d ON a.doctor_id = d.id
  JOIN doctor_specialties ds ON d.id = ds.doctor_id
  JOIN specialties s ON ds.specialty_id = s.id
  WHERE a.user_id = ?
    AND(
      a.date > ? 
      OR (a.date = ? AND a.time >= ?)
    )
  ORDER BY a.date, a.time
`;

export const GET_APPOINTMENT_HISTORY = `
  SELECT 
    a.id,
    a.doctor_id,
    a.date,
    a.time,
    d.name AS doctor_name,
    s.name AS specialty_name
  FROM appointments a
  JOIN doctors d ON a.doctor_id = d.id
  JOIN doctor_specialties ds ON d.id = ds.doctor_id
  JOIN specialties s ON ds.specialty_id = s.id
  WHERE a.user_id = ?
    AND (
      a.date < ? OR 
      (a.date = ? AND a.time < ?)
    )
  ORDER BY a.date DESC, a.time DESC
`;

export const GET_AVALIABLE_SLOTS_BY_DOCTOR_ID = ` 
SELECT
    a.id,
    a.date,
    a.time
FROM appointments a
WHERE a.doctor_id = ?
  AND a.user_id IS NULL
  AND (
    a.date > ? 
    OR (a.date = ? AND a.time >= ?)
  )
ORDER BY a.date, a.time;
`

export const UPDATE_APPOINTMENT_USER_ID = `
UPDATE appointments
SET user_id = ?
WHERE id=?;
`

export const GET_SPECIALTIES_LIST= `
SELECT * 
FROM specialties
`

export const GET_DOCTORS_LIST_BY_SPECIALTY= `
SELECT b.id, b.name
FROM doctor_specialties AS a
JOIN doctors AS b 
  ON a.doctor_id = b.id
WHERE a.specialty_id = ?;
`

export const GET_USER_BY_PHONE =`
SELECT *
FROM users
WHERE phone = ?
`

export const INPUT_NEW_USER = `
INSERT INTO users (id, phone) VALUES (?, ?)
`