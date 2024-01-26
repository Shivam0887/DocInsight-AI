import Chat from "@/components/chat/Chat";
import DocumentRenderer from "@/components/document/DocumentRenderer";

const ConversationPage = () => {
  return (
    <div className="flex-1 grid grid-cols-2 justify-center">
      <DocumentRenderer />
      <Chat />
    </div>
  );
};

export default ConversationPage;
