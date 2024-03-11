import CreatePost from "@/components/Feed/CreatePost";
import Posts from "@/components/Feed/Posts";
import Announcements from "@/components/Feed/new/announcements";
import PageTitle from "@/components/PageTitle";

export default function FeedPage() {
  return (
    <div className="grid lg:grid-cols-feed justify-center w-full h-full font-mona-sans">
      <section className="w-full h-screen scrollbar overflow-y-scroll flex flex-col border-l border-r border-st-gray dark:border-st-grayDark">
      <PageTitle title="Feed" background="primary" />
        <section className="pt-[7vh]">
          <CreatePost />
          <Posts />
        </section>
      </section>
      <section className="hidden lg:flex px-2 h-screen overflow-y-scroll scrollbar pt-[7vh]">
        <Announcements />
      </section>
    </div>
  );
}
