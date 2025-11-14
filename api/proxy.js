// পুরোনো কোড ডিলিট করে এটি পেস্ট করুন

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response('Error: Please provide a "url" query parameter.', {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    // মূল URL থেকে ডেটা আনা হচ্ছে
    const fetchResponse = await fetch(targetUrl, {
      headers: request.headers,
      redirect: 'follow',
    });

    // একটি নতুন Response তৈরি করা হচ্ছে, যা আমরা ব্রাউজারে ফেরত পাঠাব
    const proxyResponse = new Response(fetchResponse.body, {
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      headers: fetchResponse.headers,
    });

    // সবচেয়ে গুরুত্বপূর্ণ: CORS হেডার যোগ করা হচ্ছে
    proxyResponse.headers.set("Access-Control-Allow-Origin", "*");
    proxyResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    proxyResponse.headers.set("Access-Control-Allow-Headers", "*");

    return proxyResponse;

  } catch (error) {
    return new Response(`Error fetching the URL: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
