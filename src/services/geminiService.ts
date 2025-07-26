import { GoogleGenerativeAI } from '@google/generative-ai';

export type ContentType = 'eBook' | 'Facebook Post' | 'Instagram Post';

export interface ContentResult {
  type: ContentType;
  title: string;
  content: string;
  imageIdeas: string[];
}

const PROMPT_TEMPLATE = `
আপনি একজন অভিজ্ঞ কনটেন্ট রাইটার, শিক্ষক ও কপি রাইটার — যার কাজ হল মানুষকে সহজ ভাষায় শেখানো ও অনুপ্রাণিত করা।

একটি বাংলা {{CONTENT_TYPE}} লিখুন টপিক: "{{TOPIC}}" উপর ভিত্তি করে।

---

📘 **যদি Content Type হয়: eBook**, তাহলে লিখুন:

- শিরোনাম: **"From Scratch to Pro: {{TOPIC}}"**
- লক্ষ্য: একজন একেবারে নতুন শিক্ষার্থীকে শুরু থেকে প্রফেশনাল পর্যায় পর্যন্ত নেওয়া
- ভাষা: প্রাঞ্জল, বন্ধুর মতো, গল্পের ছলে শেখানো
- স্টাইল: যেন মানুষ লিখেছে — তথ্যভিত্তিক, টিপসসহ, অনুপ্রেরণাদায়ক
- কাঠামো:
  1. ভূমিকা
  2. অধ্যায়ভিত্তিক গাইড (৮-১০টি অধ্যায়)
  3. প্রতিটি অধ্যায়ে:
     - বিষয়ভিত্তিক ব্যাখ্যা
     - বাস্তব উদাহরণ
     - অনুশীলন
     - অধ্যায়ের সারাংশ

উদ্দেশ্য: যেন বাংলাদেশের একজন শিক্ষার্থী কোনো পূর্বজ্ঞান ছাড়াই ধাপে ধাপে শিখতে পারে।

---

📱 **যদি Content Type হয়: Facebook Post বা Instagram Post**, তাহলে লিখুন:

- বাংলা ভাষায় ১টি আকর্ষণীয় পোস্ট বা ক্যাপশন
- শুরু হোক হুক লাইনে (attention grabber)
- পোস্ট হোক গল্পময়, হালকা এবং relatable
- শেষে call-to-action বা thoughtful ending
- সাথে ৫টি প্রাসঙ্গিক হ্যাশট্যাগ

---

🧠 **Extra Guideline (সব টাইপের জন্য প্রযোজ্য):**
- টোন: সহানুভূতিশীল, উৎসাহব্যঞ্জক এবং অনুপ্রেরণাদায়ক
- যেন AI না, মানুষই লিখেছে এমন মনে হয়
- বড় বড় ইংরেজি শব্দ এড়িয়ে বাংলা ব্যাখ্যাসহ দেওয়া
- প্রয়োজনে ছোট গল্প/উপমা/মেটাফোর ব্যবহার করা

নিম্নোক্ত ফরম্যাটে আউটপুট দিন:

CONTENT_TITLE_START
[এখানে কনটেন্টের শিরোনাম লিখুন]
CONTENT_TITLE_END

CONTENT_BODY_START
[এখানে মূল কনটেন্ট লিখুন - eBook এর ক্ষেত্রে অধ্যায়গুলো /// দিয়ে আলাদা করুন]
CONTENT_BODY_END

IMAGE_IDEAS_START
[এখানে ৫-৮টি বিস্তারিত ইমেজ আইডিয়া দিন]
IMAGE_IDEAS_END
`;

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string = '';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateContent(topic: string, contentType: ContentType): Promise<ContentResult> {
    if (!this.genAI) {
      throw new Error('Gemini API key not set. Please provide your API key.');
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = PROMPT_TEMPLATE
      .replace('{{TOPIC}}', topic)
      .replace('{{CONTENT_TYPE}}', contentType);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text, contentType);
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('কনটেন্ট তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  }

  private parseResponse(text: string, contentType: ContentType): ContentResult {
    try {
      // Extract title
      const titleMatch = text.match(/CONTENT_TITLE_START\s*([\s\S]*?)\s*CONTENT_TITLE_END/);
      const title = titleMatch ? titleMatch[1].trim() : `${contentType} শিরোনাম তৈরি করতে সমস্যা হয়েছে`;

      // Extract content
      const contentMatch = text.match(/CONTENT_BODY_START\s*([\s\S]*?)\s*CONTENT_BODY_END/);
      const content = contentMatch ? contentMatch[1].trim() : 'কনটেন্ট তৈরি করতে সমস্যা হয়েছে';

      // Extract image ideas
      const imageIdeasMatch = text.match(/IMAGE_IDEAS_START\s*([\s\S]*?)\s*IMAGE_IDEAS_END/);
      const imageIdeasText = imageIdeasMatch ? imageIdeasMatch[1].trim() : '';
      const imageIdeas = imageIdeasText.split('\n').map(idea => idea.trim().replace(/^[-•]\s*/, '')).filter(idea => idea.length > 0);

      return {
        type: contentType,
        title,
        content,
        imageIdeas: imageIdeas.length > 0 ? imageIdeas : ['ইমেজ আইডিয়া তৈরি করতে সমস্যা হয়েছে']
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('রেসপন্স পার্স করতে সমস্যা হয়েছে');
    }
  }
}