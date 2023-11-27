import { Button } from "@/components/ui/button";

export function InvoicesScreen() {
  return (
    <div className="px-4 container mx-auto py-4">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Invoices</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Create invoices, edit, download and more.</p>
      </div>

      <div className="min-h-[400px] flex flex-col items-center justify-center mx-auto">
        <h2 className="mt-5 font-semibold text-gray-800 dark:text-white">No draft test invoices</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Draft an invoice and send it to a customer.</p>
        <div>
          <a
            className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="../docs/index.html"
          >
            {" "}
            Learn more{" "}
          </a>
        </div>
        <div className="mt-5 grid sm:flex gap-2">
          <Button>Create a new invoice</Button>
          <Button variant={"outline"}>Use a Template</Button>
        </div>
      </div>

      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">0</span> results
          </p>
        </div>
        <div>
          <div className="inline-flex gap-x-2">
            <button
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              disabled
              type="button"
            >
              {" "}
              Prev{" "}
            </button>{" "}
            <button
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              disabled
              type="button"
            >
              {" "}
              Next{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
