import { type FormEvent, type RefObject } from "react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../types/Messaje";

// Definimos el type de las props
type ChatProps = {
    inputValue: string,
    setInputValue: (value: string) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void; 
    isButtonDisabled: boolean;
    inputRef: RefObject<HTMLInputElement | null>;
    messages: Message[]; 
    isLoading: boolean;
    messageContainerClasses: string;
    messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function Chat({ inputValue, setInputValue, handleSubmit, isButtonDisabled, inputRef, messages, isLoading, messageContainerClasses, messagesEndRef } : ChatProps) {
    return (
        <>
            {/* titulo */}
            <div className="w-full max-w-2xl pt-6 text-center">
                <h1 className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent">
                    Neuronix AI
                </h1>
            </div>

            {/* Mensajes - Contenedor */}
            <div
                id="messages"
                className={`
                    w-full max-w-2xl px-3 mt-4 overflow-y-auto space-y-4 
                    ${messageContainerClasses}
                `} 
            >
                
                {/* Condición inicial: Si no hay mensajes */}
                {messages.length === 0 && (
                    <label className="text-gray-950 dark:text-gray-50 font-bold text-2xl flex justify-center">
                        How can I help you, human?
                    </label>
                )}

                {/* Renderizar los mensajes existentes */}
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
        
                {/* Referencia invisible para hacer scroll al final */}
                <div ref={messagesEndRef} /> 
            </div>

            {/* Input */}
            <form
                id="form"
                className="w-full max-w-2xl px-3 pb-4 mt-2"
                onSubmit={handleSubmit}
            >
                <div className="relative">
                    <input
                        type="text"
                        name="prompt" 
                        id="input-prompt"
                        autoFocus
                        value={inputValue}
                        ref={inputRef}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading} 
                        placeholder={isLoading ? "Esperando respuesta..." : "Ask whatever you want..."}
                        className="bg-white border border-gray-300 dark:bg-neutral-800 shadow-sm dark:shadow-md dark:border-neutral-700 px-4 py-3 md:px-6 rounded-2xl dark:text-gray-50 w-full placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none"
                    />

                    <button 
                        type="submit" 
                        id="send-prompt" 
                        disabled={isButtonDisabled}
                        className={`absolute top-1/2 right-3 transform -translate-y-1/2 rounded-full p-2 transition duration-150 ${
                            isButtonDisabled
                                ? 'bg-gray-400 dark:bg-neutral-600 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"
                            className="size-5 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                        </svg>
                    </button>
                </div>

                <p className="text-sm text-gray-400 dark:text-neutral-400 text-center mt-3">
                    NeuronixAI may make mistakes. Please check important information.
                </p>
            </form>
        </>
    )
}