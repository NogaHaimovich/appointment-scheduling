import { formatDateToDisplay, formatDateToAPI, convertToGCalUTC } from "../dateFormat";

test("formatDateToDisplay: YYYY-MM-DD → DD-MM-YYYY", () => {
  expect(formatDateToDisplay("2025-12-20")).toBe("20.12.2025");
});

test("formatDateToAPI: DD-MM-YYYY → YYYY-MM-DD", () => {
  expect(formatDateToAPI("20-12-2025")).toBe("2025-12-20");
});

test("convertToGCalUTC: returns start and end in UTC format", () => {
  const result = convertToGCalUTC("2025-12-20", "14:30", 60);
  expect(result).toHaveProperty("start");
  expect(result).toHaveProperty("end");
});

test("convertToGCalUTC: returns null for invalid input", () => {
  expect(convertToGCalUTC("", "14:30")).toBeNull();
  expect(convertToGCalUTC("2025-12-20", "")).toBeNull();
});

test("formatDateToDisplay: returns empty string as-is", () => {
  expect(formatDateToDisplay("")).toBe("");
});

test("formatDateToDisplay: returns non-YYYY-MM-DD format as-is", () => {
  expect(formatDateToDisplay("20-12-2025")).toBe("20-12-2025");
});

test("convertToGCalUTC: returns null for invalid date format", () => {
  expect(convertToGCalUTC("invalid", "14:30")).toBeNull();
});

test("convertToGCalUTC: returns null for invalid time format", () => {
  expect(convertToGCalUTC("2025-12-20", "invalid")).toBeNull();
});