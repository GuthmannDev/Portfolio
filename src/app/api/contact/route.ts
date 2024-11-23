'use server'

import { Resend } from 'resend'
import { email, maxLength, minLength, object, parse, pipe, string, ValiError } from 'valibot'

// Rate limiting configuration
const RATE_LIMIT = 5; // Maximum requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Email validation schema
const contactSchema = object({
  name: pipe(
    string(),
    minLength(2, "Name must be at least 2 characters long"),
    maxLength(50, "Name must be less than 50 characters"),
  ),
  email: pipe(
    string(), 
    email("Please enter a valid email address")
  ),
  message: pipe(
    string(),
    minLength(1, "Message must be at least 1 characters long"),
    maxLength(1000, "Message must be less than 1000 characters")
  ),
})

// Initialize Resend client
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

if (!process.env.EMAIL_FROM_ADDRESS) {
  throw new Error('EMAIL_FROM_ADDRESS environment variable is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Clean up old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 60 * 1000);

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return Response.json({
        success: false,
        error: 'Too many requests. Please try again later.'
      }, { status: 429 });
    }

    const body = await request.json();
    
    // Validate the request body
    const { name, email, message } = parse(contactSchema, body);

    // Send email
    const emailResult = await resend.emails.send({
      from: email,
      to: process.env.EMAIL_FROM_ADDRESS!,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    if (!emailResult.id) {
      throw new Error('Failed to send email');
    }

    return Response.json({ 
      success: true,
      message: "Email sent successfully",
      id: emailResult.id
    })
  } catch (error) {
    // Handle validation errors
    if (error instanceof ValiError) {
      const messages = error.issues.map((issue: { path?: { key: string }[]; message: string }) => {
        const path = issue.path?.map(p => p.key).join(".") || "unknown"
        return `${path}: ${issue.message}`
      }).join(", ")
      
      return Response.json({
        success: false,
        error: messages
      }, { status: 400 })
    }

    // Handle other known errors
    if (error instanceof Error) {
      console.error('Contact form error:', {
        type: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });

      return Response.json({
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An error occurred while sending your message'
      }, { status: 400 })
    }

    // Handle unknown errors
    console.error("Unexpected contact form error:", error)
    return Response.json(
      { 
        success: false,
        error: 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
