

export const GET_UPCOMING_APPOINTMENTS = `
  SELECT 
    a.id,
    a.doctor_id,
    a.date,
    a.time,
    d.name as doctor_name,
    s.name as specialty_name,
    a.patient_id,
    a.patient_name
  FROM appointments a
  JOIN doctors d ON a.doctor_id = d.id
  JOIN doctor_specialties ds ON d.id = ds.doctor_id
  JOIN specialties s ON ds.specialty_id = s.id
  WHERE a.account_id = ?
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
    s.name AS specialty_name,
    a.patient_id,
    a.patient_name
  FROM appointments a
  JOIN doctors d ON a.doctor_id = d.id
  JOIN doctor_specialties ds ON d.id = ds.doctor_id
  JOIN specialties s ON ds.specialty_id = s.id
  WHERE a.account_id = ?
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
  AND a.account_id IS NULL
  AND (
    a.date > ? 
    OR (a.date = ? AND a.time >= ?)
  )
ORDER BY a.date, a.time;
`

export const UPDATE_APPOINTMENT_ACCOUNT_ID = `
UPDATE appointments
SET account_id = ?, patient_id = ?, patient_name = ?
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

export const GET_ACCOUNT_BY_PHONE =`
SELECT *
FROM accounts
WHERE phone = ?
`

export const GET_ACCOUNT_BY_ID =`
SELECT id, phone, name
FROM accounts
WHERE id = ?
`

export const INPUT_NEW_ACCOUNT = `
INSERT INTO accounts (id, phone, name) VALUES (?, ?, ?)
`

export const INPUT_NEW_PATIENT = `
INSERT INTO patients (id, account_id, patient_name, relationship) VALUES (?, ?, ?, ?)
`

export const GET_APPOINTMENT_BY_ID = `
SELECT patient_name, patient_id, account_id
FROM appointments
WHERE id = ?
`

export const GET_PATIENT_BY_ACCOUNT_ID = `
SELECT id, patient_name, relationship
FROM patients
WHERE account_id = ? AND relationship = 'self'
LIMIT 1
`

export const GET_PATIENTS_BY_ACCOUNT_ID = `
SELECT id, patient_name, relationship
FROM patients
WHERE account_id = ?
ORDER BY relationship = 'self' DESC, patient_name ASC
`

export const GET_NEXT_AVAILABLE_APPOINTMENT_DATE = `
SELECT *
FROM appointments
WHERE doctor_id = ?
  AND account_id IS NULL
  AND (
    date > ? 
    OR (date = ? AND time >= ?)
  )
ORDER BY date ASC, time ASC
LIMIT 1;
`

export const  ADD_PATIENT_TO_ACCOUNT = `
INSERT INTO patients (account_id, patient_name, id, relationship) VALUES (?, ?, ?, ?)`

export const REMOVE_PATIENT_FROM_UPCOMING_APPOINTMENTS = `
UPDATE appointments
SET patient_id = NULL, patient_name = NULL, account_id=NULL
WHERE patient_id = ? 
  AND account_id = ?
  AND (
    date > ? 
    OR (date = ? AND time >= ?)
  )
`

export const DELETE_PATIENT_BY_ID = `
DELETE FROM patients
WHERE id = ? AND account_id = ? AND relationship != 'self'
`

export const GET_NEXT_APPOINTMENT_BY_PATIENT_ID = `
  SELECT 
    a.id,
    a.date,
    a.time,
    d.name as doctor_name
  FROM appointments a
  JOIN doctors d ON a.doctor_id = d.id
  WHERE a.patient_id = ?
    AND a.account_id IS NOT NULL
    AND (
      a.date > ? 
      OR (a.date = ? AND a.time >= ?)
    )
  ORDER BY a.date ASC, a.time ASC
  LIMIT 1
`