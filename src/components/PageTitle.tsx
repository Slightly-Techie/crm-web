export default function PageTitle({
  title,
  background = "accent",
}: {
  title: string;
  background?: "primary" | "accent";
}) {
  return (
    <section
      className={`border-b border-b-neutral-700 sticky top-0 ${
        background === "primary"
          ? " dark:bg-primary-dark"
          : "dark:bg-st-cardDark"
      } w-full z-[40]  p-5`}
    >
      <p className="lg:text-xl font-bold">{title}</p>
    </section>
  );
}
