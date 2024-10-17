"use client";
import { addDays, isSameDay, startOfWeek } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { addWeeks, format, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, TriangleAlert, Unplug } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateScheduledPostForm from './create-schedule-post-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

type ScheduledPost = {
    content: string
    channel: string
    scheduledFor: Date
}

const examplePosts: ScheduledPost[] = [
    {
        content: "Don't forget our community game night this Friday at 8 PM EST!",
        channel: "announcements",
        scheduledFor: addDays(new Date(), 2),
    },
    {
        content: "New server rules have been posted. Please review them in the #rules channel.",
        channel: "general",
        scheduledFor: addDays(new Date(), 1),
    },
    {
        content: "Share your favorite memes in the #meme-of-the-day channel for a chance to win a special role!",
        channel: "off-topic",
        scheduledFor: addDays(new Date(), 3),
    },
]

const WeekSelector: React.FC<{ onWeekStartChange: (newWeekStart: Date) => void; currentWeekStart: Date }> = ({ onWeekStartChange, currentWeekStart }) => {
    const goToPreviousWeek = () => {
        onWeekStartChange(subWeeks(currentWeekStart, 1))
    }

    const goToNextWeek = () => {
        onWeekStartChange(addWeeks(currentWeekStart, 1))
    }

    return (
        <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
                {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}

const WeeklySchedule = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()))
    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)), [currentWeekStart])
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(examplePosts)
    return (
        <div>
            <div className="flex items-center gap-2 py-4">
                <h2 className="text-2xl font-semibold">Weekly Schedule</h2>
                <WeekSelector currentWeekStart={currentWeekStart} onWeekStartChange={setCurrentWeekStart} />
                <CreateScheduledPostForm>
                    <Button className='ml-auto'><Plus className='w-4 h-4 mr-2' />Schedule Post</Button>
                </CreateScheduledPostForm>
            </div>
            <Card className='w-1/2 my-3 border-primary'>
                <CardHeader>
                    <CardTitle>Relaybot Not Connected</CardTitle>
                    <CardDescription>Relaybot is not yet connected to your Discord server. Please connect your server to start scheduling posts.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button><Unplug className="w-4 h-4" />Connect Server</Button>
                </CardFooter>
            </Card>
            <div className="grid grid-cols-7 gap-4 my-3">
                {weekDays.map((day) => (
                    <div key={day.toISOString()} className="bg-muted p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">{format(day, "EEE, MMM d")}</h3>
                        <ScrollArea className="h-[300px]">
                            {scheduledPosts.filter((post) => isSameDay(post.scheduledFor, day)).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No posts scheduled</p>
                            ) : (
                                <ul className="space-y-2">
                                    {scheduledPosts
                                        .filter((post) => isSameDay(post.scheduledFor, day))
                                        .map((post, index) => (
                                            <li key={index} className="bg-background p-2 rounded">
                                                <p className="text-sm font-medium">{format(post.scheduledFor, "p")}</p>
                                                <p className="text-xs text-muted-foreground">Channel: {post.channel}</p>
                                                <p className="text-sm mt-1">{post.content}</p>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </ScrollArea>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WeeklySchedule