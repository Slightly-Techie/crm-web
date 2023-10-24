export default function PageTitle({ title }: { title: string }) {
  return (
    <section className="border-b border-b-neutral-700 sticky top-0 bg-primary-light dark:bg-[#141414] w-full z-[100]  p-5">
      <p className="lg:text-xl font-bold">{title}</p>
    </section>
  );
}
