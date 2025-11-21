// Importar dependencias
import { type FormEvent, useRef, useEffect, useState } from "react"
import type { Message } from "../types/Messaje";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export function useNeuronix() {
  // Inicializar a cadena vacía para manejo de input (string)
  const [inputValue, setInputValue] = useState<string>('');

  // Estado para saber si la solicitud está en curso
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Estado de la comversacion
  const [messages, setMessages] = useState<Message[]>([])

  // Determinar si el botón de envío debe estar habilitado
  const isButtonDisabled = inputValue.trim() === '' || isLoading; // Incluir 'isLoading' para deshabilitar

  // Configurar el openrouter
  const openrouter = createOpenRouter({
    apiKey: import.meta.env.VITE_OPENROUTER_KEY
  });

  // Tener una referencia del input
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para enfocar el input al cargar el componente
  useEffect(() => {
    // Chequeamos si la referencia existe (si el componente ya está en el DOM)
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Funcion que se ejecuta cuando el usuario envia la petición 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Prevenimos el comportamiento por defecto del formulario
    e.preventDefault();

    // Capturamos el valor antes de limpiarlo
    const prompt = inputValue.trim();
    if (!prompt) return; // Salimos si esta vacio

    // Crear el nuevo mensaje del usuario
    const userMessage: Message = {
      id: Date.now(), // ID único para la clave (key)
      content: prompt,
      role: 'user',
    };

    // 2. Mensaje inicial (placeholder) del asistente con ID único
    const assistantMessageId = Date.now() + 1;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      content: 'Escribiendo...',
      role: 'assistant',
    };

    // Agregar ambos mensajes a la lista de una vez
    setMessages((prevMessages) => [...prevMessages, userMessage, initialAssistantMessage]);

    // Limpiar el input y establecer carga
    setInputValue('');
    setIsLoading(true);

    try {
      // Usar streamText para la respuesta en tiempo real
      const result = await streamText({
        model: openrouter('nvidia/nemotron-nano-12b-v2-vl:free'),
        prompt: prompt,
      });

      let fullContent = '';
      let firstChunk = true;

      // Iterar sobre el flujo y actualizar el estado con cada chunk
      for await (const delta of result.fullStream) {
        if (delta.type === 'text-delta') {
          fullContent += delta.text;

          // Actualizar el contenido del mensaje, buscando el ID correcto
          setMessages((prevMessages) => {
            return prevMessages.map((msg) => {
              if (msg.id === assistantMessageId) {

                // Si es el primer chunk, reemplazamos todo el contenido
                // (el texto "escribiendo...") con el texto real del stream.
                if (firstChunk) {
                  firstChunk = false; // Desactivar después del primer reemplazo
                  return { ...msg, content: fullContent };
                }

                // Si no es el primer chunk, simplemente actualizamos el contenido (append).
                return { ...msg, content: fullContent };
              }
              return msg;
            });
          });
        }
      }
    } catch (error) {
      console.error("Error al generar texto con IA:", error);
      const errorMessage: Message = {
        //  Reutilizamos el ID del mensaje placeholder
        id: assistantMessageId,
        content: "Lo siento, ocurrió un error al procesar tu solicitud.",
        role: 'assistant',
      }
      // Reemplazamos el mensaje placeholder por el mensaje de error
      setMessages((prevMessages) => prevMessages.map(
        (msg) => msg.id === assistantMessageId ? errorMessage : msg
      ));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  // Referencia para hacer scroll automático
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Bandera para saber si ya hay mensajes
  const conversationStarted = messages.length > 0;

  // Efecto para hacer scroll al final solo cuando la conversación ha comenzado
  useEffect(() => {
    if (conversationStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, conversationStarted]);

  // Clases del contenedor de mensajes CONDICIONALES
  const messageContainerClasses: string = conversationStarted
    ? "flex-1 flex flex-col"
    : "flex flex-col items-center justify-center";

  return {
    inputValue,
    setInputValue,
    handleSubmit,
    isButtonDisabled: isButtonDisabled,
    inputRef,
    messages,
    isLoading,
    messageContainerClasses,
    messagesEndRef,
  }
}