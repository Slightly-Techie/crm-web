import CreatePost from "@/components/Feed/CreatePost";
import Posts from "@/components/Feed/Posts";
import Announcements from "@/components/Feed/new/announcements";
import PageTitle from "@/components/PageTitle";

export default function FeedPage() {
  return (
    <div className="grid lg:grid-cols-feed justify-center w-full h-full font-mona-sans">
      <section className="w-full h-screen scrollbar overflow-y-scroll flex flex-col border-l border-r border-st-gray dark:border-st-grayDark">
        <PageTitle title="Feed" background="primary" />
        {/* <div className="h-14 shrink-0 flex-row px-2 flex items-center border-b border-st-gray dark:border-st-grayDark">
          <h3 className="lg:text-xl font-bold">Feed</h3>
        </div> */}
        <CreatePost />
        <Posts />
      </section>
      <section className="hidden xl:flex px-2 h-screen overflow-y-scroll scrollbar">
        <Announcements />
      </section>
    </div>
  );
}
