
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface eBookResult {
  title: string;
  pages: string[];
  imageIdeas: string[];
}

const PROMPT_TEMPLATE = `
আপনি একজন দক্ষ লেখক এবং ই-বুক বিশেষজ্ঞ। আপনার কাজ হলো "{{topic}}" টপিকের উপর একটি বিস্তারিত এবং তথ্যবহুল ই-বুক তৈরি করা।

নিম্নোক্ত ফরম্যাটে আউটপুট দিন:

BOOK_TITLE_START
[এখানে একটি আকর্ষণীয় এবং তথ্যবহুল বইয়ের শিরোনাম লিখুন যা টপিকটিকে সম্পূর্ণভাবে প্রতিফলিত করে]
BOOK_TITLE_END

BOOK_PAGES_START
[এখানে ১০-১৫টি বিস্তারিত পৃষ্ঠা লিখুন। প্রতিটি পৃষ্ঠায় ৫০০-৮০০ শব্দ হতে হবে। প্রতিটি পৃষ্ঠা /// দিয়ে আলাদা করুন। প্রতিটি পৃষ্ঠায় গভীর তথ্য, উদাহরণ, পরিসংখ্যান, ব্যবহারিক টিপস এবং ধাপে ধাপে নির্দেশনা থাকতে হবে]
BOOK_PAGES_END

IMAGE_IDEAS_START
[এখানে ৮-১০টি বিস্তারিত ইমেজ আইডিয়া দিন যা এই ই-বুকের সাথে ব্যবহার করা যাবে]
IMAGE_IDEAS_END

গুরুত্বপূর্ণ নির্দেশনা:
- সব কন্টেন্ট বাংলায় লিখুন
- প্রতিটি পৃষ্ঠা ৫০০-৮০০ শব্দের মধ্যে রাখুন (বিস্তারিত এবং তথ্যবহুল)
- প্রয়োজনীয় স্থানে ইমোজি ব্যবহার করুন
- প্রতিটি পৃষ্ঠায় শিরোনাম এবং উপশিরোনাম ব্যবহার করুন
- বুলেট পয়েন্ট (• বা ✅) এবং নাম্বার লিস্ট ব্যবহার করুন
- গুরুত্বপূর্ণ বিষয় হাইলাইট করতে বোল্ড টেক্সট ব্যবহার করুন
- ব্যবহারিক এবং কার্যকর তথ্য প্রদান করুন
- প্রতিটি পৃষ্ঠা স্বতন্ত্র অধ্যায় হিসেবে কাজ করবে
- বিস্তারিত তথ্য, উদাহরণ, কেস স্টাডি এবং ব্যবহারিক গাইড দিন
- প্রতিটি পৃষ্ঠায় কমপক্ষে ৫-৮টি প্যারাগ্রাফ থাকতে হবে
- টেক্সট পড়তে সহজ করতে যথাযথ বিরতি এবং ফরম্যাটিং ব্যবহার করুন
- ধাপে ধাপে নির্দেশনা এবং বাস্তব উদাহরণ দিন
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

  async generateeBook(topic: string): Promise<eBookResult> {
    if (!this.genAI) {
      throw new Error('Gemini API key not set. Please provide your API key.');
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = PROMPT_TEMPLATE.replace('{{topic}}', topic);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error('Error generating eBook:', error);
      throw new Error('ই-বুক তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  }

  private parseResponse(text: string): eBookResult {
    try {
      // Extract book title
      const titleMatch = text.match(/BOOK_TITLE_START\s*([\s\S]*?)\s*BOOK_TITLE_END/);
      const title = titleMatch ? titleMatch[1].trim() : 'বইয়ের শিরোনাম তৈরি করতে সমস্যা হয়েছে';

      // Extract book pages
      const pagesMatch = text.match(/BOOK_PAGES_START\s*([\s\S]*?)\s*BOOK_PAGES_END/);
      const pagesText = pagesMatch ? pagesMatch[1].trim() : '';
      const pages = pagesText.split('///').map(page => page.trim()).filter(page => page.length > 0);

      // Extract image ideas
      const imageIdeasMatch = text.match(/IMAGE_IDEAS_START\s*([\s\S]*?)\s*IMAGE_IDEAS_END/);
      const imageIdeasText = imageIdeasMatch ? imageIdeasMatch[1].trim() : '';
      const imageIdeas = imageIdeasText.split('\n').map(idea => idea.trim().replace(/^[-•]\s*/, '')).filter(idea => idea.length > 0);

      return {
        title,
        pages: pages.length > 0 ? pages : ['ই-বুক কন্টেন্ট তৈরি করতে সমস্যা হয়েছে'],
        imageIdeas: imageIdeas.length > 0 ? imageIdeas : ['ইমেজ আইডিয়া তৈরি করতে সমস্যা হয়েছে']
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('রেসপন্স পার্স করতে সমস্যা হয়েছে');
    }
  }
}
