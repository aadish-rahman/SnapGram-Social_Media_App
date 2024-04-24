import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();
  const { id } = useParams();
  const { data: userData, isFetching } = useGetUserById(id!);

  if (!userData || isFetching) {
    return <Loader />;
  }

  const posts = userData?.posts || [];
  console.log(posts);

  const handleEditButton = () => {
    navigate(`/update-profile`);
  };

  return (
    <div className="profile-container">
      {userData ? (
        <>
          <div className="flex gap-3">
            <div className="profile-header">
              <img
                src={
                  userData.imageUrl || "/assets/icons/profile-placeholder.svg"
                }
                alt="profile"
                className="w-32 h-32 rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="text-2xl lg:text-4xl ">{userData.name}</p>
                {userData.$id === currentUser!.id && (
                  <button
                    className="flex gap-2 justify-center px-4 py-2.5 text-sm font-semibold leading-5 text-center rounded-lg bg-neutral-900 text-zinc-100 group hover:bg-primary-500"
                    onClick={() => handleEditButton()}
                  >
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="Edit"
                      className="self-start w-4 shrink-0 aspect-square group-hover:invert-white"
                    />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <p className="mt-2 small-regular text-light-3">
                @{userData.username}
              </p>
              <div className="flex gap-10 mt-4">
                <div className="flex flex-col ">
                  <p className="text-primary-500">312</p>
                  <p className="font-semibold">Posts</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-primary-500">312</p>
                  <p className="font-semibold">Followers</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-primary-500">312</p>
                  <p className="font-semibold">Following</p>
                </div>
              </div>
              <div className="mt-3">
                <p>{userData.bio}</p>
              </div>
            </div>
          </div>{" "}
        </>
      ) : (
        <Loader />
      )}
      <div className="flex flex-wrap justify-center w-full max-w-5xl gap-9">
        {posts.length !== 0 ? (
          <GridPostList posts={posts} showStats={false} showUser={false} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full gap-5 mt-10">
            <p className="text-2xl text-center lg:text-2xl">
              There are no Posts yet
            </p>
            {userData.$id === currentUser!.id && (
              <button className="flex gap-2 justify-center px-4 py-2.5 text-sm font-semibold leading-5 text-center rounded-lg bg-neutral-900 text-zinc-100 hover:bg-primary-500 group">
                <NavLink
                  to={"/create-post"}
                  className="flex items-center gap-4 lg:p-1 xl:p-4 group"
                >
                  <img
                    src={"/assets/icons/posts.svg"}
                    alt={"Create Post"}
                    className="group-hover:invert-white"
                  />
                  Create Post
                </NavLink>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
