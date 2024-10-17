import ProjectOverview from "@/components/project-overview";

export default function Page({ params }: { params: { projectId: string } }) {
    return <div className="container mx-auto sm:px-6 lg:px-8"><ProjectOverview projectId={params.projectId} /></div>
}