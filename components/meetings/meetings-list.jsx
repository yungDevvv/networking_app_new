"use client";

import MeetItem from "@/components/meet-item";
import { startOfDay, endOfDay, isSameDay, parseISO, isBefore } from "date-fns";
import { useTranslations } from "next-intl";

const MeetingsList = ({ meetings, locale }) => {
    const t = useTranslations();
    
    // Get current date at midnight for comparison
    const now = new Date();
    const today = startOfDay(now);
    const todayEnd = endOfDay(now);

    // Sort meetings into categories
    const pastMeetings = [];
    const todayMeetings = [];
    const upcomingMeetings = [];

    meetings.forEach(meet => {
        const meetDate = parseISO(meet.date);
        
        if (isSameDay(meetDate, today)) {
            todayMeetings.push(meet);
        } else if (isBefore(meetDate, today)) {
            pastMeetings.push(meet);
        } else {
            upcomingMeetings.push(meet);
        }
    });

    // Sort each array in descending order by date
    const sortByDateDesc = (a, b) => new Date(b.date) - new Date(a.date);
    pastMeetings.sort(sortByDateDesc);
    todayMeetings.sort(sortByDateDesc);
    upcomingMeetings.sort(sortByDateDesc);

    const renderMeetingSection = (title, meetings) => {
        if (meetings.length === 0) return null;
        
        return (
            <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-4">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {meetings.map((meet) => (
                        <MeetItem key={meet.$id} meet={meet} locale={locale} />
                    ))}
                </div>
            </div>
        );
    };

    if (meetings.length === 0) {
        return <h3 className="text-gray-500">{t("no_meetings")}</h3>;
    }

    return (
        <>
            {renderMeetingSection(t("today_meetings"), todayMeetings)}
            {renderMeetingSection(t("upcoming_meetings"), upcomingMeetings)}
            {renderMeetingSection(t("past_meetings"), pastMeetings)}
        </>
    );
};

export default MeetingsList;
