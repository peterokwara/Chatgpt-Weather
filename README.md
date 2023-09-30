<p align="center">
  <h3 align="center">Chat Weather</h3>

  <p align="center">
A web app that gives you the weather of any city in the world.
    <br>
    </p>
</p>

<br>

## Table of contents

- [About the Website](#about-the-website)
- [Technical](#technical)
- [Licence](#license)
- [Versions](#versions)
- [Contact Information](#contact-information)

### About the website

This is a web app that gives you the weather of any city in the world. It is built using NextJs App Router, tailwindcss, ai, openai.

<p align="center">
  <img src="./assets/ChatWeather.gif"/>
</p>

### Technical

#### Technology Used

This project uses: nextjs, tailwindcss, ai, openai

#### Running the project

Ensure that you have the openai api key in the `.env` file. This can be generated here https://platform.openai.com/account/api-keys

Also ensure that you have the weatherapi key. This can be generated here https://www.weatherapi.com/

Install the project dependencies by running

```console
pnpm install
```

And then navigate to https://localhost:3000 to view the project (in case no other sveltekit project is running).

#### Step by step guide

1. Create a new nextjs project by running

```console
npx create-next-app@latest
```

Ensure that you use app router and tailwindcss

2. Install the following packages

```console
pnpm install ai openai clsx react-markdown react-textarea-autosize react-gfm
```

Here is what the packages do

- `ai`: A package for interacting with the OpenAI API, developed by Vercel, which provides access to advanced natural language processing models.
- `openai`: A package for interacting with the OpenAI API, which provides access to advanced natural language processing models.
- `clsx`: A utility for conditionally joining classNames together in React components.
- `react-markdown`: A package for rendering Markdown content as React components.
- `react-textarea-autosize`: A package for creating a textarea component that automatically resizes based on its content.
- `react-gfm`: A package for rendering GitHub Flavored Markdown as React components.
- `lucide-react`: A package that provides a set of React components that render icons from the Lucide icon set.

3. Ensure the openai key is in the `.env` file. This can be generated here https://platform.openai.com/account/api-keys The weatherapi key can be generated here https://www.weatherapi.com/ Ensure it's in this format

```
OPENAI_API_KEY=
WEATHER_API_KEY=
```

4. Let's start building the layout. Open the `app/page.tsx` file and replace the content with the following

```jsx
"use client";
export default function Chat() {
  return (
    <main className="flex flex-col items-center justify-between pb-40"></main>
  );
}
```

5. `useChat` is a utility to allow you to easily create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.

We need to set it up. Set up `useChat` and it's code.

```jsx
"use client";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, setInput, handleSubmit, isLoading } = useChat();

  return (
    <main className="flex flex-col items-center justify-between pb-40"></main>
  );
}
```

6. We will first need to create a form that will be used to send messages to the AI. We will use the `useChat` hook to handle the form submission. We will also use the `isLoading` property to disable the send button while the AI is processing the message.

Some extras are needed to make the form look good. We will use the `clsx` package to conditionally apply classes to the send button. We will also use the `react-textarea-autosize` package to create a textarea that automatically resizes based on its content.

Icons are also needed. We will use the `lucide-react` package to render icons from the Lucide icon set.

```jsx
<div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
  <form
    ref={formRef}
    onSubmit={handleSubmit}
    className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
  >
    <Textarea
      ref={inputRef}
      tabIndex={0}
      required
      rows={1}
      autoFocus
      placeholder="Send a message"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          formRef.current?.requestSubmit();
          e.preventDefault();
        }
      }}
      spellCheck={false}
      className="w-full pr-10 focus:outline-none"
    />
    <button
      className={clsx(
        "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
        disabled
          ? "cursor-not-allowed bg-white"
          : "bg-green-500 hover:bg-green-600"
      )}
      disabled={disabled}
    >
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <SendIcon
          className={clsx(
            "h-4 w-4",
            input.length === 0 ? "text-gray-300" : "text-white"
          )}
        />
      )}
    </button>
  </form>
</div>
```

```jsx
import { useRef } from "react";
import Textarea from "react-textarea-autosize";
import clsx from "clsx";
import { LoadingCircle, SendIcon } from "./icons";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import remarkGfm from "remark-gfm";
```

Also some customs are icons and are defined in the `./icons.tsx` file

```tsx
export const LoadingCircle = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 animate-spin fill-stone-600 text-stone-200"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
};

export const SendIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      strokeWidth="2"
    >
      <path
        d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
```

We need to create references to the form and input section using the `useRef` hook. Additionally, we will use the `useState` hook to manage the state of the input field.

```jsx
const formRef = useRef < HTMLFormElement > null;
const inputRef = useRef < HTMLTextAreaElement > null;
const disabled = isLoading || input.length === 0;
```

7. Create the backend server code on 'routes/api/chat/route.ts'

```tsx
import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { functions, runFunction } from "./functions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
    stream: true,
    functions,
    function_call: "auto",
  });

  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      const result = await runFunction(name, args);
      const newMessages = createFunctionCallMessages(result);
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        stream: true,
        messages: [...messages, ...newMessages],
      });
    },
  });

  return new StreamingTextResponse(stream);
}
```

8. Create a functions file on 'routes/api/chat/functions.ts' The function will be used to get the weather data of a city

```tsx
import { type CompletionCreateParams } from "openai/resources/chat/index";

export const functions: CompletionCreateParams.Function[] = [
  {
    name: "get_weather_data",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        },
      },
      required: ["location"],
    },
  },
];

export async function get_weather_data(location: string) {
  return fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no`,
    { next: { revalidate: 60 } }
  ).then((res) => res.json());
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "get_weather_data":
      return await get_weather_data(args["location"]);
    default:
      return null;
  }
}
```

### License

- see [LICENSE](https://github.com/peterokwara/Chatgpt-Weather/blob/main/LICENSE) file

### Versions

- Version 1.0 DATE 10/04/2022

### Contact Information

If you have found any bugs, or have any feedback or questions and or want to post a feature request please use the [Issuetracker](https://github.com/peterokwara/Chatgpt-Weather/issues) to report them.

<hr>

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source-200x33.png?v=103)](#)

<br>

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](https://github.com/peterokwara/business-name-generator/blob/master/LICENSE)
