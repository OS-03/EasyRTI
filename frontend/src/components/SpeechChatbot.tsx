import { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"; // Import Popover components

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: typeof window.SpeechRecognition;
        puter: any; // Declare Puter.js globally
    }
}

interface ImportMetaEnv {
    readonly VITE_MAPBOX_ACCESS_TOKEN: string;
    readonly VITE_OPENWEATHER_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

const SpeechChatbot = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [recognition, setRecognition] = useState<null | (typeof window.SpeechRecognition)>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const speechQueue = useRef<string[]>([]);
    const isSpeaking = useRef(false);

    useEffect(() => {
        const speechRecognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
        setRecognition(speechRecognition);

        
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                if (availableVoices.length === 0) {
                    console.warn("No voices available. Retrying...");
                } else {
                    console.log("Voices loaded successfully:", availableVoices);
                    setVoices(availableVoices);
                }
            };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        setMessages(["Bot: Hi! How can I assist you today?"]);
    }, []);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const processSpeechQueue = () => {
        const synth = window.speechSynthesis;

        if (isSpeaking.current || speechQueue.current.length === 0) {
            return;
        }

        const text = speechQueue.current.shift();
        if (!text) return;

        const validVoices = voices.filter((voice) => voice.name && voice.lang);
        const selectedVoice =
            validVoices.find((voice) => voice.name === "Aaron") || // Prioritize the Aaron voice
            validVoices.find((voice) => voice.name === "Google UK English Female") ||
            validVoices.find((voice) => voice.name === "Google US English") ||
            validVoices.find((voice) => voice.lang === "en-US") ||
            validVoices.find((voice) => voice.lang === "en-GB") ||
            validVoices[0]; // Fallback to the first available voice

        console.log("Selected Voice:", selectedVoice);
        console.log("Available Voices:", validVoices);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.onstart = () => {
            isSpeaking.current = true;
        };
        utterance.onend = () => {
            isSpeaking.current = false;
            processSpeechQueue();
        };
        utterance.onerror = () => {
            isSpeaking.current = false;
            processSpeechQueue();
        };

        synth.speak(utterance);
    };

    const speak = (text: string, p0: number = 1, p1: number = 1) => {
        if (speechQueue.current.length > 0 && speechQueue.current[speechQueue.current.length - 1] === text) {
            return;
        }

        speechQueue.current.push(text);
        if (!isSpeaking.current) {
            processSpeechQueue();
        }
    };

    const fetchWeatherWithPermission = async () => {
        try {
            if (!navigator.geolocation) {
                return "Geolocation is not supported by your browser.";
            }

            return new Promise<string>((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const apiKey = (import.meta as any).env.VITE_OPENWEATHER_API_KEY;
                        const response = await fetch(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
                        );

                        if (!response.ok) {
                            const errorData = await response.json();
                            console.error("Weather API error:", errorData);
                            resolve(`Failed to fetch weather data. Error: ${errorData.message}`);
                            return;
                        }

                        const data = await response.json();
                        resolve(
                            `The current weather at your location is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`
                        );
                    },
                    () => {
                        resolve("Unable to retrieve your location. Please specify a location to get the weather details.");
                    }
                );
            });
        } catch (error) {
            console.error("Error fetching weather with permission:", error);
            return "Sorry, I couldn't fetch the weather details.";
        }
    };


    const fetchLocation = async (query: string) => {
        try {
            const accessToken = (import.meta as any).env.VITE_MAPBOX_ACCESS_TOKEN;
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}`
            );
            if (!response.ok) {
                return "Failed to fetch location data.";
            }
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const place = data.features[0];
                return `The location "${query}" is at latitude ${place.center[1]} and longitude ${place.center[0]}.`;
            } else {
                return `Sorry, I couldn't find any location matching "${query}".`;
            }
        } catch (error) {
            return "Sorry, I couldn't fetch the location details.";
        }
    };

    const sendMessage = (message: string) => {
        if (!message.trim()) return;

        // Add user message to the chat
        setMessages((prev) => [...prev, `You: ${message}`]);

        // Handle RTI-specific queries directly
        if (message.toLowerCase().includes("file an rti")) {
            const botMessage = "To file an RTI, visit the 'File RTI' section on our portal and fill out the required details.";
            setMessages((prev) => [...prev, `Bot: ${botMessage}`]);
            speak(botMessage);
            return;
        }

        if (message.toLowerCase().includes("status of my rti")) {
            const botMessage = "You can check the status of your RTI by visiting the 'RTI Status' section and entering your application number.";
            setMessages((prev) => [...prev, `Bot: ${botMessage}`]);
            speak(botMessage);
            return;
        }

        if (message.toLowerCase().includes("documents required for rti")) {
            const botMessage = "The documents required for filing an RTI include proof of identity and any supporting documents related to your query.";
            setMessages((prev) => [...prev, `Bot: ${botMessage}`]);
            speak(botMessage);
            return;
        }

        if (message.toLowerCase().includes("where is my rti portal")) {
            const botMessage = `If you are looking for the Right to Information (RTI) portal in India, you can access it through the official government website. 
            The main portal for submitting RTI applications online is the **Central Government RTI Online Portal**, which can be found at:
            - **RTI Online Portal**: [rtionline.gov.in](https://rtionline.gov.in)
            
            If you're looking for the RTI portal of a specific state, you may need to visit the official website of that state's government to find the appropriate RTI portal. 
            Each state in India may have its own RTI portal for citizens to file applications. If you have a specific state or area in mind, please let me know, and I can provide more detailed information!`;
            setMessages((prev) => [...prev, `Bot: ${botMessage}`]);
            speak(botMessage);
            return;
        }

        // Handle location-based queries
        if (message.toLowerCase().includes("what is my location")) {
            fetchWeatherWithPermission()
                .then((locationMessage) => {
                    setMessages((prev) => [...prev, `Bot: ${locationMessage}`]);
                    speak(locationMessage);
                })
                .catch((error) => {
                    console.error("Error fetching location:", error);
                    const errorMessage = "Bot: Sorry, I couldn't fetch your location details. Please try again later.";
                    setMessages((prev) => [...prev, errorMessage]);
                    speak(errorMessage, 1, 0.8);
                });
            return;
        }

        if (message.toLowerCase().includes("weather in")) {
            const location = message.split("weather in")[1]?.trim();
            if (location) {
                fetchLocation(location)
                    .then((locationMessage) => {
                        setMessages((prev) => [...prev, `Bot: ${locationMessage}`]);
                        speak(locationMessage);
                    })
                    .catch((error) => {
                        console.error("Error fetching location weather:", error);
                        const errorMessage = `Bot: Sorry, I couldn't fetch the weather details for ${location}. Please try again later.`;
                        setMessages((prev) => [...prev, errorMessage]);
                        speak(errorMessage, 1, 0.8);
                    });
            } else {
                fetchWeatherWithPermission()
                    .then((weatherMessage) => {
                        setMessages((prev) => [...prev, `Bot: ${weatherMessage}`]);
                        speak(weatherMessage);
                    })
                    .catch((error) => {
                        console.error("Error fetching weather with permission:", error);
                        const errorMessage = "Bot: Sorry, I couldn't fetch the weather details for your current location. Please try again later.";
                        setMessages((prev) => [...prev, errorMessage]);
                        speak(errorMessage, 1, 0.8);
                    });
            }
            return;
        }

        // Fallback to AI chat for other queries
        const chatHistory = messages.map((msg) => ({
            content: msg.replace(/^You: |Bot: /, ""),
            role: msg.startsWith("You:") ? "user" : "assistant",
        }));
        chatHistory.push({ content: message, role: "user" });

        window.puter.ai.chat(chatHistory)
            .then((response: any) => {
                const botMessage = response?.message?.content || "I'm sorry, I couldn't process your request.";
                setMessages((prev) => [...prev, `Bot: ${botMessage}`]);
                speak(botMessage); // Speak the bot's response
            })
            .catch((error: any) => {
                console.error("AI response error:", error);
                const errorMessage = "Bot: Sorry, I couldn't process your request.";
                setMessages((prev) => [...prev, errorMessage]);
                speak(errorMessage, 1, 0.8); // Slightly lower volume for error messages
            });
    };

    const startListening = () => {
        if (!recognition) {
            console.error("SpeechRecognition is not initialized.");
            return;
        }

        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
            const userSpeech = event.results[0][0].transcript.trim();
            // Check if the user said "stop"
            if (userSpeech === "stop") {
                stopSpeaking(); // Stop the bot from speaking
                setMessages((prev) => [...prev, "You: stop", "Bot: Stopping as requested."]);
                speak("Stopping as requested.");
                return;
            }
            // Prevent duplicate user inputs
            if (messages[messages.length - 1]?.includes(`You: ${userSpeech}`)) {
                console.warn("Duplicate user input detected. Skipping.");
                return;
            }

            // Add user message and send it to the AI chat function
            setMessages((prev) => {
                const updatedMessages = [...prev, `You: ${userSpeech}`];
                sendMessage(userSpeech); // Send the user's speech to the AI chat function
                return updatedMessages; // Ensure state is updated only once
            });
        };

        recognition.onerror = (error: any) => {
            console.error("Speech recognition error:", error);

            if (error.error === "no-speech") {
                const errorMessage = "Bot: I couldn't detect any speech. Please try speaking again.";
                setMessages((prev) => [...prev, errorMessage]);
                speak(errorMessage);
            }

            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        isSpeaking.current = false;
        speechQueue.current = [];
    };

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="fixed bottom-5 left-5 w-24 h-24 bg-gradient-to-br from-orange-500 via-orange-100 via-neutral-100 to-emerald-500 rounded-full flex justify-center items-center shadow-lg cursor-pointer z-50">
                        <img
                            src="./public/chatbot_1.png"
                            alt="Chatbot Icon"
                            className="w-20 h-20 rounded-full"
                        />
                    </button>
                </PopoverTrigger>
                <div className="left-24">
                    <PopoverContent align="start" sideOffset={10} className="w-72  bg-white border border-orange-400 shadow-lg p-4 z-50 ">
                        <div className="speech-chatbot w-full rounded-t-lg">
                            <div
                                ref={chatWindowRef}
                                className="chat-window flex flex-col max-h-52 overflow-y-auto mb-4 rounded-t-lg"
                            >
                                {messages.map((msg, index) => (
                                    <p
                                        key={index}
                                        className={`mb-2 text-sm p-2 rounded-md ${msg.startsWith("Bot:")
                                                ? "bg-green-100 text-green-800 text-left self-start "
                                                : "bg-green-600 text-white text-right  self-end"
                                            }`}
                                    >
                                        {msg}
                                    </p>
                                ))}
                            </div>

                            <button
                                onClick={startListening}
                                disabled={isListening}
                                className={`w-full py-2 text-white rounded-lg  ${isListening ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                {isListening ? "Listening..." : "Start Talking"}
                            </button>


                        </div>
                    </PopoverContent>
                </div>

            </Popover>
        </div>
    );
};

export default SpeechChatbot;