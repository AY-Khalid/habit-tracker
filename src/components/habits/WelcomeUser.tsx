"use client";

import { getUsers } from "@/lib/storage";


export default function WelcomeUser() {


      const user = getUsers()[0];

      const username =
        user?.email.split("@")[0];

      const formattedName =
        username
          ? username.charAt(0).toUpperCase() + username.slice(1)
          : "User";

      const hour = new Date().getHours();

      let greeting = "Good evening";

      if (hour < 12) {
        greeting = "Good morning";
      } else if (hour < 17) {
        greeting = "Good afternoon";
      }

  return (
    <div className="mb-6 p-8 bg-indigo-100 rounded-sm">
      <h2 className="text-lg font-bold text-indigo-700">
        {greeting}, {formattedName}!
      </h2>

      <p className="text-gray-600 mt-2">
        Here’s a quick overview of your habits and progress.
      </p>
    </div>
  );
}