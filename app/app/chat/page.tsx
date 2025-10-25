import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ChatKitClient } from "./chat-kit-client";
import { CHATKIT_AUTH_COOKIE, issueAuthToken, verifyAuthToken } from "./chatkit-auth";

export const metadata: Metadata = {
  title: "Chat | EcoTrips Atlas",
};

export default function ChatPage() {
  const domainKey = process.env.CHATKIT_DOMAIN_KEY;

  if (!domainKey) {
    console.error("CHATKIT_DOMAIN_KEY is not configured");
    return (
      <div className="container">
        <div className="card">
          <div className="h1">ChatKit setup incomplete</div>
          <p className="subtle">
            Set <code>CHATKIT_DOMAIN_KEY</code> in your environment to enable the concierge experience.
          </p>
        </div>
      </div>
    );
  }

  const cookieStore = cookies();
  const existingToken = cookieStore.get(CHATKIT_AUTH_COOKIE)?.value ?? null;

  if (!existingToken || !verifyAuthToken(existingToken, domainKey)) {
    const issued = issueAuthToken(domainKey);
    cookieStore.set({
      name: CHATKIT_AUTH_COOKIE,
      value: issued.token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: issued.maxAge,
      path: "/",
    });
  }

  return <ChatKitClient />;
}
