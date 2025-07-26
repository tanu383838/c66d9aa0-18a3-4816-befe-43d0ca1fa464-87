import { GoogleGenerativeAI } from '@google/generative-ai';

export type ContentType = 'eBook' | 'Facebook Post' | 'Instagram Post';

export interface ContentOptions {
  wordCount?: number;
  pageCount?: number;
}

export interface ContentResult {
  type: ContentType;
  title: string;
  content: string;
  imageIdeas: string[];
}

const PROMPT_TEMPLATE = `
আপনি একজন অভিজ্ঞ কনটেন্ট রাইটার, শিক্ষক ও কপি রাইটার — যার কাজ হল মানুষকে সহজ ভাষায় শেখানো ও অনুপ্রাণিত করা।

একটি বাংলা {{CONTENT_TYPE}} লিখুন টপিক: "{{TOPIC}}" উপর ভিত্তি করে। {{CONTENT_REQUIREMENTS}}

---

📘 **যদি Content Type হয়: eBook**, তাহলে লিখুন:

- শিরোনাম: **"From Scratch to Pro: {{TOPIC}}"**
- লক্ষ্য: একজন একেবারে নতুন শিক্ষার্থীকে শুরু থেকে প্রফেশনাল পর্যায় পর্যন্ত নেওয়া
- ভাষা: প্রাঞ্জল, বন্ধুর মতো, গল্পের ছলে শেখানো
- স্টাইল: যেন মানুষ লিখেছে — তথ্যভিত্তিক, টিপসসহ, অনুপ্রেরণাদায়ক
- কাঠামো: {{PAGE_COUNT}} পৃষ্ঠার বিস্তারিত ই-বুক
  1. আকর্ষণীয় ভূমিকা (১ পৃষ্ঠা)
  2. বিস্তারিত অধ্যায়ভিত্তিক গাইড
  3. প্রতিটি অধ্যায়ে:
     - গভীর বিষয়ভিত্তিক ব্যাখ্যা
     - বাস্তব উদাহরণ ও কেস স্টাডি
     - ধাপে ধাপে অনুশীলন
     - প্রো টিপস ও ট্রিকস
     - অধ্যায়ের সারাংশ ও চেকলিস্ট
  4. উপসংহার ও পরবর্তী পদক্ষেপ (১ পৃষ্ঠা)

উদ্দেশ্য: যেন বাংলাদেশের একজন শিক্ষার্থী কোনো পূর্বজ্ঞান ছাড়াই ধাপে ধাপে শিখতে পারে।

---

📱 **যদি Content Type হয়: Facebook Post বা Instagram Post**, তাহলে লিখুন:

- বাংলা ভাষায় {{WORD_COUNT}} শব্দের আকর্ষণীয় পোস্ট বা ক্যাপশন
- শুরু হোক হুক লাইনে (attention grabber)
- পোস্ট হোক গল্পময়, আবেগপ্রবণ এবং relatable
- মাঝে মাঝে ইমোজি ব্যবহার করুন
- শেষে শক্তিশালী call-to-action বা thoughtful ending
- সাথে ৮-১০টি প্রাসঙ্গিক হ্যাশট্যাগ
- পোস্টটি যেন ভাইরাল হওয়ার মতো আকর্ষণীয় হয়

---

🧠 **Extra Guideline (সব টাইপের জন্য প্রযোজ্য):**
- টোন: সহানুভূতিশীল, উৎসাহব্যঞ্জক এবং অনুপ্রেরণাদায়ক
- যেন AI না, মানুষই লিখেছে এমন মনে হয়
- বড় বড় ইংরেজি শব্দ এড়িয়ে বাংলা ব্যাখ্যাসহ দেওয়া
- প্রয়োজনে ছোট গল্প/উপমা/মেটাফোর ব্যবহার করা
- কনটেন্ট যেন পাঠকের মনে গেঁথে যায় এবং শেয়ার করতে ইচ্ছা করে
- তথ্যভিত্তিক হলেও যেন বিনোদনমূলক হয়

নিম্নোক্ত ফরম্যাটে আউটপুট দিন:

CONTENT_TITLE_START
[এখানে কনটেন্টের শিরোনাম লিখুন]
CONTENT_TITLE_END

CONTENT_BODY_START
[এখানে মূল কনটেন্ট লিখুন - eBook এর ক্ষেত্রে অধ্যায়গুলো /// দিয়ে আলাদা করুন]
CONTENT_BODY_END

IMAGE_IDEAS_START
[এখানে ৮-১২টি বিস্তারিত ইমেজ আইডিয়া দিন যা কনটেন্টের সাথে পারফেক্ট ম্যাচ করে]
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

  async generateContent(topic: string, contentType: ContentType, options: ContentOptions = {}): Promise<ContentResult> {
    if (!this.genAI) {
      throw new Error('Gemini API key not set. Please provide your API key.');
    }

    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
    
    let contentRequirements = '';
    if (contentType === 'eBook' && options.pageCount) {
      contentRequirements = `এই ই-বুকটি অবশ্যই ${options.pageCount} পৃষ্ঠার হতে হবে। প্রতিটি অধ্যায় বিস্তারিত ও তথ্যবহুল হতে হবে।`;
    } else if (contentType !== 'eBook' && options.wordCount) {
      contentRequirements = `এই পোস্টটি অবশ্যই প্রায় ${options.wordCount} শব্দের হতে হবে। শব্দ সংখ্যা মেনে চলুন।`;
    }
    
    const prompt = PROMPT_TEMPLATE
      .replace('{{TOPIC}}', topic)
      .replace('{{CONTENT_TYPE}}', contentType)
      .replace('{{CONTENT_REQUIREMENTS}}', contentRequirements)
      .replace('{{PAGE_COUNT}}', options.pageCount?.toString() || '10')
      .replace('{{WORD_COUNT}}', options.wordCount?.toString() || '500');

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const parsedResult = this.parseResponse(text, contentType);
      return this.refineResponse(parsedResult);
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('কনটেন্ট তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  }

  private refineResponse(result: ContentResult): ContentResult {
    // Refine title
    let refinedTitle = result.title
      .replace(/^["']|["']$/g, '') // Remove quotes
      .trim();

    // Refine content formatting
    let refinedContent = result.content
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Ensure bold formatting
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/^\s+|\s+$/gm, '') // Trim each line
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');

    // Add proper spacing for eBook chapters
    if (result.type === 'eBook') {
      refinedContent = refinedContent.replace(/\/\/\//g, '\n\n///\n\n');
    }

    // Refine image ideas
    const refinedImageIdeas = result.imageIdeas
      .map(idea => idea.replace(/^[-•*]\s*/, '').trim())
      .filter(idea => idea.length > 10)
      .map(idea => {
        if (!idea.endsWith('.') && !idea.endsWith('!') && !idea.endsWith('?')) {
          return idea + '.';
        }
        return idea;
      });

    return {
      ...result,
      title: refinedTitle,
      content: refinedContent,
      imageIdeas: refinedImageIdeas
    };
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