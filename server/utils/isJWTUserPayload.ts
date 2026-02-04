import type { JwtUserPayload } from "../types/jwt";

export const isJwtUserPayload = (
  payload: unknown
): payload is JwtUserPayload => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "email" in payload &&
    typeof (payload as any).id === "number" &&
    typeof (payload as any).email === "string"
  );
};
