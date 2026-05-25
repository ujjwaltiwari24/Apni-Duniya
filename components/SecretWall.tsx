"use client";

import {
  useEffect,
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

export default function SecretWall() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  // FETCH MESSAGES
  useEffect(() => {

    const q =
      query(
        collection(
          db,
          "secretWall"
        ),
        orderBy(
          "createdAt",
          "desc"
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

              const now =
                Date.now();

              const age =
                now -
                msg.createdAt;

              if (
                age >
                60000
              ) {

                await deleteDoc(
                  doc(
                    db,
                    "secretWall",
                    msg.id
                  )
                );

              }

            }
          );

        }
      );

    return () => unsub();

  }, []);

  // SEND MESSAGE
  const sendMessage =
    async () => {

      if (
        !message.trim()
      )
        return;

      await addDoc(
        collection(
          db,
          "secretWall"
        ),
        {

          text:
            message,

          createdAt:
            Date.now(),

        }
      );

      setMessage("");

    };

  return (
    <div
      style={{

        width: "100%",

        marginTop: 28,

        padding: 20,

        borderRadius: 24,

        background:
          "rgba(255,255,255,0.04)",

        border:
          "1px solid rgba(255,255,255,0.08)",

        backdropFilter:
          "blur(20px)",

      }}
    >

      {/* TITLE */}
      <h2
        style={{

          margin: 0,

          marginBottom: 8,

          fontSize: 24,

          fontWeight: 700,

        }}
      >

        🌙 Secret Wall

      </h2>

      <p
        style={{

          marginTop: 0,

          marginBottom: 18,

          color:
            "rgba(255,255,255,0.65)",

          lineHeight: 1.6,

          fontSize: 14,

        }}
      >

        Leave anonymous thoughts.
        Messages disappear after 1 minute.

      </p>

      {/* INPUT */}
      <div
        style={{

          display: "flex",

          gap: 12,

          marginBottom: 22,

        }}
      >

        <input
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          placeholder="Write something..."
          style={{

            flex: 1,

            padding:
              "14px 16px",

            borderRadius:
              16,

            border:
              "1px solid rgba(255,255,255,0.08)",

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
          style={{

            padding:
              "0 20px",

            borderRadius:
              16,

            border:
              "none",

            background:
              "white",

            color: "black",

            fontWeight: 700,

            cursor:
              "pointer",

          }}
        >

          Send

        </button>

      </div>

      {/* MESSAGES */}
      <div
        style={{

          display: "flex",

          flexDirection:
            "column",

          gap: 12,

          maxHeight: 340,

          overflowY:
            "auto",

        }}
      >

        {
          messages.map(
            (msg) => (

              <div
                key={msg.id}
                style={{

                  padding: 16,

                  borderRadius:
                    18,

                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.05)",

                  color:
                    "rgba(255,255,255,0.9)",

                  lineHeight:
                    1.6,

                  fontSize: 14,

                }}
              >

                {
                  msg.text
                }

              </div>

            )
          )
        }

      </div>

    </div>
  );

}