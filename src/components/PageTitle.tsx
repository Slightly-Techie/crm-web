export default function PageTitle({
  title,
  background = "accent",
}: {
  title: string;
  background?: "primary" | "accent";
}) {
  return (
    <section
      className={`border-b border-b-st-edge dark:border-b-neutral-700 fixed h-[7vh] top-0 ${
        background === "primary"
          ? " bg-white/70 dark:bg-primary-dark/70"
          : "bg-white/70 dark:bg-st-cardDark/70"
      } w-full z-[40] backdrop-blur saturate-150 flex items-center px-5`}
    >
      <p className=" text-st-surfaceDark dark:text-st-surface lg:text-xl font-bold">
        {title}
      </p>
    </section>
  );
}
