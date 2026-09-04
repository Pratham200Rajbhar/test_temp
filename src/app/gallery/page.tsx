import Header from "@/components/header";
import Gallery from "@/components/gallery";

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Gallery />
      </main>
    </>
  );
}
