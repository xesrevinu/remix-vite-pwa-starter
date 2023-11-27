import { InstallAppPrompt } from "@/components/app-life-cycle/install-prompt";
import { Link } from "@remix-run/react";

export function MarketingHomeScreen() {
  return (
    <div>
      <div className="relative">
        <div className="-mt-24 md:-mt-14 pointer-events-none overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('/images/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('/images/polygon-bg-element-dark.svg')]" />

        <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10">
          <div className="mt-5 max-w-2xl text-center mx-auto">
            <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl dark:text-gray-200">
              Welcome to{" "}
              <span className="bg-clip-text bg-gradient-to-tl from-blue-600 to-violet-600 text-transparent">Remix</span>
            </h1>
          </div>
          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Welcome to the Remix Starter. This is a pre-configured starter project for Remix that includes Marketing
              Pages, Theme, PWA, and more.
            </p>
          </div>
          <div className="mt-8 gap-3 flex justify-center">
            <Link
              to="/sign-in"
              className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 border border-transparent text-white text-sm font-medium rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-4 dark:focus:ring-offset-gray-800"
            >
              Get started
            </Link>
          </div>
          <div className="mt-6 flex justify-center">
            <ul className="list-disc space-y-1 mt-4">
              <li>
                <a className="hover:underline" target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
                  15m Quickstart Blog Tutorial
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  target="_blank"
                  href="https://remix.run/tutorials/jokes"
                  rel="noreferrer"
                >
                  Deep Dive Jokes App Tutorial
                </a>
              </li>
              <li>
                <a className="hover:underline" target="_blank" href="https://remix.run/docs" rel="noreferrer">
                  Remix Docs
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-8 flex justify-center">
            <InstallAppPrompt />
          </div>
        </div>
      </div>
    </div>
  );
}
