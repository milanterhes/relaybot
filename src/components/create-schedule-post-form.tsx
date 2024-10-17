import { PropsWithChildren, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { DateTimePicker } from "./ui/datetime-picker"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Textarea } from './ui/textarea'

const createScheduledPostSchema = z.object({
    content: z.string().min(3),
    scheduledAt: z.date()
})

const CreateScheduledPostForm: React.FC<PropsWithChildren> = ({ children }) => {
    const form = useForm<z.infer<typeof createScheduledPostSchema>>({
        defaultValues: {
            content: "",
            scheduledAt: new Date()
        }
    })
    const [isOpen, setIsOpen] = useState(false);

    function onSubmit(data: z.infer<typeof createScheduledPostSchema>) {
        form.reset()
        setIsOpen(false)
        console.log(data)
    }

    return (
        <Dialog open={isOpen} onOpenChange={o => setIsOpen(o)}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule a New Post</DialogTitle>
                    <DialogDescription>
                        Create a new post to be scheduled for your Discord server.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Type your post content here..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the content for your Discord post.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scheduledAt"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Schedule For</FormLabel>
                                    <DateTimePicker
                                        {...field}
                                    />
                                    <FormDescription>
                                        Choose the date to schedule this post.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Schedule Post</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateScheduledPostForm