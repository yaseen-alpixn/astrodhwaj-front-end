import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";

export default function MessagePageContent() {
  return (
    <main className="min-h-[calc(100svh-88px)] bg-[#fcfbff] px-2 py-2 sm:px-3 sm:py-3 lg:h-[calc(100svh-88px)] lg:overflow-hidden lg:px-2 lg:py-4s">
      <div className="mx-auto flex h-full max-w-full flex-col overflow-hidden bg-white lg:flex-row">
        <div className="w-full lg:w-[300px] lg:shrink-0 xl:w-[320px]">
          <ConversationList />
        </div>
        <div className="min-w-0 flex-1">
          <ChatWindow />
        </div>
      </div>
    </main>
  );
}
