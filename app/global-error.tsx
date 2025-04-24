"use client" // Error components must be Client Components

import Link from "next/link"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
      <div
        className="max-w-lg mx-auto flex-1 flex-row-reverse gap-12 items-center justify-between md:max-w-none md:flex">
        <div className="flex-1 max-w-lg">
          <img alt="404-Error-amico" src="/404-amico.webp" loading="lazy" />
        </div>
        <div className="mt-12 flex-1 max-w-lg space-y-3 md:mt-0">
          <h3 className="text-indigo-600 font-semibold">
            Something went wrong!
          </h3>

          <p className="text-gray-600">Sorry, the page have some error !</p>
          <Link
            href="/"
            className="text-indigo-600 duration-150 hover:text-indigo-400 font-medium inline-flex items-center gap-x-1"
          >
            <div className="flex items-center gap-x-1">Try again</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
