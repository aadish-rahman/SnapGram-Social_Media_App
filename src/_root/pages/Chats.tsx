import ChatBox from "@/components/shared/ChatBox";
import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import useDebounce from "@/hooks/useDebounce";
import { getUserById } from "@/lib/appwrite/api";
import {
  useAccessChat,
  useGetUserChats,
  useSearchUsers,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Chats = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { selectedChat, setSelectedChat, user: currentUser } = useUserContext();
  const [latestMessageArray, setLatestMessageArray] = useState<any[]>([]);

  const {
    data: searchResults,
    isFetching: searching,
    refetch: searchRefetch,
  } = useSearchUsers(debouncedSearch);
  const {
    data: chatData,
    isFetching: gettingUserChats,
    refetch: userChatsRefetch,
  } = useGetUserChats(currentUser?.id);

  const accessChatMutation = useAccessChat();

  useEffect(() => {
    if (debouncedSearch) {
      searchRefetch();
    } else if (currentUser) {
      userChatsRefetch();
    }
  }, [debouncedSearch, searchRefetch, userChatsRefetch, currentUser]);

  useEffect(() => {
    if (chatData) {
      const updatedLatestMessageArray = chatData.documents.map((chat) => {
        const latestMessage = chat.messages?.[chat.messages.length - 1] || null;
        return { chatId: chat.$id, latestMessage };
      });
      setLatestMessageArray(updatedLatestMessageArray);
    }
  }, [chatData]);

  const handleUserChatClick = (chat: any) => {
    setSelectedChat(chat);
  };

  const handleSearchedUserClick = async (userToChatId: any) => {
    try {
      const currentUserData = await getUserById(currentUser.id);
      const userToChatData = await getUserById(userToChatId);

      const chat = accessChatMutation.mutate({
        user1: currentUserData!.$id,
        user2: userToChatData!.$id,
      });
      setSelectedChat(chat);
    } catch (error) {
      console.error("Failed to access chat:", error);
    }
  };

  return (
    <div className="flex w-full h-full">
      <div
        className={`${
          selectedChat ? "hidden md:block" : "block"
        } flex flex-col w-full mr-4 md:w-[40%] lg:w-1/3 h-full`}
      >
        <div className="flex items-center w-full max-w-5xl gap-3 mt-5 ml-3">
          <img
            src={"/assets/icons/chat.svg"}
            alt="share"
            width={30}
            height={30}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h2 className="w-full h3-bold md:h2-bold">All Chats</h2>
        </div>
        <div className="flex flex-col items-center w-full mt-5 ml-1">
          <Input
            type="text"
            placeholder="Search Users"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex flex-col justify-start w-full h-full mt-4 ml-3 overflow-y-auto">
          {searchValue.trim() ? (
            searching ? (
              <Loader />
            ) : (
              searchResults?.map((user) => (
                <Link
                  to={`/profile/${user.$id}`}
                  className="flex items-center gap-3 mt-5 hover:bg-neutral-900"
                  key={user.$id}
                  onClick={() => handleSearchedUserClick(user.$id)}
                >
                  <img
                    src={
                      user.imageUrl || "/assets/icons/profile-placeholder.svg"
                    }
                    alt="profile"
                    className="rounded-full h-14 w-14"
                  />
                  <div className="flex flex-col">
                    <p className="body-bold">{user.name}</p>
                    <p className="small-regular text-light-3">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))
            )
          ) : gettingUserChats ? (
            <Loader />
          ) : (
            chatData?.documents.map((chat) => {
              const otherUser = chat.users?.find(
                (user: any) => user.$id !== currentUser.id
              );
              if (!otherUser) return null;

              return (
                <div
                  key={chat.$id}
                  className="flex items-center gap-2 mb-5 cursor-pointer"
                  onClick={() => handleUserChatClick(chat)}
                >
                  <img
                    src={
                      otherUser.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="Avatar"
                    className="rounded-full h-14 w-14"
                  />
                  <div className="flex flex-col">
                    <p className="body-bold">{otherUser.name}</p>
                    {latestMessageArray.find((item) => item.chatId === chat.$id)
                      ?.latestMessage && (
                      <p className="text-sm text-gray-500">
                        {
                          latestMessageArray.find(
                            (item) => item.chatId === chat.$id
                          ).latestMessage.sender.name
                        }
                        :{" "}
                        {
                          latestMessageArray.find(
                            (item) => item.chatId === chat.$id
                          ).latestMessage.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className={`w-full md:hidden ${selectedChat ? "block" : "hidden"}`}>
        <ChatBox
          chat={selectedChat}
          onBack={() => setSelectedChat("")}
          setLatestMessageArray={setLatestMessageArray}
        />
      </div>
      <div className="hidden w-[60%] lg:w-2/3 md:block h-full">
        {!selectedChat ? (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-xl text-primary-500 opacity-80">
              No Chat Selected
            </p>
          </div>
        ) : (
          <ChatBox
            chat={selectedChat}
            onBack={() => setSelectedChat("")}
            setLatestMessageArray={setLatestMessageArray}
          />
        )}
      </div>
    </div>
  );
};

export default Chats;
