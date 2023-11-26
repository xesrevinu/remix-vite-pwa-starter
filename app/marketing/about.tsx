export function AboutScreen() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Our leadership</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Creative people</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col rounded-xl p-4 md:p-6 bg-white border border-border bg-card">
          <div className="flex items-center gap-x-4">
            <img className="rounded-full w-20 h-20" src="/images/ray.png" alt="Image Description" />
            <div className="grow">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Ray</h3>
              <p className="text-xs uppercase text-gray-500">#Developer #Love</p>
            </div>
          </div>
          <p className="mt-3 text-gray-500">I am developer, work for myself, build my own products.</p>
        </div>

        {/* full row */}
        <div className="flex flex-col rounded-xl p-4 md:p-6 bg-white border border-border bg-card">
          <div className="flex items-center gap-x-4">
            <img
              className="rounded-full w-20 h-20"
              src="https://images.unsplash.com/photo-1593642532452-7d3baf4f5cfb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&amp;ixlib=rb-4.0.3&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=900&amp;h=900&amp;q=80"
              alt="Image Description"
            />
            <div className="grow">
              <h3 className="font-medium text-gray-800 dark:text-gray-200">ChatGPT</h3>
              <p className="text-xs uppercase text-gray-500">Ray Best Assistant</p>
            </div>
          </div>
          <p className="mt-3 text-gray-500">If OPENAI goes down, then I'm done for.</p>
        </div>
      </div>
    </div>
  );
}
