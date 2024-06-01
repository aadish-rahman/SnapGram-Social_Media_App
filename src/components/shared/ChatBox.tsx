import { useUserContext } from "@/context/AuthContext";
import { appwriteConfig, client } from "@/lib/appwrite/config";
import {
  useCreateMessage,
  useGetChat,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ChatBoxProps = { chat: any; onBack: () => void };

const ChatBox = ({ chat, onBack }: ChatBoxProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { user: currentUser } = useUserContext();
  const { data: chatData, isLoading: chatLoading } = useGetChat(chat?.$id);
  const { mutate: createMessageMutation } = useCreateMessage();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatData) {
      console.log(chatData);
      setMessages(chatData.messages);
    }
  }, [chatData]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          const newMessage: any = response.payload;
          console.log(newMessage);
          if (newMessage.chat.$id === chat.$id) {
            setMessages((prevMessages) => {
              const updatedMessages = prevMessages.map((msg) =>
                msg.message === newMessage.message &&
                msg.sender.$id === currentUser.id
                  ? { ...newMessage, status: "sent" }
                  : msg
              );
              return updatedMessages.some((msg) => msg.$id === newMessage.$id)
                ? updatedMessages
                : [...updatedMessages, newMessage];
            });
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chat.$id, currentUser.id]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCreateMessage = () => {
    if (message.trim()) {
      const tempId = uuidv4();
      const newMessage: any = {
        $id: tempId,
        message: message.trim(),
        sender: { $id: currentUser.id },
        chat: { $id: chat.$id },
        status: "sending",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      createMessageMutation(
        { message: message.trim(), chat: chat.$id, sender: currentUser.id },
        {
          onSuccess: (response: any) => {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.$id === tempId ? { ...response, status: "sent" } : msg
              )
            );
          },
          onError: () => {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.$id === tempId ? { ...msg, status: "failed" } : msg
              )
            );
          },
        }
      );

      setMessage("");
    }
  };

  const renderMessages = () => {
    if (chatLoading) {
      return <div className="text-center text-gray-500">Loading chat...</div>;
    }

    if (!messages.length) {
      return (
        <div className="text-center text-gray-500">Start messaging...</div>
      );
    }

    return messages.map((message, index) => (
      <div
        key={index}
        className={`flex justify-${
          message.sender.$id === currentUser.id ? "end" : "start"
        } mb-2`}
      >
        <div
          className={`rounded-lg p-4 max-w-[70%] mr-4 ${
            message.sender.$id === currentUser.id
              ? "bg-primary-500 text-white"
              : "bg-neutral-800 text-white"
          }`}
        >
          {message.message}
          {message.status === "sending" && (
            <p className="text-sm text-gray-400">Sending...</p>
          )}
          {message.status === "failed" && (
            <p className="text-sm text-red-400">Failed to send</p>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full p-4 rounded-lg shadow-md bg-neutral-950">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-4">
          <IoArrowBack size={24} />
        </button>
        <h2 className="text-xl font-bold">Chat</h2>
      </div>
      <div
        className="flex flex-col flex-1 mb-24 overflow-y-auto message-container"
        ref={messageContainerRef}
      >
        {renderMessages()}
      </div>
      <div className="fixed w-4/5 px-4 md:w-2/4 bottom-28 bg-neutral-950 md:bottom-5 md:px-0">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your message"
            className="flex-grow explore-search"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateMessage();
              }
            }}
          />
          <Button
            className="text-black bg-yellow-500 hover:bg-yellow-600 h-11"
            onClick={handleCreateMessage}
          >
            <RiSendPlaneFill size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
