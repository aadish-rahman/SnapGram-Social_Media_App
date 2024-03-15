import { Models } from "appwrite";
import GridPostList from "./GridPostList";
import Loader from "./Loader";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  }
  if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} />;
  }
  return (
    <p className="w-full mt-10 text-center text-light-4">No results found</p>
  );
};

export default SearchResults;
