export async function generateMetadata() {
  const imageUrl = `https://next-pppop.vercel.app/api/home/image?date=${Date.now()}`;
  return {
    title: "Pppop!",
    description: "Privacy Preserving Proof of Personhood",
    openGraph: {
      title: "Pppop!",
      images: [imageUrl],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl,
      "fc:frame:post_url": "https://next-pppop.vercel.app/api/choose/action",
      "fc:frame:button:1": "Start",
    },
  };
}

export default async function Home() {
    return (
      <main className="flex flex-col text-center lg:p-16">
        <div className="mt-4">
            <h1>Have you pppop'd yet?</h1>
        </div>
      </main>
    );
  }