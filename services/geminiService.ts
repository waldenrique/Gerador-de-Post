import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedPost } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateTextPrompt = (businessType: string, postSummary: string): string => {
  return `Você é um especialista em marketing de mídia social. Para um negócio do tipo "${businessType}", crie um post para o Instagram sobre o seguinte tópico: "${postSummary}".
  Gere um título curto e cativante (máximo de 10 palavras) e uma descrição envolvente (entre 40 e 60 palavras) com 3 a 5 hashtags relevantes e populares.
  Formate a resposta como um JSON com as chaves "title" e "description". A descrição deve usar quebras de linha para melhor legibilidade.`;
};

const generateImagePrompt = (businessType: string, postSummary: string, title: string): string => {
  return `Fotografia profissional e vibrante para um post de Instagram para um(a) ${businessType}. O post tem o título "${title}" e é sobre: ${postSummary}.
  O estilo deve ser chamativo, de alta qualidade e atraente para o público de redes sociais. Foco no produto/serviço. Fotografia cinematográfica, iluminação dramática.
  CRÍTICO: A imagem gerada NÃO DEVE CONTER NENHUM TEXTO, LETRA, LOGOTIPO ou MARCA D'ÁGUA. Apenas a imagem.`;
};

export const generateInstagramPost = async (businessType: string, postSummary: string): Promise<GeneratedPost> => {
  try {
    // Step 1: Generate Title and Description
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: generateTextPrompt(businessType, postSummary),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "O título cativante para o post."
            },
            description: {
              type: Type.STRING,
              description: "A descrição detalhada com hashtags."
            }
          },
          required: ["title", "description"]
        },
        temperature: 0.8,
      },
    });

    const textData = JSON.parse(textResponse.text);
    const { title, description } = textData;

    if (!title || !description) {
      throw new Error("Failed to generate valid title or description.");
    }

    // Step 2: Generate Image based on the generated text
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: generateImagePrompt(businessType, postSummary, title),
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
        throw new Error("Image generation failed.");
    }
    
    const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { title, description, imageUrl };
  } catch (error) {
    console.error("Error generating Instagram post:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error("An unknown error occurred during post generation.");
  }
};