import { cn } from "@/utils";
import { Link, useLoaderData } from "@remix-run/react";

export type Plan = {
  id: number;
  name: string;
  description: string;
  recommended?: boolean;
  price: number;
  features: string[];
};

export type LoaderData = {
  plans: Plan[];
};

export function PricingScreen() {
  const { plans } = useLoaderData<{
    plans: Plan[];
  }>();

  const isEmpty = plans.length === 0;

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Pricing</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Whatever your status, our offers evolve according to your needs.
        </p>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
        {plans.map((item) => {
          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col text-center shadow-xl rounded-xl p-8 border",
                item.recommended && "border-2 border-blue-600 dark:border-blue-700"
              )}
            >
              {item.recommended && (
                <p className="mb-3">
                  <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white">
                    Most popular
                  </span>
                </p>
              )}
              <h4 className="font-medium text-lg text-gray-800 dark:text-gray-200">{item.name}</h4>
              <span className="mt-5 font-bold text-5xl text-gray-800 dark:text-gray-200">
                {" "}
                <span className="font-bold text-2xl -me-2">$</span> {item.price}
              </span>
              <p className="mt-2 text-sm text-gray-500">{item.description}</p>
              <ul className="mt-7 space-y-2.5 text-sm">
                {item.features.map((feature) => {
                  return (
                    <li key={feature} className="flex space-x-2">
                      <span className="text-gray-800 dark:text-gray-400">{feature}</span>
                    </li>
                  );
                })}
              </ul>
              <Link
                className={cn(
                  "mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600",
                  item.recommended && "bg-blue-600 text-white hover:bg-blue-700 "
                )}
                to="/sign-in"
              >
                Sign in
              </Link>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">This is just a demo, everything is free.</div>
    </div>
  );
}
