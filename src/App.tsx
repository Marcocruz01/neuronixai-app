import Chat from "./components/Chat"
import { useNeuronix } from "./hooks/useNeuronix"

function App() {
  // Pasamos los props
  const {inputValue, setInputValue, handleSubmit, 
    isButtonDisabled, inputRef, messages, isLoading, 
    messageContainerClasses, messagesEndRef
  } = useNeuronix();

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-white dark:bg-neutral-900">
      <Chat
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleSubmit={handleSubmit}
      isButtonDisabled={isButtonDisabled}
      inputRef={inputRef}
      messages={messages}
      isLoading={isLoading}
      messageContainerClasses={messageContainerClasses}
      messagesEndRef={messagesEndRef}
    />
    </div>
  )
}

export default App
