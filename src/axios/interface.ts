export declare interface Props {
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  data?: unknown;
  params?: object;
  url?: string;
}
