"use client"

import { useForm } from "react-hook-form"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { email, minLength, object, pipe, string, parse, maxLength, InferInput } from "valibot"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input as InputComponent } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

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

type ContactFormValues = InferInput<typeof contactSchema>

export function ContactForm({
  onSubmit: onSubmitProp
}: {
  onSubmit: (values: ContactFormValues) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<ContactFormValues>({
    resolver: valibotResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const {toast} = useToast()

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      // Validate form data
      const result = await parse(contactSchema, values)

      // Submit form data
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Call the onSubmit prop and show success message
      onSubmitProp(result)
      
      toast({
        title: "Success!",
        description: 'E-Mail sent successfully!'
      })
      form.reset()
    } catch (error) {
      // Log error with structured information
      if (error instanceof Error) {
        console.warn('Contact form error:', { 
          type: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
      } else {
        console.warn('Unexpected contact form error:', error)
      }
      
      toast({
        variant: "destructive",
        title: "Error..",
        description: error instanceof Error ? error.message : 'Failed to send message'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="grid gap-4 sm:gap-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-1.5 sm:gap-2">
                <FormLabel htmlFor="name" className="text-base sm:text-sm">Name</FormLabel>
                <FormControl>
                  <InputComponent 
                    id="name" 
                    placeholder="Your name" 
                    className="h-11 sm:h-9 text-base sm:text-sm px-4"
                    {...field} 
                    autoFocus 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-1.5 sm:gap-2">
                <FormLabel htmlFor="email" className="text-base sm:text-sm">Email</FormLabel>
                <FormControl>
                  <InputComponent 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="h-11 sm:h-9 text-base sm:text-sm px-4"
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="grid gap-1.5 sm:gap-2">
              <FormLabel htmlFor="message" className="text-base sm:text-sm">Message</FormLabel>
              <FormControl>
                <Textarea 
                  id="message"
                  placeholder="Your message..."
                  className="min-h-[120px] resize-y text-base sm:text-sm px-4 py-3"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  )
}
