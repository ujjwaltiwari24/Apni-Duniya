"use client";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/firebase/config";

import {
  useEffect,
  useState,
} from "react";

export default function AdminPage() {

  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchUsers = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "users")
        );

      const usersData =
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setUsers(usersData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchUsers();

  }, []);

  const deleteUser = async (
    userId: string
  ) => {

    const confirmDelete =
      confirm(
        "Delete this user?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "users", userId)
      );

      setUsers(
        users.filter(
          (user) => user.id !== userId
        )
      );

      alert("User Deleted");

    } catch (error) {

      console.error(error);

      alert("Delete Failed");

    }

  };

  return (
    <main className="min-h-screen bg-black text-white p-8">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold mb-3">
          Admin Dashboard ☕
        </h1>

        <p className="text-zinc-400 text-lg">
          Manage ApniDuniya users
        </p>

      </div>

      {/* Stats */}
      <div className="mb-10">

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-fit">

          <h2 className="text-zinc-400 mb-2">
            Total Users
          </h2>

          <p className="text-4xl font-bold">
            {users.length}
          </p>

        </div>

      </div>

      {/* Loading */}
      {
        loading && (
          <p className="text-zinc-400">
            Loading users...
          </p>
        )
      }

      {/* Users */}
      <div className="grid gap-5">

        {
          users.map((user) => (

            <div
              key={user.id}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-6 flex items-center justify-between flex-wrap gap-5"
            >

              {/* Left Side */}
              <div className="flex items-center gap-5">

                <img
                  src={
                    user.photo ||
                    "https://via.placeholder.com/100"
                  }
                  alt="profile"
                  className="w-16 h-16 rounded-full border border-white/10"
                />

                <div>

                  <h2 className="text-2xl font-semibold">
                    {user.name || "Unknown"}
                  </h2>

                  <p className="text-zinc-400">
                    {user.email}
                  </p>

                  <p className="text-zinc-500 text-sm mt-1 break-all">
                    UID: {user.uid}
                  </p>

                  <p className="text-zinc-500 text-sm">

                    Joined: {

                      user.createdAt?.seconds

                        ? new Date(
                            user.createdAt.seconds * 1000
                          ).toLocaleString()

                        : "N/A"

                    }

                  </p>

                </div>

              </div>

              {/* Right Side */}
              <div>

                <button
                  onClick={() =>
                    deleteUser(user.id)
                  }
                  className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-2xl font-semibold"
                >
                  Delete User
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </main>
  );

}