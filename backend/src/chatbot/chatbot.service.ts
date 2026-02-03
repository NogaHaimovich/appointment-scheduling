import OpenAI from "openai";
import { getAllSpecialties, getDoctorsBySpecialty } from "../specialties/specialties.service";

// Lazy initialization of OpenAI client - only create if API key is available
function getOpenAIClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new OpenAI({ apiKey });
}



export async function getResponseFromChatbot(message: string) {
    try {
        const openai = getOpenAIClient();
        if (!openai) {
            console.warn("OpenAI API key not configured. Chatbot feature is disabled.");
            return "I'm sorry, the chatbot feature is currently unavailable. Please contact us directly for assistance.";
        }

        const specialties = await getAllSpecialties();
        const doctorsPerSpecialty = await Promise.all(
            specialties.map(async (specialty) => {
                const doctors = await getDoctorsBySpecialty(specialty.id);
                return { specialty: specialty.specialty_name, doctors };
            })
        );

        const specialtyList = specialties.map(s => `- ${s.specialty_name}: ${s.description}`).join('\n');
        const doctorsList = doctorsPerSpecialty.map(entry => {
            const doctorNames = entry.doctors.map(doc => doc.name).join(', ');
            return `- ${entry.specialty}: ${doctorNames}`;
        }).join('\n');

   
        const systemPrompt = `You are a helpful medical appointment booking assistant for our clinic.

        Our available specialties are:
        ${specialtyList}

        Our doctors by specialty:
        ${doctorsList}

        When users ask about our specialties, services, or doctors, provide this information in a friendly, conversational way.
        Keep responses concise and helpful.
        If asked about topics outside of medical appointments and our services, appolagize and politely redirect to appointment-related questions.

        Formats rules: 
        - Use bullet points for lists.
        - write with short sentences. add breaks between sentences.
`

        const bot_response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });

        return bot_response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);

        if (error instanceof Error && error.message.includes('database')) {
            return "I'm having trouble accessing our system right now. Please try again in a moment.";
        }

        return "Sorry, I'm having trouble responding right now.";
    }
}