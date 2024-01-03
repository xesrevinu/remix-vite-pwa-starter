import content from "@/marketing/contents/terms.html?raw";

export function TermsScreen() {
  return (
    <div className="container mx-auto pt-10">
      <p className="text-2xl font-bold">Terms of Service</p>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} suppressHydrationWarning />
    </div>
  );
}
