import { Link, Links } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border border-opacity-50">
      <div className="container px-5 py-1.5 mx-auto flex items-center sm:flex-row flex-col">
        <p className="sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0 mt-4">
          Made with ❤️ by
          <a href="https://twitter.com/xesrevinu" className="ml-1" rel="noopener noreferrer" target="_blank">
            @Ray
          </a>
          &nbsp;and&nbsp;
          <a href="https://github.com/remix-run/remix" rel="noopener noreferrer" target="_blank">
            Remix
          </a>
        </p>
        <div className="flex sm:ml-auto sm:py-0 py-4 justify-center sm:justify-start space-x-4">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
