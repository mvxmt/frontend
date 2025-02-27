"use client";

import Link from "next/link";

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) {
  return (
    <div className="mb-10">
      <div className="flex justify-center"></div>
      <h2 className="mt-6 text-center font-sans text-3xl text-secondary">
        {heading}
      </h2>
      <p className="mt-2 mt-5 text-center font-sans text-sm text-gray-600 text-secondary">
        {paragraph}{" "}
        <Link
          href={linkUrl}
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}
