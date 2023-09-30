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
