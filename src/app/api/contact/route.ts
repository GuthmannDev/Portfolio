'use server'

import { Resend } from 'resend'
import { z } from 'zod'

// Rate limiting configuration
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Email validation schema
const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters"),
  email: z.string()
    .email("Please enter a valid email address"),
  message: z.string()
    .min(1, "Message must be at least 1 character long")
    .max(1000, "Message must be less than 1000 characters")
})

// Initialize Resend client
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

if (!process.env.EMAIL_FROM_ADDRESS) {
  throw new Error('EMAIL_FROM_ADDRESS environment variable is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) return false;

  userLimit.count++;
  return true;
}

// Clean up old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((data, ip) => {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  });
}, 60 * 60 * 1000);

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return Response.json({
        success: false,
        error: 'Too many requests. Please try again later.'
      }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, message } = contactSchema.parse(body);

    const emailResult = await resend.emails.send({
      from: email,
      to: process.env.EMAIL_FROM_ADDRESS!,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (!emailResult.data?.id) {
      throw new Error('Failed to send email');
    }

    return Response.json({ 
      success: true,
      message: "Email sent successfully",
      id: emailResult.data?.id
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map(issue => {
        const path = issue.path?.join(".") || "unknown";
        return `${path}: ${issue.message}`
      }).join(", ")
      
      return Response.json({
        success: false,
        error: messages
      }, { status: 400 })
    }

    if (error instanceof Error) {
      console.error('Contact form error:', error.message);
      return Response.json({
        success: false,
        error: 'An unexpected error occurred'
      }, { status: 500 })
    }

    return Response.json({
      success: false,
      error: 'An unknown error occurred'
    }, { status: 500 })
  }
}