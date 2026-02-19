import { getResponseFromChatbot } from "../chatbot.service";
import { getAllSpecialties, getDoctorsBySpecialty } from "../../specialties/specialties.service";

const mockCreate = jest.fn();

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

jest.mock("../../specialties/specialties.service", () => ({
  getAllSpecialties: jest.fn(),
  getDoctorsBySpecialty: jest.fn(),
}));

const mockSpecialties = [
  { id: 1, specialty_name: "Cardiology", description: "Heart care" },
  { id: 2, specialty_name: "Dermatology", description: "Skin care" },
];

const mockDoctors: Record<number, { id: number; name: string }[]> = {
  1: [{ id: 1, name: "Dr. Smith" }],
  2: [{ id: 2, name: "Dr. Jones" }],
};

describe("Chatbot Service tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, OPENAI_API_KEY: "test-key" };

    (getAllSpecialties as jest.Mock).mockResolvedValue(mockSpecialties);
    (getDoctorsBySpecialty as jest.Mock).mockImplementation((id: number) =>
      Promise.resolve(mockDoctors[id] || [])
    );
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should return unavailable message when API key is not configured", async () => {
    delete process.env.OPENAI_API_KEY;

    const result = await getResponseFromChatbot("Hello");

    expect(result).toBe(
      "I'm sorry, the chatbot feature is currently unavailable. Please contact us directly for assistance."
    );
    expect(getAllSpecialties).not.toHaveBeenCalled();
  });

  it("should return chatbot response on success", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "Hello! How can I help you?" } }],
    });

    const result = await getResponseFromChatbot("What specialties do you offer?");

    expect(result).toBe("Hello! How can I help you?");
    expect(getAllSpecialties).toHaveBeenCalledTimes(1);
    expect(getDoctorsBySpecialty).toHaveBeenCalledTimes(2);
    expect(getDoctorsBySpecialty).toHaveBeenCalledWith(1);
    expect(getDoctorsBySpecialty).toHaveBeenCalledWith(2);
    expect(mockCreate).toHaveBeenCalledWith({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: expect.stringContaining("Cardiology") },
        { role: "user", content: "What specialties do you offer?" },
      ],
    });
  });

  it("should include doctor names in the system prompt", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "response" } }],
    });

    await getResponseFromChatbot("Tell me about doctors");

    const systemMessage = mockCreate.mock.calls[0][0].messages[0].content;
    expect(systemMessage).toContain("Dr. Smith");
    expect(systemMessage).toContain("Dr. Jones");
    expect(systemMessage).toContain("Dermatology");
  });

  it("should return fallback message when OpenAI returns empty content", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const result = await getResponseFromChatbot("Hello");

    expect(result).toBe("Sorry, I couldn't generate a response.");
  });

  it("should return database error message when a database error occurs", async () => {
    (getAllSpecialties as jest.Mock).mockRejectedValue(new Error("database connection failed"));

    const result = await getResponseFromChatbot("Hello");

    expect(result).toBe(
      "I'm having trouble accessing our system right now. Please try again in a moment."
    );
  });

  it("should return generic error message for non-database errors", async () => {
    mockCreate.mockRejectedValue(new Error("rate limit exceeded"));

    const result = await getResponseFromChatbot("Hello");

    expect(result).toBe("Sorry, I'm having trouble responding right now.");
  });
});
