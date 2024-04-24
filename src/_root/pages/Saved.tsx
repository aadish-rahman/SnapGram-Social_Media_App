import { useEffect } from "react";

import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { getSavedPostDocumentsByUserId } from "@/lib/appwrite/api";
import {
  useGetCurrentUser,
  useGetPostDocumentsByPostIds,
  useGetSavedPostDocumentsByUserId,
} from "@/lib/react-query/queriesAndMutations";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  console.log(currentUser);

  const { data: savedPostDocuments } = useGetSavedPostDocumentsByUserId(
    currentUser?.$id || ""
  );

  const postIds = savedPostDocuments?.map((doc) => doc.post.$id) || [];

  const { data: postDocuments } = useGetPostDocumentsByPostIds(postIds);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser) {
        try {
          // Fetch saved post documents by user ID using React Query hook
          await getSavedPostDocumentsByUserId(currentUser.$id);

          // No need to fetch post documents here because useGetPostDocumentsByPostIds hook is already fetching them
        } catch (error) {
          console.error("Error fetching saved post documents:", error);
        }
      }
    };

    fetchPosts();
  }, [currentUser]);

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
        {postDocuments ? (
          <GridPostList
            posts={postDocuments}
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
