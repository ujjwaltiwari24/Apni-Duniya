"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import {
  db,
} from "@/firebase/config";

/* ════════════════════════════════
   RANDOM ANON NAMES
════════════════════════════════ */

const names = [

  "Silent Soul",
  "Midnight Human",
  "Rain Walker",
  "Lost Dreamer",
  "Lonely Bird",
  "Cloud Person",
  "Night Owl",
  "Wandering Mind",
  "Calm Stranger",
  "Coffee Soul",
  "Moon Listener",
  "Quiet Human",
  "Fading Thought",
  "Soft Echo",
  "Drifting Soul",

];

const emojis = [
  "🌙",
  "☕",
  "🌧️",
  "✨",
  "🕯️",
  "🍂",
  "🎧",
  "🌌",
  "💭",
];

function randomItem(arr: string[]) {

  return arr[
    Math.floor(
      Math.random() *
      arr.length
    )
  ];

}

function formatTime(ms: number) {

  const diff =
    Date.now() - ms;

  const sec =
    Math.floor(diff / 1000);

  if (sec < 60)
    return `${sec}s ago`;

  const min =
    Math.floor(sec / 60);

  return `${min}m ago`;

}

export default function SecretWall() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [sending, setSending] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const randomIdentity =
  useMemo(() => {

    return {

      name:
        `${randomItem(names)} #${Math.floor(
          1000 +
          Math.random() * 9000
        )}`,

      emoji:
        randomItem(emojis),

    };

  }, []);

  /* ════════════════════════════════
     FETCH LIVE MESSAGES
  ════════════════════════════════ */

  useEffect(() => {

    const q =
      query(
        collection(
          db,
          "anonymousChat"
        ),
        orderBy(
          "createdAt",
          "asc"
        )
      );

    const unsub =
      onSnapshot(
        q,
        async (snapshot) => {

          const data =
            snapshot.docs.map(
              (docu) => ({

                id:
                  docu.id,

                ...docu.data(),

              })
            );

          setMessages(data);

          // AUTO DELETE AFTER 1 MIN
          data.forEach(
            async (msg: any) => {

              const age =
                Date.now() -
                msg.createdAt;

              if (
                age > 86400000
              ) {

                try {

                  await deleteDoc(
                    doc(
                      db,
                      "anonymousChat",
                      msg.id
                    )
                  );

                } catch (_) {}

              }

            }
          );

          setTimeout(() => {

            bottomRef.current?.scrollIntoView({
              behavior:
                "smooth",
            });

          }, 100);

        }
      );

    return () => unsub();

  }, []);

  /* ════════════════════════════════
     SEND MESSAGE
  ════════════════════════════════ */

  const sendMessage =
    async () => {

      if (
        !message.trim()
      )
        return;

      try {

        setSending(true);

        await addDoc(
          collection(
            db,
            "anonymousChat"
          ),
          {

            text:
              message.trim(),

            createdAt:
              Date.now(),

            name:
              randomIdentity.name,

            emoji:
              randomIdentity.emoji,

          }
        );

        setMessage("");

      } catch (err) {

        console.log(err);

      } finally {

        setSending(false);

      }

    };

  /* ════════════════════════════════
     ENTER KEY SEND
  ════════════════════════════════ */

  const handleKeyDown =
    (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {

      if (
        e.key === "Enter"
      ) {

        sendMessage();

      }

    };

  return (
    <div
      style={{

        width: "100%",

        padding: 18,

        borderRadius: 24,

        background:
          "rgba(10,10,12,0.82)",

        border:
          "1px solid rgba(255,255,255,0.06)",

        backdropFilter:
          "blur(22px)",

        WebkitBackdropFilter:
          "blur(22px)",

        boxShadow:
          "0 10px 50px rgba(0,0,0,0.28)",

        overflow:
          "hidden",

      }}
    >

      {/* HEADER */}
      <div
        style={{

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          marginBottom: 16,

        }}
      >

        <div>

          <h2
            style={{

              margin: 0,

              fontSize: 20,

              fontWeight: 700,

              color:
                "rgba(255,255,255,0.95)",

            }}
          >

            🌙 Anonymous Chat

          </h2>

          <p
            style={{

              marginTop: 6,

              color:
                "rgba(255,255,255,0.55)",

              fontSize: 12,

              lineHeight:
                1.6,

            }}
          >

            Virtual space for sharing thoughts anonymously.
            Messages disappear after 24 hours.

          </p>

        </div>

        <div
          style={{

            display: "flex",

            alignItems:
              "center",

            gap: 6,

            color:
              "#59d87b",

            fontSize: 11,

          }}
        >

          <div
            style={{

              width: 7,

              height: 7,

              borderRadius:
                "50%",

              background:
                "#59d87b",

            }}
          />

          LIVE

        </div>

      </div>

      {/* CHAT AREA */}
      <div
        style={{

          display: "flex",

          flexDirection:
            "column",

          gap: 12,

          maxHeight: 320,

          overflowY:
            "auto",

          paddingRight: 4,

          marginBottom: 16,

        }}
      >

        {
          messages.length === 0 && (

            <div
              style={{

                padding: 18,

                borderRadius:
                  18,

                background:
                  "rgba(255,255,255,0.03)",

                border:
                  "1px dashed rgba(255,255,255,0.08)",

                color:
                  "rgba(255,255,255,0.45)",

                fontSize: 13,

                lineHeight:
                  1.7,

              }}
            >

              No messages yet.
              Start the vibe ✨

            </div>

          )
        }

        {
          messages.map(
            (msg) => (

              <div
                key={msg.id}
                style={{

                  padding: 14,

                  borderRadius:
                    18,

                  background:
                    "rgba(255,255,255,0.045)",

                  border:
                    "1px solid rgba(255,255,255,0.05)",

                }}
              >

                {/* TOP */}
                <div
                  style={{

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "space-between",

                    marginBottom: 10,

                  }}
                >

                  <div
                    style={{

                      display: "flex",

                      alignItems:
                        "center",

                      gap: 8,

                    }}
                  >

                    <div
                      style={{
                        fontSize: 18,
                      }}
                    >

                      {
                        msg.emoji
                      }

                    </div>

                    <div
                      style={{

                        fontSize: 13,

                        fontWeight: 600,

                        color:
                          "rgba(255,255,255,0.88)",

                      }}
                    >

                      {
                        msg.name
                      }

                    </div>

                  </div>

                  <div
                    style={{

                      fontSize: 11,

                      color:
                        "rgba(255,255,255,0.35)",

                    }}
                  >

                    {
                      formatTime(
                        msg.createdAt
                      )
                    }

                  </div>

                </div>

                {/* MESSAGE */}
                <div
                  style={{

                    color:
                      "rgba(255,255,255,0.82)",

                    fontSize: 14,

                    lineHeight:
                      1.8,

                    wordBreak:
                      "break-word",

                  }}
                >

                  {
                    msg.text
                  }

                </div>

              </div>

            )
          )
        }

        <div ref={bottomRef} />

      </div>

      {/* INPUT */}
      <div
        style={{

          display: "flex",

          gap: 10,

        }}
      >

        <input
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          maxLength={180}
          placeholder="Share a thought..."
          style={{

            flex: 1,

            padding:
              "14px 16px",

            borderRadius:
              16,

            border:
              "1px solid rgba(255,255,255,0.06)",

            background:
              "rgba(255,255,255,0.05)",

            color: "white",

            outline: "none",

            fontSize: 14,

          }}
        />

        <button
          onClick={
            sendMessage
          }
          disabled={
            sending
          }
          style={{

            padding:
              "0 20px",

            borderRadius:
              16,

            border:
              "1px solid rgba(255,220,140,0.12)",

            background:
              sending

                ? "rgba(255,255,255,0.08)"

                : "linear-gradient(135deg,#b8863b,#e0b15f)",

            color:
              sending
                ? "rgba(255,255,255,0.5)"
                : "#120c03",

            fontWeight: 700,

            cursor:
              sending
                ? "not-allowed"
                : "pointer",

            transition:
              "all 0.2s ease",

          }}
        >

          {
            sending
              ? "..."
              : "Send"
          }

        </button>

      </div>

    </div>
  );

}