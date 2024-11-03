import { GoogleGenerativeAI } from '@google/generative-ai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const apiKey = process.env['NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY'] || '';

// Interfaces
interface ReviewEvaluationResponse {
  approvedByModel: boolean;
  reason?: string;
  violatedPolicyIndex?: number | null;
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

  constructor() {
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

  constructor() {
    this.aiService = new GoogleGenerativeAIService();
  }

  private constructPrompt(reviewContent: string, policies: string[]): string {
    const policyList = policies.map((policy, index) => `Policy ${index + 1}: ${policy}`).join(', ');

    /*
     * Policy list looks like this: ['Policy1 Name: Description1', 'Policy2 Name: Description2']
     */

    return `
      You are analyzing whether the following review content adheres to a set of clearly defined policies given below. 

      Here are the policies. Policy list looks like this: ['Policy1 Name: Description1', 'Policy2 Name: Description2']:
      Policies: [${policyList}]
      
      Carefully review each policy against the content below and provide a strictly JSON-formatted response as shown below:
      Review Content: "${reviewContent}"
      {
        "approvedByModel": true/false,
        "reason": "If approved, omit this field. If disapproved, specify which policy was violated (e.g., 'Policy 2 violated') and explain why the content was flagged, focusing on the detected violation."
      }
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
      const parsedResponse = JSON.parse(jsonResponse) as ReviewEvaluationResponse;

      // Check if the response contains the index of the violated policy
      if (!parsedResponse.approvedByModel && parsedResponse.reason) {
        // Extract the index from the reason if it's included
        const indexMatch = parsedResponse.reason.match(/Policy (\d+)/);
        const violatedPolicyIndex = indexMatch ? parseInt(indexMatch[1], 10) - 1 : null; // Adjust to 0-based index

        return {
          approvedByModel: false,
          reason: parsedResponse.reason,
          violatedPolicyIndex: violatedPolicyIndex,
        };
      }

      return parsedResponse;
    } catch (error) {
      if (this.isErrorWithMessage(error)) {
        if (error.message.includes('Candidate was blocked due to SAFETY')) {
          return {
            approvedByModel: false,
            reason: 'Content too explicit.',
            violatedPolicyIndex: null,
          };
        }
      }

      console.error('Error evaluating review:', error);
      return {
        approvedByModel: false,
        reason: 'An error occurred during policy evaluation.',
        violatedPolicyIndex: null,
      };
    }
  }

  public async evaluateMultipleReviews(
    comments: string[],
    policies: string[]
  ): Promise<{
    violatedPolicyIndex?: any;
    approvedByModel: boolean;
    reason?: string;
  }> {
    const nonRatingComments = comments.filter((comment) => isNaN(Number(comment.trim())));

    for (const reviewContent of nonRatingComments) {
      const result = await this.evaluateReview(reviewContent, policies);
      if (!result.approvedByModel) {
        const flaggedReason = result.reason || 'No specific reason provided.';
        return {
          approvedByModel: false,
          reason: `Comment: "${reviewContent}" was flagged. Reason: ${flaggedReason}`,
          violatedPolicyIndex: result.violatedPolicyIndex,
        };
      }
    }

    return {
      approvedByModel: true,
    };
  }

  private constructTagPrompt(reviews: string[]): string {
    return `
      You are tasked with generating concise and insightful one to two word tags for each of the following student reviews. 
      The tags should encapsulate the key themes or insights of the review, focusing on relevant aspects of the educational experience, 
      learning outcomes, and features that would be beneficial for students considering this course or professor.
 
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

      Important: Only respond with a JSON object in the specified format. Focus on generating relevant and meaningful one-word tags, 
      and NEVER USE placeholders like 'N/A', 'undefined' or 'no information.'. Make sure to only have relevant stuff. Ensure that each tag reflects a valuable insight 
      from the review and does not repeat or contain generic responses. 
      Do not include any additional commentary or information outside the JSON structure.
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

// const reviewEvaluator = new ReviewEvaluator();

// const reviewContent = 'This prof is a motherfucker jackass at grading.';
// const policies = ['No offensive language.', 'Avoid personal attacks.', 'Ensure factual accuracy.'];

// reviewEvaluator.evaluateReview(reviewContent, policies).then((result) => console.log(result));

// const reviews = [
//   'Excellent course! Used AWS a lot',
//   'The course was too difficult. Javascript was hard.',
//   'Loved the group projects.',
//   'The lectures were boring.',
// ];

// reviewEvaluator.evaluateMultipleReviews(reviews, policies).then((result) => console.log(result));

// reviewEvaluator.generateTags(reviews).then((result) => console.log(result));

export { ReviewEvaluator };
