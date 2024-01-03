import content from "@/marketing/contents/privacy.html?raw";

export function PrivacyScreen() {
  return (
    <div className="container mx-auto pt-10">
      <p className="text-2xl font-bold">Privacy Policy</p>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} suppressHydrationWarning />
    </div>
  );
}
