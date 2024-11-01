import { GoogleGenerativeAI } from '@google/generative-ai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Interfaces
interface ReviewEvaluationResponse {
  approvedByModel: boolean;
  reason?: string;
}

interface TagGenerationResponse {
  tags: string[];
}

// Ref Doc: https://ai.google.dev/gemini-api/docs/safety-settings#node.js
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// Main Class
class GoogleGenerativeAIService {
  private model: any;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Ref Doc: https://ai.google.dev/gemini-api/docs/text-generation?lang=node
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'You are a compliance and policy analyst. Your job is to determine if submitted reviews comply with specific policies.',
      generationConfig: {
        responseMimeType: 'application/json',
        candidateCount: 1,
        temperature: 0.2,
      },
    });
  }

  public async evaluateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt, safetySettings);
    return result.response.text();
  }

  public async generateTags(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt, safetySettings);
    return result.response.text();
  }
}

// Class to be exported
class ReviewEvaluator {
  private aiService: GoogleGenerativeAIService;

  constructor(apiKey: string) {
    this.aiService = new GoogleGenerativeAIService(apiKey);
  }

  private constructPrompt(reviewContent: string, policies: string[]): string {
    const policyList = policies.map((policy, index) => `Policy ${index + 1}: ${policy}`).join(', ');

    return `
      You are analyzing whether the following review content adheres to a set of clearly defined policies. 
      Carefully review each policy against the content and provide a strictly JSON-formatted response as shown below:
      
      {
        "approvedByModel": true/false,
        "reason": "If approved, omit this field. If disapproved, specify which policy was violated and explain why the content was flagged, focusing on the detected violation."
      }
      
      Review Content: "${reviewContent}"
      
      Policies: [${policyList}]
      
      Important: Only respond with a JSON object in the specified format. Avoid any additional commentary or information outside the JSON structure.
    `;
  }

  public async evaluateReview(
    reviewContent: string,
    policies: string[]
  ): Promise<ReviewEvaluationResponse> {
    const prompt = this.constructPrompt(reviewContent, policies);

    try {
      const jsonResponse = await this.aiService.evaluateContent(prompt);
      return JSON.parse(jsonResponse) as ReviewEvaluationResponse;
    } catch (error) {
      if (this.isErrorWithMessage(error)) {
        if (error.message.includes('Candidate was blocked due to SAFETY')) {
          return {
            approvedByModel: false,
            reason: 'Content too explicit.',
          };
        }
      }

      console.error('Error evaluating review:', error);
      return {
        approvedByModel: false,
        reason: 'An error occurred during policy evaluation.',
      };
    }
  }

  private constructTagPrompt(reviews: string[]): string {
    return `
      You are tasked with generating insightful and relevant tags for each of the following student reviews. 
      The tags should capture the essence of the review and reflect the educational experience, learning outcomes, 
      and aspects that would be beneficial for students considering this course or professor.
 
      Provide a list of tags in the format below:

      Review 1: "${reviews[0]}"
      Review 2: "${reviews[1]}"
      Review 3: "${reviews[2]}"
      Review 4: "${reviews[3]}"
      Review 5: "${reviews[4]}"

      Format your response as a JSON object:
      {
        "tags": [
          "Tag for Review 1",
          "Tag for Review 2",
          "Tag for Review 3",
          "Tag for Review 4",
          "Tag for Review 5"
        ]
      }

      Important: Only respond with a JSON object in the specified format. Avoid any additional commentary or information outside the JSON structure.
    `;
  }

  private isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }

  public async generateTags(reviews: string[]): Promise<TagGenerationResponse> {
    const prompt = this.constructTagPrompt(reviews);

    try {
      const jsonResponse = await this.aiService.generateTags(prompt);
      return JSON.parse(jsonResponse) as TagGenerationResponse;
    } catch (error) {
      console.error('Error generating tags:', error);
      if (this.isErrorWithMessage(error)) {
        console.error('Error message:', error.message);
      }
      return {
        tags: [],
      };
    }
  }
}

const apiKey = process.env['GOOGLE_GEMINI_API_KEY'] || '';
const reviewEvaluator = new ReviewEvaluator(apiKey);

const reviewContent = 'This prof is a motherfucker jackass at grading.';
const policies = ['No offensive language.', 'Avoid personal attacks.', 'Ensure factual accuracy.'];

reviewEvaluator.evaluateReview(reviewContent, policies).then((result) => console.log(result));

const reviews = [
  'Excellent course! Used AWS a lot',
  'The course was too difficult. Javascript was hard.',
  'Loved the group projects.',
  'The lectures were boring.',
];
reviewEvaluator.generateTags(reviews).then((result) => console.log(result));

export { ReviewEvaluator };
