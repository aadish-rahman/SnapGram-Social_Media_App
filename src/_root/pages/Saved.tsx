import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  console.log(currentUser);

  // Extract saved post documents from currentUser data
  const savedPostDocuments =
    currentUser?.save.map((savedItem: { post: any }) => savedItem.post) || [];

  return (
    <div className="explore-container">
      <div className="flex items-center w-full max-w-5xl gap-3">
        <img
          src={"/assets/icons/save.svg"}
          alt="share"
          width={30}
          height={30}
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <h2 className="w-full h3-bold md:h2-bold">Saved Posts</h2>
      </div>

      <div className="w-full max-w-5xl mt-16 flex-between mb-7">
        <div className="gap-3 px-4 py-2 cursor-pointer flex-center bg-dark-3 rounded-xl">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap w-full max-w-5xl gap-9">
        {savedPostDocuments.length > 0 ? (
          <GridPostList
            posts={savedPostDocuments}
            showStats={false}
            showUser={false}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Saved;
