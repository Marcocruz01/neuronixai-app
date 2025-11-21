import type { Message } from "../types/Messaje";

export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user';
    // Clases para diferenciar mensajes de usuario y asistente (AI)
    const bubbleClasses = isUser
        ? 'bg-purple-600 text-white self-end rounded-br-none' // Usuario a la derecha
        : 'bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-gray-50 self-start rounded-tl-none'; // AI a la izquierda

    return (
        <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md ${bubbleClasses}`}>
            {message.content}
        </div>
    );
}
