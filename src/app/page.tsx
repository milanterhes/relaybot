import Navbar from "@/components/navbar";
import Projects from "@/components/projects";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto sm:px-6 lg:px-8">
        <Projects />
      </div>
    </>
  );
}
