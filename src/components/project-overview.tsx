"use server";

import authOptions from '@/lib/auth-options';
import { ProjectsDA } from '@/lib/data-access';
import WeeklySchedule from '@/components/weekly-schedule';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

const ProjectOverview: React.FC<{ projectId: string }> = async ({ projectId }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/');
    }
    const project = await ProjectsDA.getOneById(projectId);

    if (project.isErr()) {
        console.error(project.error);
        return <div>Failed to fetch project</div>;
    }

    // This is like this, so that later we can authenticate based on organization
    if (project.value.ownerId !== session.user.id) {
        redirect('/');
    }

    return (
        <div>
            <WeeklySchedule />
        </div>
    )
}

export default ProjectOverview